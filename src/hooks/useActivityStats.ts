import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ActivityStats {
  totalTimeSeconds: number;
  totalSessions: number;
  gamesPlayed: number;
  gamesCompleted: number;
  assetsCreated: number;
  totalXpEarned: number;
  averageSessionMinutes: number;
}

interface RecentActivity {
  id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export const useActivityStats = () => {
  const { user, isGuestMode } = useAuth();
  const [stats, setStats] = useState<ActivityStats>({
    totalTimeSeconds: 0,
    totalSessions: 0,
    gamesPlayed: 0,
    gamesCompleted: 0,
    assetsCreated: 0,
    totalXpEarned: 0,
    averageSessionMinutes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user || isGuestMode) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch aggregated daily stats
      const { data: dailyStats } = await supabase
        .from('daily_user_stats')
        .select('*')
        .eq('user_id', user.id);

      if (dailyStats && dailyStats.length > 0) {
        const aggregated = dailyStats.reduce((acc, day) => ({
          totalTimeSeconds: acc.totalTimeSeconds + (day.total_time_seconds || 0),
          totalSessions: acc.totalSessions + (day.total_sessions || 0),
          gamesPlayed: acc.gamesPlayed + (day.games_played || 0),
          gamesCompleted: acc.gamesCompleted + (day.games_completed || 0),
          assetsCreated: acc.assetsCreated + (day.assets_created || 0),
          totalXpEarned: acc.totalXpEarned + (day.xp_earned || 0),
        }), {
          totalTimeSeconds: 0,
          totalSessions: 0,
          gamesPlayed: 0,
          gamesCompleted: 0,
          assetsCreated: 0,
          totalXpEarned: 0,
        });

        setStats({
          ...aggregated,
          averageSessionMinutes: aggregated.totalSessions > 0 
            ? Math.round((aggregated.totalTimeSeconds / aggregated.totalSessions) / 60)
            : 0,
        });
      }

      // Fetch recent activity events
      const { data: events } = await supabase
        .from('activity_events')
        .select('id, event_type, event_data, created_at')
        .eq('user_id', user.id)
        .in('event_type', ['game_complete', 'asset_created', 'assessment_complete', 'badge_earned', 'level_up'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (events) {
        setRecentActivity(events.map(e => ({
          ...e,
          event_data: (e.event_data || {}) as Record<string, unknown>
        })));
      }

    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isGuestMode]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Format time for display
  const formatTime = (seconds: number): { hours: number; minutes: number } => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  // Estimate asset value
  const estimateAssetValue = (assetsCount: number): number => {
    // Rough estimate: prompts = 10K, SOPs = 150K, patterns = 5K
    // Average ~55K per asset
    return assetsCount * 55000;
  };

  return {
    stats,
    recentActivity,
    isLoading,
    formatTime,
    estimateAssetValue,
    refetch: fetchStats,
  };
};

export default useActivityStats;
