import { useEffect, useRef, useCallback } from 'react';
import { useTracking } from '@/contexts/TrackingContext';
import type { Json } from '@/integrations/supabase/types';

type EventData = Record<string, Json>;

interface GameTrackingHook {
  startGame: (additionalData?: EventData) => void;
  endGame: (score: number, xpEarned: number, additionalData?: EventData) => void;
  exitGame: (progressPct?: number, additionalData?: EventData) => void;
  trackLevel: (level: number, score?: number, additionalData?: EventData) => void;
  trackAssetCreated: (assetType: string, qualityScore?: number, additionalData?: EventData) => void;
}

export const useGameTracking = (gameId: string): GameTrackingHook => {
  const { trackEvent, trackGameStart, trackGameEnd } = useTracking();
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasEndedRef = useRef(false);

  // Start game tracking
  const startGame = useCallback((additionalData?: EventData) => {
    if (hasStartedRef.current) return;
    
    startTimeRef.current = Date.now();
    hasStartedRef.current = true;
    hasEndedRef.current = false;
    trackGameStart(gameId, additionalData);
  }, [gameId, trackGameStart]);

  // End game tracking (completed)
  const endGame = useCallback((score: number, xpEarned: number, additionalData?: EventData) => {
    if (hasEndedRef.current || !hasStartedRef.current) return;
    
    const timeSeconds = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    hasEndedRef.current = true;
    trackGameEnd(gameId, score, xpEarned, {
      time_seconds: timeSeconds,
      ...additionalData,
    });
  }, [gameId, trackGameEnd]);

  // Exit game tracking (left without finishing)
  const exitGame = useCallback((progressPct?: number, additionalData?: EventData) => {
    if (hasEndedRef.current || !hasStartedRef.current) return;

    const timeSeconds = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    hasEndedRef.current = true;
    trackEvent('game_exit', {
      game_id: gameId,
      progress_pct: progressPct,
      time_seconds: timeSeconds,
      ...additionalData,
    });
  }, [gameId, trackEvent]);

  // Track individual level completion
  const trackLevel = useCallback((level: number, score?: number, additionalData?: EventData) => {
    trackEvent('level_complete', {
      game_id: gameId,
      level,
      score,
      ...additionalData,
    });
  }, [gameId, trackEvent]);

  // Track asset creation from game
  const trackAssetCreated = useCallback((assetType: string, qualityScore?: number, additionalData?: EventData) => {
    trackEvent('asset_created', {
      game_source: gameId,
      asset_type: assetType,
      quality_score: qualityScore,
      ...additionalData,
    });
  }, [gameId, trackEvent]);

  // Cleanup on unmount - track exit if not completed
  useEffect(() => {
    return () => {
      if (hasStartedRef.current && !hasEndedRef.current) {
        // Can't use the callback here directly, so we just log
        // The actual exit tracking should be done by the component
      }
    };
  }, []);

  return {
    startGame,
    endGame,
    exitGame,
    trackLevel,
    trackAssetCreated,
  };
};

export default useGameTracking;
