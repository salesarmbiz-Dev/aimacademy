import type { PromptBlock } from '@/components/prompt-lego/types';

export type ChallengeMode = 'minimize' | 'maximize' | 'fix' | 'build';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Challenge {
  id: string;
  mode: ChallengeMode;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  startingBlocks: PromptBlock[];
  targetScore: number;
  targetBlocks?: number; // For minimize mode
  timeLimit?: number; // seconds, null for unlimited
  maxAttempts: number;
  rewards: {
    base: number;
    speedBonus?: number;
    minimalBonus?: number;
  };
  hints: string[];
  requiredBlockTypes?: string[]; // For build mode
  taskDescription?: string; // For build mode
}

export interface ChallengeProgress {
  completed: string[];
  scores: Record<string, number>;
  attempts: Record<string, number>;
  bestTimes: Record<string, number>;
  stars: Record<string, number>;
}

export interface ChallengeResult {
  passed: boolean;
  score: number;
  blocksUsed: number;
  timeSpent: number;
  stars: number;
  xpEarned: number;
  bonuses: { label: string; xp: number }[];
  badge?: string;
}

export const DIFFICULTY_COLORS: Record<ChallengeDifficulty, { text: string; bg: string }> = {
  easy: { text: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  medium: { text: 'text-tennessee', bg: 'bg-tennessee/20' },
  hard: { text: 'text-red-400', bg: 'bg-red-400/20' },
  expert: { text: 'text-purple-400', bg: 'bg-purple-400/20' },
};

export const MODE_COLORS: Record<ChallengeMode, string> = {
  minimize: 'turquoise',
  maximize: 'tennessee',
  fix: 'turquoise',
  build: 'tennessee',
};

// Mock challenge data
export const MOCK_CHALLENGES: Record<ChallengeMode, Challenge[]> = {
  minimize: [
    {
      id: 'min-1',
      mode: 'minimize',
      title: 'Email Follow-up',
      description: 'ลด Prompt email ให้กระชับที่สุด',
      difficulty: 'easy',
      startingBlocks: [
        { id: 'b1', type: 'ROLE', content: 'คุณคือ marketing expert', priority: 'critical', impact: -34 },
        { id: 'b2', type: 'TASK', content: 'เขียน email follow-up', priority: 'critical', impact: -22 },
        { id: 'b3', type: 'TARGET', content: 'สำหรับลูกค้าที่สนใจแต่ยังไม่ซื้อ', priority: 'high', impact: -28 },
        { id: 'b4', type: 'TONE', content: 'โทนเป็นกันเอง', priority: 'medium', impact: -14 },
        { id: 'b5', type: 'FORMAT', content: 'ความยาว 100 คำ มี CTA ชัดเจน', priority: 'medium', impact: -8 },
        { id: 'b6', type: 'CONSTRAINT', content: 'ห้ามใช้ศัพท์เทคนิค', priority: 'medium', impact: -5 },
      ],
      targetScore: 80,
      targetBlocks: 3,
      timeLimit: 180,
      maxAttempts: 3,
      rewards: { base: 100, speedBonus: 20, minimalBonus: 30 },
      hints: ['ROLE block สำคัญมาก อย่าลบ', 'FORMAT อาจไม่จำเป็นเท่าไหร่'],
    },
    {
      id: 'min-2',
      mode: 'minimize',
      title: 'Product Description',
      description: 'ลด Prompt สำหรับอธิบายสินค้า',
      difficulty: 'medium',
      startingBlocks: [
        { id: 'b1', type: 'ROLE', content: 'คุณคือ copywriter มืออาชีพ', priority: 'critical', impact: -34 },
        { id: 'b2', type: 'TASK', content: 'เขียนคำอธิบายสินค้า', priority: 'critical', impact: -22 },
        { id: 'b3', type: 'TARGET', content: 'สำหรับ e-commerce platform', priority: 'high', impact: -28 },
        { id: 'b4', type: 'TONE', content: 'โทนดึงดูดใจ น่าซื้อ', priority: 'medium', impact: -14 },
        { id: 'b5', type: 'FORMAT', content: '3 bullet points + 1 paragraph', priority: 'medium', impact: -8 },
        { id: 'b6', type: 'EXAMPLE', content: 'ให้ตัวอย่าง 2 แบบ', priority: 'low', impact: -5 },
        { id: 'b7', type: 'CONSTRAINT', content: 'เน้น benefit ไม่ใช่ feature', priority: 'medium', impact: -5 },
      ],
      targetScore: 80,
      targetBlocks: 4,
      timeLimit: 150,
      maxAttempts: 3,
      rewards: { base: 120, speedBonus: 25, minimalBonus: 40 },
      hints: ['TASK และ ROLE ขาดไม่ได้', 'EXAMPLE อาจตัดออกได้'],
    },
    {
      id: 'min-3',
      mode: 'minimize',
      title: 'Sales Pitch',
      description: 'ลด Prompt สำหรับ sales pitch',
      difficulty: 'hard',
      startingBlocks: [
        { id: 'b1', type: 'ROLE', content: 'คุณคือ sales expert', priority: 'critical', impact: -34 },
        { id: 'b2', type: 'TASK', content: 'เขียน sales pitch', priority: 'critical', impact: -22 },
        { id: 'b3', type: 'TARGET', content: 'สำหรับผู้บริหาร C-level', priority: 'high', impact: -28 },
        { id: 'b4', type: 'CONTEXT', content: 'ในบริบทของ B2B SaaS', priority: 'high', impact: -20 },
        { id: 'b5', type: 'TONE', content: 'โทนมืออาชีพ น่าเชื่อถือ', priority: 'medium', impact: -14 },
        { id: 'b6', type: 'FORMAT', content: 'ความยาว 150 คำ', priority: 'medium', impact: -8 },
        { id: 'b7', type: 'CONSTRAINT', content: 'ใส่ตัวเลข/สถิติ', priority: 'medium', impact: -5 },
        { id: 'b8', type: 'BONUS', content: 'จบด้วย call to action', priority: 'low', impact: -3 },
      ],
      targetScore: 85,
      targetBlocks: 3,
      timeLimit: 120,
      maxAttempts: 3,
      rewards: { base: 150, speedBonus: 30, minimalBonus: 50 },
      hints: ['C-level ต้องการความกระชับ', 'CONTEXT อาจรวมกับ TARGET ได้'],
    },
  ],
  maximize: [
    {
      id: 'max-1',
      mode: 'maximize',
      title: 'Simple Greeting',
      description: 'เพิ่ม Block เพื่อดัน Score',
      difficulty: 'easy',
      startingBlocks: [
        { id: 'b1', type: 'TASK', content: 'เขียนข้อความทักทาย', priority: 'critical', impact: -22 },
        { id: 'b2', type: 'TARGET', content: 'สำหรับลูกค้าใหม่', priority: 'high', impact: -28 },
        { id: 'b3', type: 'TONE', content: 'โทนอบอุ่น เป็นกันเอง', priority: 'medium', impact: -14 },
      ],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 100, speedBonus: 20 },
      hints: ['ลอง ROLE block เพิ่มความน่าเชื่อถือ', 'FORMAT ช่วยควบคุม output'],
    },
    {
      id: 'max-2',
      mode: 'maximize',
      title: 'Blog Intro',
      description: 'ดัน Prompt blog intro ให้ดีขึ้น',
      difficulty: 'medium',
      startingBlocks: [
        { id: 'b1', type: 'TASK', content: 'เขียน intro บทความ', priority: 'critical', impact: -22 },
        { id: 'b2', type: 'TARGET', content: 'สำหรับคนสนใจ AI', priority: 'high', impact: -28 },
        { id: 'b3', type: 'FORMAT', content: '2 paragraphs', priority: 'medium', impact: -8 },
      ],
      targetScore: 90,
      maxAttempts: 3,
      rewards: { base: 120, speedBonus: 25 },
      hints: ['ROLE ช่วยให้มีทิศทาง', 'TONE ทำให้น่าอ่าน'],
    },
    {
      id: 'max-3',
      mode: 'maximize',
      title: 'Marketing Copy',
      description: 'ดัน Prompt marketing ให้ถึง 95+',
      difficulty: 'hard',
      startingBlocks: [
        { id: 'b1', type: 'TASK', content: 'เขียน marketing copy', priority: 'critical', impact: -22 },
        { id: 'b2', type: 'TARGET', content: 'สำหรับ Gen Z', priority: 'high', impact: -28 },
      ],
      targetScore: 95,
      maxAttempts: 3,
      rewards: { base: 150, speedBonus: 30 },
      hints: ['ต้องมี ROLE ที่ชัดเจน', 'EXAMPLE ช่วยเพิ่ม score ได้'],
    },
  ],
  fix: [
    {
      id: 'fix-1',
      mode: 'fix',
      title: 'Missing Role',
      description: 'Prompt นี้ขาด Block สำคัญ',
      difficulty: 'easy',
      startingBlocks: [
        { id: 'b1', type: 'TASK', content: 'เขียน email', priority: 'critical', impact: -22 },
        { id: 'b2', type: 'TONE', content: 'โทนทางการ', priority: 'medium', impact: -14 },
        { id: 'b3', type: 'FORMAT', content: '100 คำ', priority: 'medium', impact: -8 },
      ],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 100, speedBonus: 20 },
      hints: ['ลองเพิ่ม ROLE block', 'ใครเขียน email นี้?'],
    },
    {
      id: 'fix-2',
      mode: 'fix',
      title: 'Wrong Tone',
      description: 'Tone ไม่ตรงกับ Target',
      difficulty: 'medium',
      startingBlocks: [
        { id: 'b1', type: 'ROLE', content: 'คุณคือ customer service', priority: 'critical', impact: -34 },
        { id: 'b2', type: 'TASK', content: 'ตอบ complaint', priority: 'critical', impact: -22 },
        { id: 'b3', type: 'TARGET', content: 'ลูกค้าที่โกรธมาก', priority: 'high', impact: -28 },
        { id: 'b4', type: 'TONE', content: 'โทนสนุก ขี้เล่น', priority: 'medium', impact: -14 },
      ],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 120, speedBonus: 25 },
      hints: ['TONE ไม่เหมาะกับสถานการณ์', 'ลูกค้าโกรธ ควรใช้ tone แบบไหน?'],
    },
    {
      id: 'fix-3',
      mode: 'fix',
      title: 'Multiple Issues',
      description: 'หลาย Block มีปัญหา',
      difficulty: 'hard',
      startingBlocks: [
        { id: 'b1', type: 'TASK', content: 'เขียนอะไรสักอย่าง', priority: 'critical', impact: -22 },
        { id: 'b2', type: 'TONE', content: 'โทนอะไรก็ได้', priority: 'medium', impact: -14 },
        { id: 'b3', type: 'FORMAT', content: 'ยาวเท่าไหร่ก็ได้', priority: 'medium', impact: -8 },
      ],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 150, speedBonus: 30 },
      hints: ['TASK ไม่ชัดเจน', 'ขาด ROLE และ TARGET'],
    },
  ],
  build: [
    {
      id: 'build-1',
      mode: 'build',
      title: 'Customer Support Reply',
      description: 'สร้าง Prompt สำหรับตอบลูกค้า',
      difficulty: 'medium',
      startingBlocks: [],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 150, speedBonus: 30 },
      hints: ['เริ่มจาก ROLE ก่อน', 'อย่าลืม TARGET'],
      requiredBlockTypes: ['ROLE', 'TASK', 'TARGET'],
      taskDescription: 'สร้าง Prompt สำหรับ AI ตอบลูกค้าที่มีคำถามเกี่ยวกับสินค้า',
    },
    {
      id: 'build-2',
      mode: 'build',
      title: 'Social Media Post',
      description: 'สร้าง Prompt สำหรับ social media',
      difficulty: 'medium',
      startingBlocks: [],
      targetScore: 85,
      maxAttempts: 3,
      rewards: { base: 150, speedBonus: 30 },
      hints: ['TONE สำคัญสำหรับ social', 'FORMAT กำหนดความยาว'],
      requiredBlockTypes: ['ROLE', 'TASK', 'TONE'],
      taskDescription: 'สร้าง Prompt สำหรับเขียน post โปรโมทร้านกาแฟใหม่',
    },
    {
      id: 'build-3',
      mode: 'build',
      title: 'Newsletter Opening',
      description: 'สร้าง Prompt สำหรับ newsletter',
      difficulty: 'hard',
      startingBlocks: [],
      targetScore: 90,
      maxAttempts: 3,
      rewards: { base: 180, speedBonus: 35 },
      hints: ['ต้องมี ROLE ที่ชัด', 'EXAMPLE ช่วยเพิ่ม score'],
      requiredBlockTypes: ['ROLE', 'TASK', 'TARGET', 'TONE'],
      taskDescription: 'สร้าง Prompt สำหรับเขียน intro ของ weekly newsletter บริษัท tech startup',
    },
  ],
};
