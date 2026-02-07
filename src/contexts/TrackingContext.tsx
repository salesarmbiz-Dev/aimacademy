import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

type EventData = Record<string, Json>;

interface TrackingContextType {
  trackEvent: (eventType: string, eventData?: EventData) => void;
  trackSessionStart: () => Promise<void>;
  trackSessionEnd: () => Promise<void>;
  trackGameStart: (gameId: string, additionalData?: EventData) => void;
  trackGameEnd: (gameId: string, score: number, xpEarned: number, additionalData?: EventData) => void;
  trackPageView: (pagePath: string, timeOnPreviousPage?: number) => void;
  sessionId: string | null;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

// Detect device type
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

// Batch configuration
const BATCH_SIZE = 5;
const FLUSH_INTERVAL_MS = 10000;

interface QueuedEvent {
  user_id: string;
  session_id: string | null;
  event_type: string;
  event_data: Json;
  page_path: string | null;
  created_at: string;
}

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuestMode } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const eventQueueRef = useRef<QueuedEvent[]>([]);
  const flushIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

  // Flush events to Supabase
  const flushEvents = useCallback(async () => {
    if (eventQueueRef.current.length === 0) return;

    const eventsToSend = [...eventQueueRef.current];
    eventQueueRef.current = [];

    try {
      await supabase.from('activity_events').insert(eventsToSend);
    } catch (error) {
      // On failure, store in localStorage for retry
      console.error('Failed to flush events:', error);
      const failedEvents = JSON.parse(localStorage.getItem('failed_tracking_events') || '[]');
      localStorage.setItem('failed_tracking_events', JSON.stringify([...failedEvents, ...eventsToSend]));
    }
  }, []);

  // Retry failed events from localStorage
  const retryFailedEvents = useCallback(async () => {
    const failedEvents = JSON.parse(localStorage.getItem('failed_tracking_events') || '[]');
    if (failedEvents.length === 0) return;

    try {
      await supabase.from('activity_events').insert(failedEvents);
      localStorage.removeItem('failed_tracking_events');
    } catch {
      // Keep in localStorage for next retry
    }
  }, []);

  // Track event (queued)
  const trackEvent = useCallback((eventType: string, eventData?: EventData) => {
    if (!user || isGuestMode) return;

    const event: QueuedEvent = {
      user_id: user.id,
      session_id: sessionIdRef.current,
      event_type: eventType,
      event_data: (eventData || {}) as Json,
      page_path: window.location.pathname,
      created_at: new Date().toISOString(),
    };

    eventQueueRef.current.push(event);

    // Flush if queue reaches batch size
    if (eventQueueRef.current.length >= BATCH_SIZE) {
      flushEvents();
    }
  }, [user, isGuestMode, flushEvents]);

  // Update daily stats
  const updateDailyStats = useCallback(async (updates: Partial<{
    total_sessions: number;
    total_time_seconds: number;
    games_played: number;
    games_completed: number;
    xp_earned: number;
    assets_created: number;
    pages_visited: number;
  }>) => {
    if (!user || isGuestMode) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Try to get existing record
      const { data: existing } = await supabase
        .from('daily_user_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('stat_date', today)
        .single();

      if (existing) {
        // Update existing
        const updateData: Record<string, number | string> = { updated_at: new Date().toISOString() };
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined && existing[key as keyof typeof existing] !== undefined) {
            updateData[key] = (existing[key as keyof typeof existing] as number || 0) + value;
          }
        });

        await supabase
          .from('daily_user_stats')
          .update(updateData)
          .eq('id', existing.id);
      } else {
        // Insert new
        await supabase.from('daily_user_stats').insert({
          user_id: user.id,
          stat_date: today,
          ...updates,
        });
      }
    } catch (error) {
      console.error('Failed to update daily stats:', error);
    }
  }, [user, isGuestMode]);

  // Track session start
  const trackSessionStart = useCallback(async () => {
    if (!user || isGuestMode) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          device_type: getDeviceType(),
        })
        .select('id')
        .single();

      if (error) throw error;

      sessionIdRef.current = data.id;
      sessionStartTimeRef.current = new Date();

      // Track login event
      trackEvent('login', { device_type: getDeviceType() });

      // Update daily stats
      await updateDailyStats({ total_sessions: 1 });

      // Retry any failed events from previous sessions
      await retryFailedEvents();

      // Start heartbeat interval (every 60 seconds)
      heartbeatIntervalRef.current = setInterval(async () => {
        if (sessionIdRef.current) {
          try {
            await supabase
              .from('user_sessions')
              .update({ session_end: new Date().toISOString() })
              .eq('id', sessionIdRef.current);
          } catch {
            // Silent fail for heartbeat
          }
        }
      }, 60000);

    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [user, isGuestMode, trackEvent, updateDailyStats, retryFailedEvents]);

  // Track session end
  const trackSessionEnd = useCallback(async () => {
    if (!sessionIdRef.current || !user) return;

    // Flush remaining events
    await flushEvents();

    const durationSeconds = sessionStartTimeRef.current
      ? Math.floor((Date.now() - sessionStartTimeRef.current.getTime()) / 1000)
      : null;

    try {
      await supabase
        .from('user_sessions')
        .update({
          session_end: new Date().toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq('id', sessionIdRef.current);

      // Update daily stats with time
      if (durationSeconds) {
        await updateDailyStats({ total_time_seconds: durationSeconds });
      }

      // Track logout event
      trackEvent('logout', { duration_seconds: durationSeconds });

    } catch (error) {
      console.error('Failed to end session:', error);
    }

    sessionIdRef.current = null;
    sessionStartTimeRef.current = null;
  }, [user, flushEvents, trackEvent, updateDailyStats]);

  // Track game start
  const trackGameStart = useCallback((gameId: string, additionalData?: EventData) => {
    trackEvent('game_start', { game_id: gameId, ...additionalData });
    updateDailyStats({ games_played: 1 });
  }, [trackEvent, updateDailyStats]);

  // Track game end
  const trackGameEnd = useCallback((gameId: string, score: number, xpEarned: number, additionalData?: EventData) => {
    trackEvent('game_complete', { 
      game_id: gameId, 
      score, 
      xp_earned: xpEarned,
      ...additionalData 
    });
    updateDailyStats({ games_completed: 1, xp_earned: xpEarned });
  }, [trackEvent, updateDailyStats]);

  // Track page view
  const trackPageView = useCallback((pagePath: string, timeOnPreviousPage?: number) => {
    trackEvent('page_view', { 
      path: pagePath, 
      time_on_previous_page_seconds: timeOnPreviousPage,
      timestamp: new Date().toISOString() 
    });
    updateDailyStats({ pages_visited: 1 });
  }, [trackEvent, updateDailyStats]);

  // Setup flush interval
  useEffect(() => {
    flushIntervalRef.current = setInterval(flushEvents, FLUSH_INTERVAL_MS);

    return () => {
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
      }
    };
  }, [flushEvents]);

  // Handle session on auth change
  useEffect(() => {
    if (user && !isGuestMode && !sessionIdRef.current) {
      trackSessionStart();
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [user, isGuestMode, trackSessionStart]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable data persistence
      if (sessionIdRef.current && user) {
        const durationSeconds = sessionStartTimeRef.current
          ? Math.floor((Date.now() - sessionStartTimeRef.current.getTime()) / 1000)
          : null;

        // Flush any remaining events via sendBeacon
        if (eventQueueRef.current.length > 0) {
          const blob = new Blob([JSON.stringify(eventQueueRef.current)], { type: 'application/json' });
          navigator.sendBeacon('/api/track-events', blob);
        }

        // Update session end via sendBeacon (as backup)
        const sessionData = {
          session_id: sessionIdRef.current,
          duration_seconds: durationSeconds,
        };
        const sessionBlob = new Blob([JSON.stringify(sessionData)], { type: 'application/json' });
        navigator.sendBeacon('/api/end-session', sessionBlob);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  return (
    <TrackingContext.Provider value={{
      trackEvent,
      trackSessionStart,
      trackSessionEnd,
      trackGameStart,
      trackGameEnd,
      trackPageView,
      sessionId: sessionIdRef.current,
    }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
