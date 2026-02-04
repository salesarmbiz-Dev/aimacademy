import { useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export const useActivityTracker = () => {
  const { user, isGuestMode } = useAuth();
  const sessionId = useRef(crypto.randomUUID());

  const trackActivity = useCallback(async (
    activityType: string,
    activityData?: Record<string, Json>
  ) => {
    // Don't track for guest mode
    if (!user || isGuestMode) return;

    try {
      await supabase.from('user_activity_log').insert([{
        user_id: user.id,
        activity_type: activityType,
        activity_data: (activityData || {}) as Json,
        session_id: sessionId.current,
      }]);
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }, [user, isGuestMode]);

  // Track login on mount
  useEffect(() => {
    if (user && !isGuestMode) {
      trackActivity('login');
    }
  }, [user, isGuestMode, trackActivity]);

  return { trackActivity, sessionId: sessionId.current };
};
