// Spot the Difference - Leaderboard Mock Data

export interface SpotLeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  accuracy: number;
  totalXp: number;
  bestStreak: number;
  challengesCompleted: number;
  rank: number;
  rankChange: number; // positive = up, negative = down, 0 = same
}

// Generate mock leaderboard data
export const MOCK_SPOT_LEADERBOARD: SpotLeaderboardUser[] = [
  { id: '1', name: 'SpotMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpotMaster', accuracy: 98.5, totalXp: 5200, bestStreak: 25, challengesCompleted: 150, rank: 1, rankChange: 0 },
  { id: '2', name: 'AILearner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AILearner', accuracy: 95.2, totalXp: 4850, bestStreak: 22, challengesCompleted: 142, rank: 2, rankChange: 2 },
  { id: '3', name: 'PromptPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PromptPro', accuracy: 94.8, totalXp: 4600, bestStreak: 20, challengesCompleted: 135, rank: 3, rankChange: -1 },
  { id: '4', name: 'QuickEye', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuickEye', accuracy: 93.5, totalXp: 4200, bestStreak: 18, challengesCompleted: 128, rank: 4, rankChange: 1 },
  { id: '5', name: 'PatternHunter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PatternHunter', accuracy: 92.8, totalXp: 3950, bestStreak: 17, challengesCompleted: 120, rank: 5, rankChange: -1 },
  { id: '6', name: 'นักเรียน AI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student', accuracy: 91.2, totalXp: 3700, bestStreak: 15, challengesCompleted: 115, rank: 6, rankChange: 3 },
  { id: '7', name: 'EagleVision', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EagleVision', accuracy: 90.5, totalXp: 3500, bestStreak: 14, challengesCompleted: 110, rank: 7, rankChange: 0 },
  { id: '8', name: 'StreakKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StreakKing', accuracy: 89.9, totalXp: 3300, bestStreak: 21, challengesCompleted: 105, rank: 8, rankChange: -2 },
  { id: '9', name: 'PromptNinja', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PromptNinja', accuracy: 88.7, totalXp: 3100, bestStreak: 13, challengesCompleted: 100, rank: 9, rankChange: 1 },
  { id: '10', name: 'คนมองไกล', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farsight', accuracy: 87.5, totalXp: 2900, bestStreak: 12, challengesCompleted: 95, rank: 10, rankChange: 0 },
  { id: '11', name: 'SharpMind', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SharpMind', accuracy: 86.3, totalXp: 2700, bestStreak: 11, challengesCompleted: 90, rank: 11, rankChange: 2 },
  { id: '12', name: 'AIWhisperer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIWhisperer', accuracy: 85.1, totalXp: 2500, bestStreak: 10, challengesCompleted: 85, rank: 12, rankChange: -1 },
  { id: '13', name: 'นักสังเกต', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=observer', accuracy: 84.2, totalXp: 2300, bestStreak: 9, challengesCompleted: 80, rank: 13, rankChange: 0 },
  { id: '14', name: 'FocusedOne', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FocusedOne', accuracy: 83.0, totalXp: 2100, bestStreak: 8, challengesCompleted: 75, rank: 14, rankChange: 1 },
  { id: '15', name: 'DetailSpotter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DetailSpotter', accuracy: 82.5, totalXp: 1950, bestStreak: 8, challengesCompleted: 72, rank: 15, rankChange: -1 },
  { id: '16', name: 'TextAnalyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TextAnalyst', accuracy: 81.8, totalXp: 1800, bestStreak: 7, challengesCompleted: 68, rank: 16, rankChange: 0 },
  { id: '17', name: 'PromptReader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PromptReader', accuracy: 80.5, totalXp: 1650, bestStreak: 7, challengesCompleted: 65, rank: 17, rankChange: 3 },
  { id: '18', name: 'คนเก่งAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aiexpert', accuracy: 79.2, totalXp: 1500, bestStreak: 6, challengesCompleted: 60, rank: 18, rankChange: -1 },
  { id: '19', name: 'LearnerPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LearnerPro', accuracy: 78.0, totalXp: 1350, bestStreak: 6, challengesCompleted: 55, rank: 19, rankChange: 0 },
  { id: '20', name: 'NewbieStar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewbieStar', accuracy: 76.5, totalXp: 1200, bestStreak: 5, challengesCompleted: 50, rank: 20, rankChange: 2 },
];

export type SpotLeaderboardSortBy = 'accuracy' | 'xp' | 'streak';
export type SpotLeaderboardPeriod = 'weekly' | 'monthly' | 'allTime';

// Sort leaderboard by different criteria
export const sortSpotLeaderboard = (
  users: SpotLeaderboardUser[],
  sortBy: SpotLeaderboardSortBy
): SpotLeaderboardUser[] => {
  const sorted = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'xp':
        return b.totalXp - a.totalXp;
      case 'streak':
        return b.bestStreak - a.bestStreak;
      default:
        return 0;
    }
  });

  // Update ranks after sorting
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

// Get user's percentile
export const getUserPercentile = (userRank: number, totalUsers: number): number => {
  return Math.round(((totalUsers - userRank + 1) / totalUsers) * 100);
};

// Get improvement tip based on stats
export const getImprovementTip = (
  accuracy: number,
  streak: number,
  rank: number
): string => {
  if (accuracy < 70) {
    return 'เพิ่ม Accuracy ด้วยการอ่าน explanation ทุกข้อ!';
  }
  if (streak < 5) {
    return 'ลองเล่นต่อเนื่องเพื่อสร้าง Streak!';
  }
  if (rank > 30) {
    return `เพิ่ม Accuracy อีก ${Math.ceil((100 - accuracy) * 0.3)}% เพื่อขึ้น Top 30%!`;
  }
  if (rank > 10) {
    return `อีกนิดเดียว! ${11 - rank} อันดับสู่ Top 10!`;
  }
  return 'เยี่ยมมาก! รักษาตำแหน่งไว้นะ!';
};
