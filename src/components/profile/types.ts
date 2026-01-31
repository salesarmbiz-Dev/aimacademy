export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'beginner' | 'progress' | 'learning' | 'challenge' | 'streak' | 'mastery' | 'legendary' | 'special';
  requirement: string;
  xpReward: number;
  earnedAt: string | null;
  progress: { current: number; target: number } | null;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ExperimentHistoryItem {
  id: string;
  type: 'experiment' | 'challenge';
  challengeMode?: 'minimize' | 'maximize' | 'fix' | 'build';
  promptName: string;
  date: string;
  originalScore: number;
  modifiedScore: number;
  changes: Array<{
    blockType: string;
    action: 'added' | 'removed' | 'modified';
  }>;
  insight?: string;
  xpEarned: number;
  blocksUsed?: number;
  targetBlocks?: number;
  passed?: boolean;
  stars?: number;
}

export interface InsightItem {
  id: string;
  blockType: string;
  text: string;
  description: string;
  discoveredAt: string;
  xpEarned: number;
  experimentId: string;
}

export interface UserPreferences {
  showHints: boolean;
  playSounds: boolean;
  showAnimations: boolean;
  darkMode: boolean;
  notifyDailyChallenge: boolean;
  notifyStreakWarning: boolean;
  notifyWeeklySummary: boolean;
  receiveUpdates: boolean;
}

export const MOCK_BADGES: Badge[] = [
  // BEGINNER BADGES
  {
    id: "first-build",
    name: "First Build",
    description: "สร้าง Prompt แรก",
    icon: "🔨",
    color: "#CD7F32",
    category: "beginner",
    requirement: "Complete first experiment",
    xpReward: 50,
    earnedAt: "2025-01-15",
    progress: null
  },
  {
    id: "experimenter",
    name: "Experimenter",
    description: "ทดลอง 20 ครั้ง",
    icon: "🧪",
    color: "#05F2F2",
    category: "progress",
    requirement: "Complete 20 experiments",
    xpReward: 100,
    earnedAt: "2025-01-20",
    progress: { current: 20, target: 20 }
  },
  {
    id: "curious-mind",
    name: "Curious Mind",
    description: "ค้นพบ 10 Insights",
    icon: "💡",
    color: "#F27405",
    category: "learning",
    requirement: "Discover 10 insights",
    xpReward: 100,
    earnedAt: null,
    progress: { current: 7, target: 10 }
  },
  // CHALLENGE BADGES
  {
    id: "minimalist",
    name: "Minimalist",
    description: "ลดเหลือ 3 Blocks แต่ได้ Score 90+",
    icon: "✨",
    color: "#C0C0C0",
    category: "challenge",
    requirement: "Complete Minimize with 3 blocks, score 90+",
    xpReward: 150,
    earnedAt: "2025-01-25",
    progress: null,
    rarity: "rare"
  },
  {
    id: "maximizer",
    name: "Maximizer",
    description: "ดัน Score ถึง 98+",
    icon: "📈",
    color: "#FFD700",
    category: "challenge",
    requirement: "Reach score 98+ in Maximize challenge",
    xpReward: 150,
    earnedAt: null,
    progress: { current: 95, target: 98 },
    rarity: "epic"
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "ผ่าน Fix Challenge ทั้งหมด",
    icon: "🔧",
    color: "#05F2F2",
    category: "challenge",
    requirement: "Complete all Fix challenges",
    xpReward: 200,
    earnedAt: null,
    progress: { current: 5, target: 10 }
  },
  {
    id: "master-builder",
    name: "Master Builder",
    description: "ผ่าน Build Challenge ทั้งหมด",
    icon: "🏗️",
    color: "#A855F7",
    category: "challenge",
    requirement: "Complete all Build challenges",
    xpReward: 200,
    earnedAt: null,
    progress: { current: 0, target: 10 },
    rarity: "epic"
  },
  // STREAK BADGES
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Streak 7 วันติดต่อกัน",
    icon: "🔥",
    color: "#F27405",
    category: "streak",
    requirement: "7-day streak",
    xpReward: 100,
    earnedAt: "2025-01-22",
    progress: null
  },
  {
    id: "monthly-master",
    name: "Monthly Master",
    description: "Streak 30 วันติดต่อกัน",
    icon: "🌟",
    color: "#FFD700",
    category: "streak",
    requirement: "30-day streak",
    xpReward: 300,
    earnedAt: null,
    progress: { current: 12, target: 30 },
    rarity: "epic"
  },
  // MASTERY BADGES
  {
    id: "role-master",
    name: "Role Master",
    description: "ใช้ ROLE blocks 50 ครั้ง",
    icon: "👤",
    color: "#05F2F2",
    category: "mastery",
    requirement: "Use ROLE blocks 50 times",
    xpReward: 100,
    earnedAt: null,
    progress: { current: 32, target: 50 }
  },
  {
    id: "tone-tuner",
    name: "Tone Tuner",
    description: "ทดลอง TONE blocks 30 ครั้ง",
    icon: "🎵",
    color: "#F27405",
    category: "mastery",
    requirement: "Experiment with TONE blocks 30 times",
    xpReward: 100,
    earnedAt: "2025-01-28",
    progress: null
  },
  // LEGENDARY BADGES
  {
    id: "lego-legend",
    name: "Lego Legend",
    description: "Complete ทุก Challenge",
    icon: "👑",
    color: "#A855F7",
    category: "legendary",
    requirement: "Complete all challenges in all modes",
    xpReward: 500,
    earnedAt: null,
    progress: { current: 9, target: 40 },
    rarity: "legendary"
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "ได้ 3 ดาว 10 challenges",
    icon: "⭐",
    color: "#FFD700",
    category: "legendary",
    requirement: "Get 3 stars on 10 different challenges",
    xpReward: 300,
    earnedAt: null,
    progress: { current: 4, target: 10 },
    rarity: "epic"
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "ผ่าน Challenge ใน 60 วินาที",
    icon: "⚡",
    color: "#05F2F2",
    category: "special",
    requirement: "Complete any challenge under 60 seconds",
    xpReward: 100,
    earnedAt: null,
    progress: null,
    rarity: "rare"
  }
];

export const MOCK_EXPERIMENT_HISTORY: ExperimentHistoryItem[] = [
  {
    id: "exp-001",
    type: "experiment",
    promptName: "Email Follow-up",
    date: "2025-01-30T14:30:00",
    originalScore: 92,
    modifiedScore: 58,
    changes: [{ blockType: "ROLE", action: "removed" }],
    insight: "ROLE คือ Block ที่สำคัญที่สุด ลบไม่ได้!",
    xpEarned: 45
  },
  {
    id: "exp-002",
    type: "challenge",
    challengeMode: "minimize",
    promptName: "Product Description",
    date: "2025-01-30T10:15:00",
    originalScore: 85,
    modifiedScore: 82,
    changes: [
      { blockType: "FORMAT", action: "removed" },
      { blockType: "EXAMPLE", action: "removed" }
    ],
    xpEarned: 120,
    blocksUsed: 3,
    targetBlocks: 3,
    passed: true,
    stars: 2
  },
  {
    id: "exp-003",
    type: "experiment",
    promptName: "Social Media Post",
    date: "2025-01-29T16:45:00",
    originalScore: 78,
    modifiedScore: 91,
    changes: [
      { blockType: "TONE", action: "modified" },
      { blockType: "TARGET", action: "added" }
    ],
    insight: "TARGET ช่วยให้ Output ตรงกลุ่มเป้าหมาย",
    xpEarned: 55
  },
  {
    id: "exp-004",
    type: "challenge",
    challengeMode: "fix",
    promptName: "Customer Support Reply",
    date: "2025-01-28T09:20:00",
    originalScore: 45,
    modifiedScore: 88,
    changes: [
      { blockType: "ROLE", action: "added" },
      { blockType: "TONE", action: "modified" }
    ],
    xpEarned: 100,
    passed: true,
    stars: 3
  },
  {
    id: "exp-005",
    type: "experiment",
    promptName: "Newsletter Opening",
    date: "2025-01-27T11:30:00",
    originalScore: 82,
    modifiedScore: 75,
    changes: [{ blockType: "FORMAT", action: "removed" }],
    insight: "FORMAT เป็น optional แต่ช่วยควบคุม output ได้ดี",
    xpEarned: 35
  }
];

export const MOCK_INSIGHTS: InsightItem[] = [
  {
    id: "insight-1",
    blockType: "ROLE",
    text: "ROLE คือ Block ที่สำคัญที่สุด ลบแล้วเสีย -34 points",
    description: "เมื่อขาด Role น้ำเสียงจะกลายเป็นหุ่นยนต์และขาดความใส่ใจ",
    discoveredAt: "2025-01-28",
    xpEarned: 30,
    experimentId: "exp-001"
  },
  {
    id: "insight-2",
    blockType: "TONE",
    text: "TONE เปลี่ยน = น้ำเสียงเปลี่ยนทั้งหมด",
    description: "การเปลี่ยน Tone ส่งผลต่อทุกส่วนของ Output",
    discoveredAt: "2025-01-27",
    xpEarned: 30,
    experimentId: "exp-003"
  },
  {
    id: "insight-3",
    blockType: "FORMAT",
    text: "FORMAT เป็น optional แต่ช่วยควบคุม output ได้ดี",
    description: "ไม่มี FORMAT ก็ได้ output แต่ยากควบคุมความยาวและโครงสร้าง",
    discoveredAt: "2025-01-25",
    xpEarned: 30,
    experimentId: "exp-005"
  },
  {
    id: "insight-4",
    blockType: "EXAMPLE",
    text: "EXAMPLE ช่วยให้ได้หลาย options",
    description: "เพิ่ม EXAMPLE block ทำให้ได้ผลลัพธ์หลากหลายขึ้น",
    discoveredAt: "2025-01-24",
    xpEarned: 30,
    experimentId: "exp-008"
  },
  {
    id: "insight-5",
    blockType: "TARGET",
    text: "TARGET ช่วยให้ Output ตรงกลุ่มเป้าหมาย",
    description: "ระบุ Target ชัดเจนทำให้ภาษาและ tone เหมาะสมกับผู้รับ",
    discoveredAt: "2025-01-22",
    xpEarned: 30,
    experimentId: "exp-010"
  }
];

export const getRankTitle = (level: number): { title: string; emoji: string } => {
  if (level <= 5) return { title: "Prompt Apprentice", emoji: "🌱" };
  if (level <= 10) return { title: "Prompt Builder", emoji: "🔨" };
  if (level <= 20) return { title: "Prompt Engineer", emoji: "⚙️" };
  if (level <= 50) return { title: "Prompt Master", emoji: "🎯" };
  return { title: "Lego Legend", emoji: "👑" };
};

export const TYPE_COLORS: Record<string, string> = {
  ROLE: "#05F2F2",
  TASK: "#05F2F2",
  CONTEXT: "#6593A6",
  TARGET: "#6593A6",
  TONE: "#F27405",
  FORMAT: "#F27405",
  EXAMPLE: "#F27405",
  CONSTRAINT: "#6593A6",
  BONUS: "#A855F7"
};
