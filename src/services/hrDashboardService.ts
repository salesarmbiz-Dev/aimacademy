import { supabase } from '@/integrations/supabase/client';
import { 
  calculateNPS, 
  calculateAverageRatings, 
  getContinueInterest,
  getAllFeedback 
} from '@/utils/surveyAnalytics';

// Type definitions
export interface OrganizationOverview {
  totalUsers: number;
  activeUsers: number;
  avgCompletionRate: number;
  totalTimeLearning: number;
  totalAssetsCreated: number;
  avgNPS: number;
}

export interface UserSkillData {
  userId: string;
  userName: string;
  preScore: number | null;
  postScore: number | null;
  improvement: number | null;
  competencies: Record<string, { pre: number; post: number }>;
}

export interface SkillAssessmentData {
  users: UserSkillData[];
  avgPreScore: number;
  avgPostScore: number;
  avgImprovement: number;
  topImprover: { name: string; delta: number } | null;
}

export interface UserEngagement {
  userId: string;
  userName: string;
  totalSessions: number;
  totalTimeMinutes: number;
  lastActive: string | null;
  status: 'active' | 'at_risk' | 'dormant';
}

export interface UsageAnalytics {
  dailyActiveUsers: { date: string; count: number }[];
  avgSessionDuration: number;
  avgSessionsPerWeek: number;
  peakUsageHours: { hour: number; count: number }[];
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  userEngagement: UserEngagement[];
}

export interface GamePerformanceData {
  gameId: string;
  gameName: string;
  totalPlays: number;
  uniquePlayers: number;
  avgScore: number;
  avgTimeMinutes: number;
  completionRate: number;
  totalXpAwarded: number;
}

export interface GamePerformance {
  games: GamePerformanceData[];
  topScorers: { userId: string; userName: string; gameId: string; score: number }[];
  bugTypeAccuracy: { bugType: string; accuracy: number }[];
}

export interface SurveyResults {
  npsScore: number;
  npsBreakdown: { promoters: number; passives: number; detractors: number };
  avgRatings: { fun: number; difficulty: number; usefulness: number };
  continueInterest: { yes: number; maybe: number; no: number };
  recentFeedback: { text: string; nps: number; date: string }[];
  totalResponses: number;
  responseRate: number;
}

export interface AssetLibraryStats {
  totalAssets: number;
  assetsByCategory: { prompts: number; sops: number; patterns: number; workflows: number; templates: number };
  avgQualityScore: number;
  assetCreationTrend: { date: string; count: number }[];
  estimatedValue: number;
  topQualityAssets: { title: string; category: string; score: number; creator: string }[];
}

const GAME_NAMES: Record<string, string> = {
  'spot': 'Spot the Difference',
  'lego': 'Prompt Lego',
  'debugger': 'Prompt Debugger',
  'sop-machine': 'SOP Machine',
};

const SET1_GAMES = ['spot', 'lego', 'debugger'];

export async function getOrganizationOverview(): Promise<OrganizationOverview> {
  try {
    // Get total and active users from sessions
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('user_id, session_start, duration_seconds');

    const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []);
    const totalUsers = uniqueUsers.size;

    // Active in last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = new Set(
      sessions?.filter(s => s.session_start && new Date(s.session_start) >= weekAgo)
        .map(s => s.user_id) || []
    ).size;

    // Total time learning (hours)
    const totalSeconds = sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0;
    const totalTimeLearning = Math.round(totalSeconds / 3600 * 10) / 10;

    // Completion rate: users who completed all SET 1 games with 70%+
    const { data: gameProgress } = await supabase
      .from('user_game_progress')
      .select('user_id, game_id, best_score, status')
      .in('game_id', SET1_GAMES);

    const userCompletions = new Map<string, number>();
    gameProgress?.forEach(p => {
      if (p.status === 'completed' && (p.best_score || 0) >= 70) {
        userCompletions.set(p.user_id, (userCompletions.get(p.user_id) || 0) + 1);
      }
    });
    
    const completedUsers = Array.from(userCompletions.values()).filter(count => count >= SET1_GAMES.length).length;
    const avgCompletionRate = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;

    // Total assets
    const { count: totalAssetsCreated } = await supabase
      .from('user_assets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // NPS from surveys
    const { data: surveyData } = await supabase
      .from('survey_responses')
      .select('nps_score');

    const avgNPS = surveyData && surveyData.length > 0 
      ? calculateNPS(surveyData.map(s => ({ 
          nps_score: s.nps_score, 
          user_id: '', 
          trigger_context: 'manual' as const,
          rating_fun: 0,
          rating_difficulty: 0,
          rating_usefulness: 0,
          continue_interest: 'yes' as const
        })))
      : 0;

    return {
      totalUsers,
      activeUsers,
      avgCompletionRate,
      totalTimeLearning,
      totalAssetsCreated: totalAssetsCreated || 0,
      avgNPS,
    };
  } catch (error) {
    console.error('Error fetching organization overview:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      avgCompletionRate: 0,
      totalTimeLearning: 0,
      totalAssetsCreated: 0,
      avgNPS: 0,
    };
  }
}

export async function getSkillAssessmentData(): Promise<SkillAssessmentData> {
  try {
    // Get assessment completion events
    const { data: assessmentEvents } = await supabase
      .from('activity_events')
      .select('user_id, event_data, created_at')
      .eq('event_type', 'assessment_complete');

    // Group by user
    const userAssessments = new Map<string, { pre: any; post: any }>();
    
    assessmentEvents?.forEach(event => {
      const data = event.event_data as Record<string, any>;
      const userId = event.user_id;
      
      if (!userAssessments.has(userId)) {
        userAssessments.set(userId, { pre: null, post: null });
      }
      
      const entry = userAssessments.get(userId)!;
      if (data?.type === 'pre') {
        entry.pre = data;
      } else if (data?.type === 'post') {
        entry.post = data;
      }
    });

    // Also check assessment_attempts table
    const { data: attempts } = await supabase
      .from('assessment_attempts')
      .select('user_id, assessment_type, percentage, skill_scores, status')
      .eq('status', 'completed');

    attempts?.forEach(attempt => {
      const userId = attempt.user_id;
      if (!userAssessments.has(userId)) {
        userAssessments.set(userId, { pre: null, post: null });
      }
      
      const entry = userAssessments.get(userId)!;
      const data = {
        total_score: attempt.percentage,
        competencies: attempt.skill_scores,
      };
      
      if (attempt.assessment_type === 'pre' || attempt.assessment_type === 'pre_test') {
        entry.pre = data;
      } else if (attempt.assessment_type === 'post' || attempt.assessment_type === 'post_test') {
        entry.post = data;
      }
    });

    // Build user list
    const users: UserSkillData[] = [];
    let totalPre = 0, preCounts = 0;
    let totalPost = 0, postCounts = 0;
    let topImprover: { name: string; delta: number } | null = null;

    userAssessments.forEach((data, userId) => {
      const preScore = data.pre?.total_score ?? null;
      const postScore = data.post?.total_score ?? null;
      const improvement = preScore !== null && postScore !== null ? postScore - preScore : null;

      // Get competencies
      const competencies: Record<string, { pre: number; post: number }> = {};
      const preComps = data.pre?.competencies || {};
      const postComps = data.post?.competencies || {};
      
      ['prompt_construction', 'context_setting', 'output_formatting', 'error_detection', 'iteration_skill', 'ethical_awareness'].forEach(skill => {
        competencies[skill] = {
          pre: preComps[skill]?.percentage || preComps[skill] || 0,
          post: postComps[skill]?.percentage || postComps[skill] || 0,
        };
      });

      users.push({
        userId,
        userName: `User ${userId.slice(0, 4)}`, // Would need to join with profiles for real names
        preScore,
        postScore,
        improvement,
        competencies,
      });

      if (preScore !== null) { totalPre += preScore; preCounts++; }
      if (postScore !== null) { totalPost += postScore; postCounts++; }
      
      if (improvement !== null && (!topImprover || improvement > topImprover.delta)) {
        topImprover = { name: `User ${userId.slice(0, 4)}`, delta: improvement };
      }
    });

    const avgPreScore = preCounts > 0 ? Math.round(totalPre / preCounts) : 0;
    const avgPostScore = postCounts > 0 ? Math.round(totalPost / postCounts) : 0;
    const avgImprovement = avgPostScore - avgPreScore;

    return {
      users: users.sort((a, b) => (b.improvement || 0) - (a.improvement || 0)),
      avgPreScore,
      avgPostScore,
      avgImprovement,
      topImprover,
    };
  } catch (error) {
    console.error('Error fetching skill assessment data:', error);
    return { users: [], avgPreScore: 0, avgPostScore: 0, avgImprovement: 0, topImprover: null };
  }
}

export async function getUsageAnalytics(): Promise<UsageAnalytics> {
  try {
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .order('session_start', { ascending: false });

    // Daily active users (last 30 days)
    const dailyMap = new Map<string, Set<string>>();
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dailyMap.set(date.toISOString().split('T')[0], new Set());
    }

    sessions?.forEach(session => {
      if (session.session_start) {
        const dateStr = new Date(session.session_start).toISOString().split('T')[0];
        if (dailyMap.has(dateStr)) {
          dailyMap.get(dateStr)!.add(session.user_id);
        }
      }
    });

    const dailyActiveUsers: { date: string; count: number }[] = [];
    dailyMap.forEach((users, date) => {
      dailyActiveUsers.push({ date: date.slice(5), count: users.size });
    });

    // Avg session duration
    const durations = sessions?.filter(s => s.duration_seconds).map(s => s.duration_seconds!) || [];
    const avgSessionDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 60) 
      : 0;

    // Sessions per week
    const weekMap = new Map<string, number>();
    sessions?.forEach(session => {
      if (session.session_start) {
        const date = new Date(session.session_start);
        const weekNum = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
        weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + 1);
      }
    });
    const avgSessionsPerWeek = weekMap.size > 0 
      ? Math.round(Array.from(weekMap.values()).reduce((a, b) => a + b, 0) / weekMap.size)
      : 0;

    // Peak usage hours
    const hourCounts = new Array(24).fill(0);
    sessions?.forEach(session => {
      if (session.session_start) {
        const hour = new Date(session.session_start).getHours();
        hourCounts[hour]++;
      }
    });
    const peakUsageHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device breakdown
    const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 };
    sessions?.forEach(session => {
      if (session.device_type === 'mobile') deviceCounts.mobile++;
      else if (session.device_type === 'tablet') deviceCounts.tablet++;
      else deviceCounts.desktop++;
    });

    // User engagement
    const userSessionMap = new Map<string, { sessions: number; time: number; lastActive: string | null }>();
    sessions?.forEach(session => {
      const entry = userSessionMap.get(session.user_id) || { sessions: 0, time: 0, lastActive: null };
      entry.sessions++;
      entry.time += session.duration_seconds || 0;
      if (!entry.lastActive || (session.session_start && session.session_start > entry.lastActive)) {
        entry.lastActive = session.session_start;
      }
      userSessionMap.set(session.user_id, entry);
    });

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const userEngagement: UserEngagement[] = Array.from(userSessionMap.entries()).map(([userId, data]) => {
      let status: 'active' | 'at_risk' | 'dormant' = 'dormant';
      if (data.lastActive) {
        const lastDate = new Date(data.lastActive);
        if (lastDate >= threeDaysAgo) status = 'active';
        else if (lastDate >= sevenDaysAgo) status = 'at_risk';
      }

      return {
        userId,
        userName: `User ${userId.slice(0, 4)}`,
        totalSessions: data.sessions,
        totalTimeMinutes: Math.round(data.time / 60),
        lastActive: data.lastActive,
        status,
      };
    }).sort((a, b) => {
      if (!a.lastActive) return 1;
      if (!b.lastActive) return -1;
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    });

    return {
      dailyActiveUsers,
      avgSessionDuration,
      avgSessionsPerWeek,
      peakUsageHours,
      deviceBreakdown: deviceCounts,
      userEngagement,
    };
  } catch (error) {
    console.error('Error fetching usage analytics:', error);
    return {
      dailyActiveUsers: [],
      avgSessionDuration: 0,
      avgSessionsPerWeek: 0,
      peakUsageHours: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      userEngagement: [],
    };
  }
}

export async function getGamePerformance(): Promise<GamePerformance> {
  try {
    const { data: progress } = await supabase
      .from('user_game_progress')
      .select('*');

    // Group by game
    const gameMap = new Map<string, {
      plays: number;
      players: Set<string>;
      scores: number[];
      times: number[];
      completions: number;
      xp: number;
    }>();

    progress?.forEach(p => {
      if (!gameMap.has(p.game_id)) {
        gameMap.set(p.game_id, {
          plays: 0,
          players: new Set(),
          scores: [],
          times: [],
          completions: 0,
          xp: 0,
        });
      }
      const entry = gameMap.get(p.game_id)!;
      entry.plays += p.attempts || 1;
      entry.players.add(p.user_id);
      if (p.best_score) entry.scores.push(p.best_score);
      if (p.total_time_seconds) entry.times.push(p.total_time_seconds);
      if ((p.best_score || 0) >= 70) entry.completions++;
      entry.xp += p.xp_earned || 0;
    });

    const games: GamePerformanceData[] = Array.from(gameMap.entries()).map(([gameId, data]) => ({
      gameId,
      gameName: GAME_NAMES[gameId] || gameId,
      totalPlays: data.plays,
      uniquePlayers: data.players.size,
      avgScore: data.scores.length > 0 ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0,
      avgTimeMinutes: data.times.length > 0 ? Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length / 60) : 0,
      completionRate: data.players.size > 0 ? Math.round((data.completions / data.players.size) * 100) : 0,
      totalXpAwarded: data.xp,
    }));

    // Top scorers
    const topScorers = (progress || [])
      .filter(p => p.best_score && p.best_score > 0)
      .sort((a, b) => (b.best_score || 0) - (a.best_score || 0))
      .slice(0, 10)
      .map(p => ({
        userId: p.user_id,
        userName: `User ${p.user_id.slice(0, 4)}`,
        gameId: p.game_id,
        score: p.best_score || 0,
      }));

    // Bug type accuracy from debugger results
    const { data: debuggerResults } = await supabase
      .from('game_debugger_results')
      .select('bugs_found, bugs_total, types_correct');

    // Placeholder for bug type accuracy - would need more detailed tracking
    const bugTypeAccuracy: { bugType: string; accuracy: number }[] = [
      { bugType: 'Missing Context', accuracy: 85 },
      { bugType: 'Vague Instructions', accuracy: 72 },
      { bugType: 'Wrong Format', accuracy: 68 },
      { bugType: 'No Constraints', accuracy: 55 },
    ];

    return { games, topScorers, bugTypeAccuracy };
  } catch (error) {
    console.error('Error fetching game performance:', error);
    return { games: [], topScorers: [], bugTypeAccuracy: [] };
  }
}

export async function getSurveyResults(): Promise<SurveyResults> {
  try {
    const { data: surveys } = await supabase
      .from('survey_responses')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!surveys || surveys.length === 0) {
      return {
        npsScore: 0,
        npsBreakdown: { promoters: 0, passives: 0, detractors: 0 },
        avgRatings: { fun: 0, difficulty: 0, usefulness: 0 },
        continueInterest: { yes: 0, maybe: 0, no: 0 },
        recentFeedback: [],
        totalResponses: 0,
        responseRate: 0,
      };
    }

    // Map to SurveyResponse type
    const mappedSurveys = surveys.map(s => ({
      user_id: s.user_id,
      trigger_context: s.trigger_context as 'set1_complete' | 'set2_complete' | 'manual',
      nps_score: s.nps_score,
      rating_fun: s.rating_fun || 0,
      rating_difficulty: s.rating_difficulty || 0,
      rating_usefulness: s.rating_usefulness || 0,
      continue_interest: (s.continue_interest || 'maybe') as 'yes' | 'maybe' | 'no',
      open_feedback: s.open_feedback,
    }));

    const npsScore = calculateNPS(mappedSurveys);
    
    // NPS breakdown
    let promoters = 0, passives = 0, detractors = 0;
    surveys.forEach(s => {
      if (s.nps_score >= 9) promoters++;
      else if (s.nps_score >= 7) passives++;
      else detractors++;
    });

    const avgRatings = calculateAverageRatings(mappedSurveys);
    const interest = getContinueInterest(mappedSurveys);

    const recentFeedback = surveys
      .filter(s => s.open_feedback)
      .slice(0, 10)
      .map(s => ({
        text: s.open_feedback!,
        nps: s.nps_score,
        date: s.submitted_at || '',
      }));

    // Get total SET 1 completers for response rate
    const { data: completers } = await supabase
      .from('user_game_progress')
      .select('user_id')
      .in('game_id', SET1_GAMES)
      .eq('status', 'completed');

    const uniqueCompleters = new Set(completers?.map(c => c.user_id) || []).size;
    const responseRate = uniqueCompleters > 0 ? Math.round((surveys.length / uniqueCompleters) * 100) : 0;

    return {
      npsScore,
      npsBreakdown: { promoters, passives, detractors },
      avgRatings,
      continueInterest: { yes: interest.yes, maybe: interest.maybe, no: interest.no },
      recentFeedback,
      totalResponses: surveys.length,
      responseRate,
    };
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return {
      npsScore: 0,
      npsBreakdown: { promoters: 0, passives: 0, detractors: 0 },
      avgRatings: { fun: 0, difficulty: 0, usefulness: 0 },
      continueInterest: { yes: 0, maybe: 0, no: 0 },
      recentFeedback: [],
      totalResponses: 0,
      responseRate: 0,
    };
  }
}

export async function getAssetLibraryStats(): Promise<AssetLibraryStats> {
  try {
    const { data: assets } = await supabase
      .from('user_assets')
      .select('*')
      .eq('status', 'active');

    if (!assets || assets.length === 0) {
      return {
        totalAssets: 0,
        assetsByCategory: { prompts: 0, sops: 0, patterns: 0, workflows: 0, templates: 0 },
        avgQualityScore: 0,
        assetCreationTrend: [],
        estimatedValue: 0,
        topQualityAssets: [],
      };
    }

    // Count by category
    const categories = { prompts: 0, sops: 0, patterns: 0, workflows: 0, templates: 0 };
    assets.forEach(a => {
      if (a.category === 'prompt') categories.prompts++;
      else if (a.category === 'sop') categories.sops++;
      else if (a.category === 'pattern') categories.patterns++;
      else if (a.category === 'workflow') categories.workflows++;
      else if (a.category === 'template') categories.templates++;
    });

    // Avg quality
    const scores = assets.filter(a => a.quality_score).map(a => a.quality_score!);
    const avgQualityScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    // Creation trend (last 30 days)
    const trendMap = new Map<string, number>();
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trendMap.set(date.toISOString().split('T')[0], 0);
    }

    assets.forEach(a => {
      const dateStr = new Date(a.created_at).toISOString().split('T')[0];
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, trendMap.get(dateStr)! + 1);
      }
    });

    const assetCreationTrend: { date: string; count: number }[] = [];
    trendMap.forEach((count, date) => {
      assetCreationTrend.push({ date: date.slice(5), count });
    });

    // Estimated value (SOPs = 150K, Prompts = 5K, Patterns = 10K)
    const estimatedValue = categories.sops * 150000 + 
                           categories.prompts * 5000 + 
                           categories.patterns * 10000 +
                           categories.workflows * 50000 +
                           categories.templates * 25000;

    // Top quality
    const topQualityAssets = assets
      .filter(a => a.quality_score)
      .sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0))
      .slice(0, 5)
      .map(a => ({
        title: a.title,
        category: a.category,
        score: a.quality_score || 0,
        creator: `User ${a.user_id.slice(0, 4)}`,
      }));

    return {
      totalAssets: assets.length,
      assetsByCategory: categories,
      avgQualityScore,
      assetCreationTrend,
      estimatedValue,
      topQualityAssets,
    };
  } catch (error) {
    console.error('Error fetching asset library stats:', error);
    return {
      totalAssets: 0,
      assetsByCategory: { prompts: 0, sops: 0, patterns: 0, workflows: 0, templates: 0 },
      avgQualityScore: 0,
      assetCreationTrend: [],
      estimatedValue: 0,
      topQualityAssets: [],
    };
  }
}
