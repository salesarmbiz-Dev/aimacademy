export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalXp: number;
  spotXp: number;
  legoXp: number;
  weeklyXp: number;
  tier: TierType;
  change: number;
  badges: string[];
  isCurrentUser?: boolean;
  joinDate: string;
}

export interface ChallengeLeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: number;
  bestScore: number;
  blocksUsed?: number;
  completedCount?: number;
  bestTime?: string;
  avgTime?: string;
  tier: TierType;
  change: number;
  isCurrentUser?: boolean;
}

export type TierType = 'legend' | 'master' | 'expert' | 'skilled' | 'beginner';
export type LeaderboardTab = 'global' | 'spot' | 'lego' | 'weekly' | 'minimize' | 'maximize' | 'fix' | 'build';

export interface TierInfo {
  name: string;
  icon: string;
  color: string;
  minXp: number;
  rankRange: string;
}

export const TIER_SYSTEM: Record<TierType, TierInfo> = {
  legend: {
    name: "Legend",
    icon: "👑",
    color: "#FFD700",
    minXp: 50000,
    rankRange: "Top 1%"
  },
  master: {
    name: "Master",
    icon: "💎",
    color: "#A855F7",
    minXp: 25000,
    rankRange: "Top 5%"
  },
  expert: {
    name: "Expert",
    icon: "🔷",
    color: "#05F2F2",
    minXp: 10000,
    rankRange: "Top 15%"
  },
  skilled: {
    name: "Skilled",
    icon: "🔶",
    color: "#F27405",
    minXp: 5000,
    rankRange: "Top 30%"
  },
  beginner: {
    name: "Beginner",
    icon: "🔹",
    color: "#6593A6",
    minXp: 0,
    rankRange: "Top 100%"
  }
};

export const getTier = (xp: number): TierType => {
  if (xp >= 50000) return 'legend';
  if (xp >= 25000) return 'master';
  if (xp >= 10000) return 'expert';
  if (xp >= 5000) return 'skilled';
  return 'beginner';
};

export const MOCK_GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: "user-001",
    name: "PromptMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptMaster",
    level: 42,
    totalXp: 58420,
    spotXp: 28000,
    legoXp: 30420,
    weeklyXp: 2450,
    tier: "legend",
    change: 0,
    badges: ["lego-legend", "perfectionist"],
    joinDate: "2024-06-15"
  },
  {
    rank: 2,
    id: "user-002",
    name: "AIBuilder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AIBuilder",
    level: 38,
    totalXp: 52180,
    spotXp: 22000,
    legoXp: 30180,
    weeklyXp: 3200,
    tier: "legend",
    change: 2,
    badges: ["speed-demon"],
    joinDate: "2024-07-20"
  },
  {
    rank: 3,
    id: "user-003",
    name: "LegoKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegoKing",
    level: 35,
    totalXp: 48950,
    spotXp: 18000,
    legoXp: 30950,
    weeklyXp: 1890,
    tier: "master",
    change: -1,
    badges: ["master-builder"],
    joinDate: "2024-08-01"
  },
  {
    rank: 4,
    id: "user-004",
    name: "CodeNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja",
    level: 32,
    totalXp: 42300,
    spotXp: 20000,
    legoXp: 22300,
    weeklyXp: 2100,
    tier: "master",
    change: 1,
    badges: [],
    joinDate: "2024-09-10"
  },
  {
    rank: 5,
    id: "user-005",
    name: "PromptWizard",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptWizard",
    level: 30,
    totalXp: 38750,
    spotXp: 15000,
    legoXp: 23750,
    weeklyXp: 1650,
    tier: "master",
    change: 0,
    badges: ["minimalist"],
    joinDate: "2024-09-25"
  },
  {
    rank: 6,
    id: "user-006",
    name: "BlockChamp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockChamp",
    level: 28,
    totalXp: 32100,
    spotXp: 12000,
    legoXp: 20100,
    weeklyXp: 2800,
    tier: "expert",
    change: 5,
    badges: [],
    joinDate: "2024-10-05"
  },
  {
    rank: 7,
    id: "user-007",
    name: "AIExplorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AIExplorer",
    level: 26,
    totalXp: 28400,
    spotXp: 14000,
    legoXp: 14400,
    weeklyXp: 1200,
    tier: "expert",
    change: -2,
    badges: [],
    joinDate: "2024-10-15"
  },
  {
    rank: 8,
    id: "user-008",
    name: "PromptPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptPro",
    level: 24,
    totalXp: 24800,
    spotXp: 10000,
    legoXp: 14800,
    weeklyXp: 980,
    tier: "expert",
    change: 0,
    badges: ["week-warrior"],
    joinDate: "2024-11-01"
  },
  {
    rank: 9,
    id: "user-009",
    name: "LegoLearner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegoLearner",
    level: 22,
    totalXp: 21500,
    spotXp: 8000,
    legoXp: 13500,
    weeklyXp: 1450,
    tier: "expert",
    change: 3,
    badges: [],
    joinDate: "2024-11-10"
  },
  {
    rank: 10,
    id: "user-010",
    name: "BuilderBot",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BuilderBot",
    level: 20,
    totalXp: 18200,
    spotXp: 7000,
    legoXp: 11200,
    weeklyXp: 750,
    tier: "expert",
    change: -1,
    badges: [],
    joinDate: "2024-11-20"
  },
  {
    rank: 11,
    id: "user-011",
    name: "PromptAce",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptAce",
    level: 18,
    totalXp: 15600,
    spotXp: 6000,
    legoXp: 9600,
    weeklyXp: 890,
    tier: "expert",
    change: 2,
    badges: [],
    joinDate: "2024-12-01"
  },
  {
    rank: 12,
    id: "user-012",
    name: "BlockBuilder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockBuilder",
    level: 16,
    totalXp: 12400,
    spotXp: 5000,
    legoXp: 7400,
    weeklyXp: 620,
    tier: "expert",
    change: -3,
    badges: [],
    joinDate: "2024-12-15"
  },
  {
    rank: 42,
    id: "current-user",
    name: "You (Demo User)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    level: 5,
    totalXp: 2565,
    spotXp: 1000,
    legoXp: 1565,
    weeklyXp: 450,
    tier: "beginner",
    change: 8,
    badges: ["first-build"],
    isCurrentUser: true,
    joinDate: "2025-01-15"
  }
];

export const MOCK_CHALLENGE_LEADERBOARD: Record<string, ChallengeLeaderboardUser[]> = {
  minimize: [
    { rank: 1, id: "user-001", name: "PromptMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptMaster", level: 42, bestScore: 98, blocksUsed: 2, bestTime: "00:45", tier: "legend", change: 0 },
    { rank: 2, id: "user-002", name: "AIBuilder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AIBuilder", level: 38, bestScore: 96, blocksUsed: 3, bestTime: "01:12", tier: "legend", change: 1 },
    { rank: 3, id: "user-003", name: "LegoKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegoKing", level: 35, bestScore: 95, blocksUsed: 3, bestTime: "00:58", tier: "master", change: -1 },
    { rank: 4, id: "user-005", name: "PromptWizard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptWizard", level: 30, bestScore: 93, blocksUsed: 3, bestTime: "01:30", tier: "master", change: 2 },
    { rank: 5, id: "user-006", name: "BlockChamp", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockChamp", level: 28, bestScore: 91, blocksUsed: 4, bestTime: "01:45", tier: "expert", change: 0 },
  ],
  maximize: [
    { rank: 1, id: "user-006", name: "BlockChamp", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockChamp", level: 28, bestScore: 99, blocksUsed: 8, bestTime: "02:30", tier: "expert", change: 0 },
    { rank: 2, id: "user-005", name: "PromptWizard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptWizard", level: 30, bestScore: 98, blocksUsed: 7, bestTime: "01:55", tier: "master", change: 1 },
    { rank: 3, id: "user-001", name: "PromptMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptMaster", level: 42, bestScore: 97, blocksUsed: 6, bestTime: "02:10", tier: "legend", change: -1 },
  ],
  fix: [
    { rank: 1, id: "user-004", name: "CodeNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja", level: 32, bestScore: 100, completedCount: 10, avgTime: "01:20", tier: "master", change: 0 },
    { rank: 2, id: "user-003", name: "LegoKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegoKing", level: 35, bestScore: 98, completedCount: 10, avgTime: "01:35", tier: "master", change: 1 },
    { rank: 3, id: "user-002", name: "AIBuilder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AIBuilder", level: 38, bestScore: 96, completedCount: 8, avgTime: "01:45", tier: "legend", change: -1 },
  ],
  build: [
    { rank: 1, id: "user-003", name: "LegoKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegoKing", level: 35, bestScore: 97, completedCount: 10, avgTime: "03:15", tier: "master", change: 0 },
    { rank: 2, id: "user-001", name: "PromptMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PromptMaster", level: 42, bestScore: 95, completedCount: 10, avgTime: "02:50", tier: "legend", change: 2 },
    { rank: 3, id: "user-004", name: "CodeNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja", level: 32, bestScore: 94, completedCount: 8, avgTime: "03:30", tier: "master", change: -1 },
  ]
};
