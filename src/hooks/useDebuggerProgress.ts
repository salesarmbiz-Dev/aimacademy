import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { LevelProgress } from '@/components/games/debugger/types';

interface UseDebuggerProgressReturn {
  levelProgress: Map<number, LevelProgress>;
  loading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  saveLevelResult: (level: number, result: LevelProgress) => Promise<void>;
  getHighestUnlockedLevel: () => number;
}

export const useDebuggerProgress = (): UseDebuggerProgressReturn => {
  const { user, isGuestMode } = useAuth();
  const [levelProgress, setLevelProgress] = useState<Map<number, LevelProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (isGuestMode) {
      // Use localStorage for guest mode
      const savedProgress = localStorage.getItem('debugger_progress');
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          const progressMap = new Map<number, LevelProgress>();
          Object.entries(parsed).forEach(([key, value]) => {
            progressMap.set(parseInt(key), value as LevelProgress);
          });
          setLevelProgress(progressMap);
        } catch (e) {
          console.error('Error parsing saved progress:', e);
        }
      }
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('game_debugger_results')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const progressMap = new Map<number, LevelProgress>();
      
      if (data) {
        data.forEach((row) => {
          progressMap.set(row.level, {
            level: row.level,
            score: row.score || 0,
            stars: row.stars || 0,
            completed: true,
            bugsFound: row.bugs_found || 0,
            typesCorrect: row.types_correct || 0,
            fixQualityScore: row.fix_quality_score || 0,
            timeSeconds: row.time_seconds || 0,
            xpEarned: row.xp_earned || 0,
          });
        });
      }

      setLevelProgress(progressMap);
    } catch (err) {
      console.error('Error fetching debugger progress:', err);
      setError('Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [user, isGuestMode]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const saveLevelResult = useCallback(async (level: number, result: LevelProgress) => {
    // Update local state first
    setLevelProgress(prev => {
      const newMap = new Map(prev);
      newMap.set(level, result);
      return newMap;
    });

    if (isGuestMode) {
      // Save to localStorage for guest mode
      const progressObj: Record<number, LevelProgress> = {};
      levelProgress.forEach((v, k) => {
        progressObj[k] = v;
      });
      progressObj[level] = result;
      localStorage.setItem('debugger_progress', JSON.stringify(progressObj));
      return;
    }

    if (!user) return;

    try {
      const existingProgress = levelProgress.get(level);

      if (existingProgress) {
        // Update if new score is higher
        if (result.score > existingProgress.score) {
          await supabase
            .from('game_debugger_results')
            .update({
              score: result.score,
              stars: result.stars,
              bugs_found: result.bugsFound,
              types_correct: result.typesCorrect,
              fix_quality_score: result.fixQualityScore,
              time_seconds: result.timeSeconds,
              xp_earned: result.xpEarned,
              attempts: (existingProgress as LevelProgress & { attempts?: number }).attempts ? 
                ((existingProgress as LevelProgress & { attempts?: number }).attempts || 0) + 1 : 1,
              completed_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('level', level);
        } else {
          // Just increment attempts
          await supabase
            .from('game_debugger_results')
            .update({
              attempts: (existingProgress as LevelProgress & { attempts?: number }).attempts ? 
                ((existingProgress as LevelProgress & { attempts?: number }).attempts || 0) + 1 : 1,
            })
            .eq('user_id', user.id)
            .eq('level', level);
        }
      } else {
        // Insert new record
        await supabase
          .from('game_debugger_results')
          .insert([{
            user_id: user.id,
            level: level,
            score: result.score,
            stars: result.stars,
            bugs_found: result.bugsFound,
            bugs_total: result.bugsFound, // Will be overwritten
            types_correct: result.typesCorrect,
            fix_quality_score: result.fixQualityScore,
            time_seconds: result.timeSeconds,
            attempts: 1,
            xp_earned: result.xpEarned,
          }]);
      }

      // Also update overall game progress
      await updateOverallProgress(user.id, levelProgress, level, result);
    } catch (err) {
      console.error('Error saving level result:', err);
    }
  }, [user, isGuestMode, levelProgress]);

  const updateOverallProgress = async (
    userId: string,
    currentProgress: Map<number, LevelProgress>,
    newLevel: number,
    newResult: LevelProgress
  ) => {
    // Calculate total stats
    let totalXP = 0;
    let bestScore = 0;
    let completedCount = 0;

    currentProgress.forEach((p) => {
      totalXP += p.xpEarned;
      if (p.score > bestScore) bestScore = p.score;
      if (p.completed) completedCount++;
    });

    // Add new result
    totalXP += newResult.xpEarned;
    if (newResult.score > bestScore) bestScore = newResult.score;
    completedCount++;

    const status = completedCount >= 10 ? 'completed' : 'in_progress';

    // Update user_game_progress
    const { data: existing } = await supabase
      .from('user_game_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', 'debugger')
      .single();

    if (existing) {
      await supabase
        .from('user_game_progress')
        .update({
          best_score: bestScore,
          xp_earned: totalXP,
          status: status as 'locked' | 'unlocked' | 'in_progress' | 'completed',
          last_played_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('game_id', 'debugger');
    } else {
      await supabase
        .from('user_game_progress')
        .insert([{
          user_id: userId,
          game_id: 'debugger',
          best_score: bestScore,
          attempts: 1,
          xp_earned: totalXP,
          status: status as 'locked' | 'unlocked' | 'in_progress' | 'completed',
          first_played_at: new Date().toISOString(),
          last_played_at: new Date().toISOString(),
        }]);
    }
  };

  const getHighestUnlockedLevel = useCallback((): number => {
    let highest = 1; // Level 1 is always unlocked
    
    for (let i = 1; i <= 10; i++) {
      const progress = levelProgress.get(i);
      if (progress?.completed) {
        highest = i + 1;
      } else {
        break;
      }
    }
    
    return Math.min(highest, 10);
  }, [levelProgress]);

  return {
    levelProgress,
    loading,
    error,
    refreshProgress: fetchProgress,
    saveLevelResult,
    getHighestUnlockedLevel,
  };
};
