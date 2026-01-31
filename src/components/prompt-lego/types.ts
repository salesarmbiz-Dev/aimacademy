export interface PromptBlock {
  id: string;
  type: BlockType;
  content: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: number;
}

export type BlockType = 
  | 'ROLE' 
  | 'TASK' 
  | 'CONTEXT' 
  | 'TARGET' 
  | 'TONE' 
  | 'FORMAT' 
  | 'EXAMPLE' 
  | 'CONSTRAINT' 
  | 'BONUS';

export interface PromptTemplate {
  id: string;
  name: string;
  originalScore: number;
  originalPrompt: string;
  blocks: PromptBlock[];
}

export const BLOCK_COLORS: Record<BlockType, string> = {
  ROLE: 'turquoise',
  TASK: 'turquoise',
  CONTEXT: 'rackley',
  TARGET: 'rackley',
  TONE: 'tennessee',
  FORMAT: 'tennessee',
  EXAMPLE: 'tennessee',
  CONSTRAINT: 'rackley',
  BONUS: 'rackley',
};

export const BLOCK_PRIORITIES: Record<BlockType, PromptBlock['priority']> = {
  ROLE: 'critical',
  TASK: 'critical',
  CONTEXT: 'high',
  TARGET: 'high',
  TONE: 'medium',
  FORMAT: 'medium',
  EXAMPLE: 'medium',
  CONSTRAINT: 'medium',
  BONUS: 'low',
};

export const MOCK_PROMPTS: PromptTemplate[] = [
  {
    id: 'email-followup',
    name: 'Email Follow-up (Score: 92)',
    originalScore: 92,
    originalPrompt: 'คุณคือ marketing expert เขียน email follow-up สำหรับลูกค้าที่สนใจแต่ยังไม่ซื้อ โทนเป็นกันเอง ความยาว 100 คำ มี CTA ชัดเจน',
    blocks: [
      { id: 'block-1', type: 'ROLE', content: 'คุณคือ marketing expert', priority: 'critical', impact: -34 },
      { id: 'block-2', type: 'TASK', content: 'เขียน email follow-up', priority: 'critical', impact: -22 },
      { id: 'block-3', type: 'TARGET', content: 'สำหรับลูกค้าที่สนใจแต่ยังไม่ซื้อ', priority: 'high', impact: -28 },
      { id: 'block-4', type: 'TONE', content: 'โทนเป็นกันเอง', priority: 'medium', impact: -14 },
      { id: 'block-5', type: 'FORMAT', content: 'ความยาว 100 คำ มี CTA ชัดเจน', priority: 'medium', impact: -8 },
    ],
  },
  {
    id: 'product-desc',
    name: 'Product Description (Score: 85)',
    originalScore: 85,
    originalPrompt: 'คุณคือ copywriter เขียนคำอธิบายสินค้าสำหรับ e-commerce โทนดึงดูดใจ เน้น benefit มี 3 bullet points',
    blocks: [
      { id: 'block-1', type: 'ROLE', content: 'คุณคือ copywriter', priority: 'critical', impact: -34 },
      { id: 'block-2', type: 'TASK', content: 'เขียนคำอธิบายสินค้า', priority: 'critical', impact: -22 },
      { id: 'block-3', type: 'TARGET', content: 'สำหรับ e-commerce', priority: 'high', impact: -20 },
      { id: 'block-4', type: 'TONE', content: 'โทนดึงดูดใจ เน้น benefit', priority: 'medium', impact: -14 },
      { id: 'block-5', type: 'FORMAT', content: 'มี 3 bullet points', priority: 'medium', impact: -8 },
    ],
  },
  {
    id: 'social-post',
    name: 'Social Media Post (Score: 78)',
    originalScore: 78,
    originalPrompt: 'เขียนโพสต์ Facebook สำหรับร้านกาแฟ โทนสนุก มี emoji ความยาว 50 คำ',
    blocks: [
      { id: 'block-1', type: 'TASK', content: 'เขียนโพสต์ Facebook', priority: 'critical', impact: -22 },
      { id: 'block-2', type: 'TARGET', content: 'สำหรับร้านกาแฟ', priority: 'high', impact: -20 },
      { id: 'block-3', type: 'TONE', content: 'โทนสนุก มี emoji', priority: 'medium', impact: -14 },
      { id: 'block-4', type: 'FORMAT', content: 'ความยาว 50 คำ', priority: 'medium', impact: -8 },
    ],
  },
  {
    id: 'customer-support',
    name: 'Customer Support Reply (Score: 88)',
    originalScore: 88,
    originalPrompt: 'คุณคือ customer service ตอบลูกค้าที่มีปัญหา โทนใจดีและเข้าใจ เสนอวิธีแก้ไขที่ชัดเจน',
    blocks: [
      { id: 'block-1', type: 'ROLE', content: 'คุณคือ customer service', priority: 'critical', impact: -34 },
      { id: 'block-2', type: 'TASK', content: 'ตอบลูกค้าที่มีปัญหา', priority: 'critical', impact: -22 },
      { id: 'block-3', type: 'TONE', content: 'โทนใจดีและเข้าใจ', priority: 'medium', impact: -14 },
      { id: 'block-4', type: 'CONSTRAINT', content: 'เสนอวิธีแก้ไขที่ชัดเจน', priority: 'medium', impact: -12 },
    ],
  },
];

export const BLOCK_LIBRARY: Record<string, { content: string }[]> = {
  ROLE: [
    { content: 'คุณคือ expert ที่มีประสบการณ์ 10 ปี' },
    { content: 'คุณคือเพื่อนที่ให้คำแนะนำ' },
    { content: 'คุณคือ copywriter มืออาชีพ' },
    { content: 'คุณคือ customer service ที่ใจดี' },
    { content: 'คุณคือ coach ที่กระตุ้นให้ลงมือทำ' },
  ],
  TASK: [
    { content: 'เขียนบทความ' },
    { content: 'สรุปเนื้อหา' },
    { content: 'แปลภาษา' },
    { content: 'ตอบคำถาม' },
    { content: 'วิเคราะห์ข้อมูล' },
  ],
  TONE: [
    { content: 'โทนเป็นกันเอง สนุก' },
    { content: 'โทนเป็นทางการ มืออาชีพ' },
    { content: 'โทนอบอุ่น ใส่ใจ' },
    { content: 'โทนกระตุ้น urgent' },
    { content: 'โทนสุขุม น่าเชื่อถือ' },
  ],
  FORMAT: [
    { content: 'ความยาว 50 คำ' },
    { content: 'เป็น bullet points 5 ข้อ' },
    { content: 'มี emoji ให้น่าอ่าน' },
    { content: 'แบ่งเป็น 3 ย่อหน้า' },
    { content: 'มี headline + body + CTA' },
  ],
  EXAMPLE: [
    { content: 'ให้ตัวอย่าง 2 แบบ' },
    { content: 'แสดงตัวอย่าง before/after' },
  ],
  CONSTRAINT: [
    { content: 'ห้ามใช้ศัพท์เทคนิค' },
    { content: 'เน้น benefit ไม่ใช่ feature' },
    { content: 'ใส่ตัวเลข/สถิติ' },
    { content: 'จบด้วยคำถาม' },
  ],
  TARGET: [
    { content: 'สำหรับผู้เริ่มต้น' },
    { content: 'สำหรับลูกค้า B2B' },
    { content: 'สำหรับวัยรุ่น Gen Z' },
    { content: 'สำหรับผู้บริหาร' },
  ],
  CONTEXT: [
    { content: 'ในบริบทของ startup' },
    { content: 'สำหรับแคมเปญปีใหม่' },
    { content: 'เป็นส่วนหนึ่งของ email series' },
  ],
};

export const calculateScore = (blocks: PromptBlock[]): number => {
  let score = 100;
  const hasRole = blocks.some(b => b.type === 'ROLE');
  const hasTask = blocks.some(b => b.type === 'TASK');
  const hasTarget = blocks.some(b => b.type === 'TARGET');
  const hasContext = blocks.some(b => b.type === 'CONTEXT');
  const hasTone = blocks.some(b => b.type === 'TONE');
  const hasFormat = blocks.some(b => b.type === 'FORMAT');
  const hasExample = blocks.some(b => b.type === 'EXAMPLE');

  if (!hasRole) score -= 34;
  if (!hasTask) score -= 22;
  if (!hasTarget && !hasContext) score -= 20;
  if (!hasTone) score -= 14;
  if (!hasFormat) score -= 8;
  if (hasExample) score += 4;

  // Small variance based on block count for realism
  const blockBonus = Math.min(blocks.length * 2, 10);
  score += blockBonus - 8;

  return Math.max(0, Math.min(100, Math.round(score)));
};
