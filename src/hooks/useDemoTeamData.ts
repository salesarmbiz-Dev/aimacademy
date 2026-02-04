import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DemoMember {
  id: string;
  display_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  pre_test_score: number | null;
  post_test_score: number | null;
  score_change: number | null;
  last_active: string | null;
  challenges_completed: number;
}

export interface DemoStats {
  totalMembers: number;
  completedMembers: number;
  activeThisWeek: number;
  averageImprovement: number;
}

export interface EngagementDataPoint {
  date: string;
  activeUsers: number;
}

export interface SkillAverage {
  skill: string;
  skillLabel: string;
  preTest: number;
  postTest: number;
}

export const useDemoTeamData = (orgId: string | undefined) => {
  const [members, setMembers] = useState<DemoMember[]>([]);
  const [stats, setStats] = useState<DemoStats>({
    totalMembers: 0,
    completedMembers: 0,
    activeThisWeek: 0,
    averageImprovement: 0,
  });
  const [engagementData, setEngagementData] = useState<EngagementDataPoint[]>([]);
  const [skillAverages, setSkillAverages] = useState<SkillAverage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDemoData = useCallback(async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch demo users
      const { data: demoUsers, error: usersError } = await supabase
        .from('demo_users')
        .select('*')
        .eq('org_id', orgId);

      if (usersError) throw usersError;

      if (!demoUsers || demoUsers.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = demoUsers.map(u => u.id);

      // Fetch assessments for these users
      const { data: assessments, error: assessError } = await supabase
        .from('demo_assessment_attempts')
        .select('*')
        .in('user_id', userIds)
        .eq('status', 'completed');

      if (assessError) throw assessError;

      // Fetch activity logs
      const { data: activities, error: activityError } = await supabase
        .from('demo_activity_log')
        .select('*')
        .in('user_id', userIds);

      if (activityError) throw activityError;

      // Process members with their stats
      const membersWithStats: DemoMember[] = demoUsers.map(user => {
        const userAssessments = assessments?.filter(a => a.user_id === user.id) || [];
        const preTest = userAssessments.find(a => a.assessment_type === 'pre_test');
        const postTest = userAssessments.find(a => a.assessment_type === 'post_test');
        
        const userActivities = activities?.filter(a => a.user_id === user.id) || [];
        const lastActivity = userActivities
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        const challengesCompleted = userActivities.filter(a => a.activity_type === 'challenge_complete').length;

        return {
          id: user.id,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          level: user.level,
          xp: user.xp,
          pre_test_score: preTest ? Number(preTest.percentage) : null,
          post_test_score: postTest ? Number(postTest.percentage) : null,
          score_change: preTest && postTest 
            ? Number(postTest.percentage) - Number(preTest.percentage) 
            : null,
          last_active: lastActivity?.created_at || null,
          challenges_completed: challengesCompleted,
        };
      });

      setMembers(membersWithStats);

      // Calculate stats
      const completedCount = membersWithStats.filter(m => m.post_test_score !== null).length;
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const activeThisWeek = membersWithStats.filter(m => 
        m.last_active && new Date(m.last_active) >= weekAgo
      ).length;
      
      const improvements = membersWithStats
        .filter(m => m.score_change !== null)
        .map(m => m.score_change!);
      const avgImprovement = improvements.length > 0 
        ? Math.round(improvements.reduce((a, b) => a + b, 0) / improvements.length)
        : 0;

      setStats({
        totalMembers: membersWithStats.length,
        completedMembers: completedCount,
        activeThisWeek,
        averageImprovement: avgImprovement,
      });

      // Calculate engagement data (last 30 days)
      const engagementMap = new Map<string, Set<string>>();
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        engagementMap.set(dateStr, new Set());
      }

      activities?.forEach(activity => {
        if (activity.activity_type === 'login') {
          const dateStr = new Date(activity.created_at).toISOString().split('T')[0];
          if (engagementMap.has(dateStr)) {
            engagementMap.get(dateStr)!.add(activity.user_id);
          }
        }
      });

      const engagementArr: EngagementDataPoint[] = [];
      engagementMap.forEach((users, date) => {
        engagementArr.push({
          date: date.slice(5), // MM-DD format
          activeUsers: users.size,
        });
      });
      setEngagementData(engagementArr);

      // Calculate skill averages
      const skillNames = ['prompt_structure', 'context_setting', 'output_control', 'role_assignment', 'chain_prompting', 'error_detection'];
      const skillLabels: Record<string, string> = {
        prompt_structure: 'โครงสร้าง',
        context_setting: 'บริบท',
        output_control: 'ควบคุมผลลัพธ์',
        role_assignment: 'กำหนดบทบาท',
        chain_prompting: 'Chain Prompt',
        error_detection: 'จับผิด',
      };

      const preTestScores: Record<string, number[]> = {};
      const postTestScores: Record<string, number[]> = {};

      skillNames.forEach(skill => {
        preTestScores[skill] = [];
        postTestScores[skill] = [];
      });

      assessments?.forEach(attempt => {
        const scores = attempt.skill_scores as Record<string, { percentage: number }> | null;
        if (!scores) return;
        
        skillNames.forEach(skill => {
          if (scores[skill]?.percentage !== undefined) {
            if (attempt.assessment_type === 'pre_test') {
              preTestScores[skill].push(scores[skill].percentage);
            } else {
              postTestScores[skill].push(scores[skill].percentage);
            }
          }
        });
      });

      const skillAvgs: SkillAverage[] = skillNames.map(skill => ({
        skill: skill,
        skillLabel: skillLabels[skill],
        preTest: preTestScores[skill].length > 0 
          ? Math.round(preTestScores[skill].reduce((a, b) => a + b, 0) / preTestScores[skill].length)
          : 0,
        postTest: postTestScores[skill].length > 0
          ? Math.round(postTestScores[skill].reduce((a, b) => a + b, 0) / postTestScores[skill].length)
          : 0,
      }));

      setSkillAverages(skillAvgs);

    } catch (error) {
      console.error('Error fetching demo data:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchDemoData();
  }, [fetchDemoData]);

  return {
    members,
    stats,
    engagementData,
    skillAverages,
    loading,
    refetch: fetchDemoData,
  };
};
