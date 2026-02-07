import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { GameProgress, GameStatus } from '@/components/games/types';

interface UseGameProgressReturn {
  progress: Map<string, GameProgress>;
  loading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  updateProgress: (gameId: string, updates: Partial<GameProgress>) => Promise<void>;
  getGameStatus: (gameId: string) => GameStatus;
  isGameUnlocked: (gameId: string, unlockRequirement?: { gameId: string; minScore: number }) => boolean;
  getTotalXP: () => number;
  getCompletedCount: () => number;
  getStreak: () => number;
}

// Demo data for guest mode or fallback
const demoProgress: GameProgress[] = [
  {
    game_id: 'spot',
    best_score: 85,
    attempts: 3,
    total_time_seconds: 1200,
    xp_earned: 250,
    status: 'completed',
    first_played_at: '2026-01-15T10:00:00Z',
    last_played_at: '2026-02-05T14:30:00Z',
  },
  {
    game_id: 'lego',
    best_score: 60,
    attempts: 1,
    total_time_seconds: 900,
    xp_earned: 100,
    status: 'in_progress',
    first_played_at: '2026-02-01T09:00:00Z',
    last_played_at: '2026-02-06T11:00:00Z',
  },
  {
    game_id: 'sop-machine',
    best_score: 0,
    attempts: 0,
    total_time_seconds: 0,
    xp_earned: 0,
    status: 'unlocked',
    first_played_at: null,
    last_played_at: null,
  },
];

export const useGameProgress = (): UseGameProgressReturn => {
  const { user, isGuestMode } = useAuth();
  const [progress, setProgress] = useState<Map<string, GameProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (isGuestMode || !user) {
      // Use demo data for guest mode
      const demoMap = new Map<string, GameProgress>();
      demoProgress.forEach(p => demoMap.set(p.game_id, p));
      setProgress(demoMap);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_game_progress')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const progressMap = new Map<string, GameProgress>();
      
      if (data && data.length > 0) {
        data.forEach((row) => {
          progressMap.set(row.game_id, {
            game_id: row.game_id,
            best_score: row.best_score || 0,
            attempts: row.attempts || 0,
            total_time_seconds: row.total_time_seconds || 0,
            xp_earned: row.xp_earned || 0,
            status: row.status as GameStatus,
            first_played_at: row.first_played_at,
            last_played_at: row.last_played_at,
          });
        });
      } else {
        // No data yet, use demo data as fallback
        demoProgress.forEach(p => progressMap.set(p.game_id, p));
      }

      setProgress(progressMap);
    } catch (err) {
      console.error('Error fetching game progress:', err);
      setError('Failed to load progress');
      // Use demo data on error
      const demoMap = new Map<string, GameProgress>();
      demoProgress.forEach(p => demoMap.set(p.game_id, p));
      setProgress(demoMap);
    } finally {
      setLoading(false);
    }
  }, [user, isGuestMode]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = useCallback(async (gameId: string, updates: Partial<GameProgress>) => {
    if (isGuestMode || !user) {
      // Update local state only for guest mode
      setProgress(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(gameId) || {
          game_id: gameId,
          best_score: 0,
          attempts: 0,
          total_time_seconds: 0,
          xp_earned: 0,
          status: 'unlocked' as GameStatus,
          first_played_at: null,
          last_played_at: null,
        };
        newMap.set(gameId, { ...existing, ...updates });
        return newMap;
      });
      return;
    }

    try {
      const existingProgress = progress.get(gameId);
      const now = new Date().toISOString();
      
      // Filter out 'coming_soon' status as it's not a DB enum value
      const dbUpdates: Record<string, unknown> = {
        best_score: updates.best_score,
        attempts: updates.attempts,
        total_time_seconds: updates.total_time_seconds,
        xp_earned: updates.xp_earned,
        last_played_at: now,
      };
      
      // Only include status if it's a valid DB enum
      if (updates.status && ['locked', 'unlocked', 'in_progress', 'completed'].includes(updates.status)) {
        dbUpdates.status = updates.status;
      }
      
      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key] === undefined) delete dbUpdates[key];
      });

      if (existingProgress) {
        await supabase
          .from('user_game_progress')
          .update(dbUpdates)
          .eq('user_id', user.id)
          .eq('game_id', gameId);
      } else {
        await supabase
          .from('user_game_progress')
          .insert([{
            user_id: user.id,
            game_id: gameId,
            best_score: updates.best_score || 0,
            attempts: updates.attempts || 0,
            total_time_seconds: updates.total_time_seconds || 0,
            xp_earned: updates.xp_earned || 0,
            status: (updates.status && ['locked', 'unlocked', 'in_progress', 'completed'].includes(updates.status)) 
              ? updates.status as 'locked' | 'unlocked' | 'in_progress' | 'completed'
              : 'unlocked',
            first_played_at: now,
            last_played_at: now,
          }]);
      }

      await fetchProgress();
    } catch (err) {
      console.error('Error updating game progress:', err);
    }
  }, [user, isGuestMode, progress, fetchProgress]);

  const getGameStatus = useCallback((gameId: string): GameStatus => {
    const gameProgress = progress.get(gameId);
    if (gameProgress) {
      return gameProgress.status;
    }
    // Default: first games are unlocked
    if (gameId === 'spot' || gameId === 'lego') {
      return 'unlocked';
    }
    return 'locked';
  }, [progress]);

  const isGameUnlocked = useCallback((
    gameId: string, 
    unlockRequirement?: { gameId: string; minScore: number }
  ): boolean => {
    // Always unlocked games
    if (gameId === 'spot' || gameId === 'lego') return true;
    
    // SOP Machine is unlocked for demo
    if (gameId === 'sop-machine') return true;

    const gameProgress = progress.get(gameId);
    if (gameProgress && (gameProgress.status === 'unlocked' || gameProgress.status === 'in_progress' || gameProgress.status === 'completed')) {
      return true;
    }

    // Check unlock requirements
    if (unlockRequirement) {
      const reqProgress = progress.get(unlockRequirement.gameId);
      if (reqProgress && reqProgress.best_score >= unlockRequirement.minScore) {
        return true;
      }
    }

    return false;
  }, [progress]);

  const getTotalXP = useCallback((): number => {
    let total = 0;
    progress.forEach(p => {
      total += p.xp_earned;
    });
    return total;
  }, [progress]);

  const getCompletedCount = useCallback((): number => {
    let count = 0;
    progress.forEach(p => {
      if (p.status === 'completed') count++;
    });
    return count;
  }, [progress]);

  const getStreak = useCallback((): number => {
    // Mock streak calculation - in real app would check consecutive days
    return 5;
  }, []);

  return {
    progress,
    loading,
    error,
    refreshProgress: fetchProgress,
    updateProgress,
    getGameStatus,
    isGameUnlocked,
    getTotalXP,
    getCompletedCount,
    getStreak,
  };
};
