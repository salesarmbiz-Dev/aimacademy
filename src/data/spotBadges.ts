// Spot the Difference - Badges System

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeGame = 'spot' | 'lego' | 'global';

export interface SpotBadge {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
  rarity: BadgeRarity;
  game: BadgeGame;
  // For progress tracking
  targetValue?: number;
  checkType: 'correctAnswers' | 'streak' | 'patterns' | 'accuracy' | 'categories' | 'skills' | 'playDays' | 'fastAnswers' | 'categoryComplete';
}

export const SPOT_BADGES: SpotBadge[] = [
  // ============ COMMON (Easy to get) ============
  {
    id: 'spot_first',
    name: 'จุดเริ่มต้น',
    nameEn: 'First Spot',
    description: 'ตอบถูกข้อแรก',
    icon: '🎯',
    requirement: 'Complete first challenge correctly',
    xpReward: 50,
    rarity: 'common',
    game: 'spot',
    targetValue: 1,
    checkType: 'correctAnswers',
  },
  {
    id: 'spot_sharp_eye',
    name: 'ตาไว',
    nameEn: 'Sharp Eye',
    description: 'ตอบถูก 10 ข้อ',
    icon: '👁️',
    requirement: '10 correct answers',
    xpReward: 100,
    rarity: 'common',
    game: 'spot',
    targetValue: 10,
    checkType: 'correctAnswers',
  },
  {
    id: 'spot_explorer',
    name: 'นักสำรวจ',
    nameEn: 'Category Explorer',
    description: 'เล่นครบ 3 หมวดหมู่',
    icon: '🗺️',
    requirement: 'Play 3 different categories',
    xpReward: 100,
    rarity: 'common',
    game: 'spot',
    targetValue: 3,
    checkType: 'categories',
  },

  // ============ RARE (Medium difficulty) ============
  {
    id: 'spot_eagle_eye',
    name: 'สายตาเหยี่ยว',
    nameEn: 'Eagle Eye',
    description: 'ตอบถูก 50 ข้อ',
    icon: '🦅',
    requirement: '50 correct answers',
    xpReward: 200,
    rarity: 'rare',
    game: 'spot',
    targetValue: 50,
    checkType: 'correctAnswers',
  },
  {
    id: 'spot_streak_starter',
    name: 'เริ่มต้นดี',
    nameEn: 'Streak Starter',
    description: 'ถูกติดต่อกัน 5 ข้อ',
    icon: '🔥',
    requirement: '5 streak',
    xpReward: 150,
    rarity: 'rare',
    game: 'spot',
    targetValue: 5,
    checkType: 'streak',
  },
  {
    id: 'spot_pattern_collector',
    name: 'นักสะสม Pattern',
    nameEn: 'Pattern Collector',
    description: 'ค้นพบ 10 Patterns',
    icon: '💡',
    requirement: 'Discover 10 patterns',
    xpReward: 200,
    rarity: 'rare',
    game: 'spot',
    targetValue: 10,
    checkType: 'patterns',
  },
  {
    id: 'spot_accuracy_pro',
    name: 'แม่นยำ',
    nameEn: 'Accuracy Pro',
    description: 'Accuracy 80%+ (อย่างน้อย 20 ข้อ)',
    icon: '🎯',
    requirement: '80% accuracy with minimum 20 challenges',
    xpReward: 250,
    rarity: 'rare',
    game: 'spot',
    targetValue: 80,
    checkType: 'accuracy',
  },
  {
    id: 'spot_speed_demon',
    name: 'สายฟ้า',
    nameEn: 'Speed Demon',
    description: 'ตอบถูกภายใน 5 วินาที 10 ครั้ง',
    icon: '⚡',
    requirement: '10 correct answers under 5 seconds each',
    xpReward: 200,
    rarity: 'rare',
    game: 'spot',
    targetValue: 10,
    checkType: 'fastAnswers',
  },

  // ============ EPIC (Hard) ============
  {
    id: 'spot_streak_master',
    name: 'ราชาแห่ง Streak',
    nameEn: 'Streak Master',
    description: 'ถูกติดต่อกัน 15 ข้อ',
    icon: '👑🔥',
    requirement: '15 streak',
    xpReward: 400,
    rarity: 'epic',
    game: 'spot',
    targetValue: 15,
    checkType: 'streak',
  },
  {
    id: 'spot_pattern_master',
    name: 'ปรมาจารย์ Pattern',
    nameEn: 'Pattern Master',
    description: 'ค้นพบ 20 Patterns',
    icon: '🧠',
    requirement: 'Discover 20 patterns',
    xpReward: 400,
    rarity: 'epic',
    game: 'spot',
    targetValue: 20,
    checkType: 'patterns',
  },
  {
    id: 'spot_category_champion',
    name: 'แชมป์หมวดหมู่',
    nameEn: 'Category Champion',
    description: 'ทำครบ 1 หมวดหมู่ด้วย Accuracy 90%+',
    icon: '🏆',
    requirement: 'Complete any category with 90%+ accuracy',
    xpReward: 500,
    rarity: 'epic',
    game: 'spot',
    targetValue: 90,
    checkType: 'categoryComplete',
  },
  {
    id: 'spot_skill_balanced',
    name: 'สมดุล',
    nameEn: 'Skill Balanced',
    description: 'ทุก Skill ถึง 50%',
    icon: '⚖️',
    requirement: 'All 5 skills at 50% or higher',
    xpReward: 400,
    rarity: 'epic',
    game: 'spot',
    targetValue: 50,
    checkType: 'skills',
  },

  // ============ LEGENDARY (Very Hard) ============
  {
    id: 'spot_perfect_week',
    name: 'สัปดาห์สมบูรณ์แบบ',
    nameEn: 'Perfect Week',
    description: 'เล่นทุกวัน 7 วันติด ไม่พลาดแม้แต่วัน',
    icon: '📅✨',
    requirement: '7-day play streak',
    xpReward: 750,
    rarity: 'legendary',
    game: 'spot',
    targetValue: 7,
    checkType: 'playDays',
  },
  {
    id: 'spot_legend',
    name: 'ตำนาน Spot',
    nameEn: 'Spot Legend',
    description: 'ถูก 100 ข้อ + ค้นพบทุก Pattern',
    icon: '🌟',
    requirement: '100 correct + all patterns discovered',
    xpReward: 1000,
    rarity: 'legendary',
    game: 'spot',
    targetValue: 100,
    checkType: 'correctAnswers',
  },
  {
    id: 'spot_untouchable',
    name: 'แตะไม่ได้',
    nameEn: 'Untouchable',
    description: 'ถูกติดต่อกัน 25 ข้อ',
    icon: '💎',
    requirement: '25 streak',
    xpReward: 1000,
    rarity: 'legendary',
    game: 'spot',
    targetValue: 25,
    checkType: 'streak',
  },
];

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#6593A6',
  rare: '#05F2F2',
  epic: '#A855F7',
  legendary: '#FFD700',
};

export const RARITY_NAMES: Record<BadgeRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

// Get badge by ID
export const getBadgeById = (id: string): SpotBadge | undefined => {
  return SPOT_BADGES.find(badge => badge.id === id);
};

// Get badges by rarity
export const getBadgesByRarity = (rarity: BadgeRarity): SpotBadge[] => {
  return SPOT_BADGES.filter(badge => badge.rarity === rarity);
};

// Calculate badge progress
export const calculateBadgeProgress = (
  badge: SpotBadge,
  stats: {
    correctAnswers: number;
    longestStreak: number;
    patternsCount: number;
    accuracy: number;
    categoriesPlayed: number;
    allSkillsAbove50: boolean;
    playDays: number;
    fastAnswers: number;
  }
): number => {
  if (!badge.targetValue) return 0;

  switch (badge.checkType) {
    case 'correctAnswers':
      return Math.min(100, (stats.correctAnswers / badge.targetValue) * 100);
    case 'streak':
      return Math.min(100, (stats.longestStreak / badge.targetValue) * 100);
    case 'patterns':
      return Math.min(100, (stats.patternsCount / badge.targetValue) * 100);
    case 'accuracy':
      return Math.min(100, (stats.accuracy / badge.targetValue) * 100);
    case 'categories':
      return Math.min(100, (stats.categoriesPlayed / badge.targetValue) * 100);
    case 'skills':
      return stats.allSkillsAbove50 ? 100 : 0;
    case 'playDays':
      return Math.min(100, (stats.playDays / badge.targetValue) * 100);
    case 'fastAnswers':
      return Math.min(100, (stats.fastAnswers / badge.targetValue) * 100);
    case 'categoryComplete':
      return 0; // This needs special handling
    default:
      return 0;
  }
};
