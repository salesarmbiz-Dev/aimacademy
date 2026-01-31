import type { BlockType } from '@/components/prompt-lego/types';

export interface LibraryBlock {
  id: string;
  type: BlockType;
  content: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: number;
  usageCount: number;
  isFavorite: boolean;
  isCustom: boolean;
  tags: string[];
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SortOption = 'popular' | 'impact' | 'az' | 'recent' | 'usage';
export type ViewMode = 'grid' | 'list';
export type TabFilter = 'all' | 'critical' | 'high' | 'medium' | 'favorites' | 'custom';

export interface LibraryFilters {
  search: string;
  type: BlockType | 'all';
  priority: 'all' | 'critical' | 'high' | 'medium' | 'low';
  sort: SortOption;
  tab: TabFilter;
}

export const TYPE_COLORS: Record<BlockType, string> = {
  ROLE: 'turquoise',
  TASK: 'turquoise',
  CONTEXT: 'rackley',
  TARGET: 'rackley',
  TONE: 'tennessee',
  FORMAT: 'tennessee',
  EXAMPLE: 'tennessee',
  CONSTRAINT: 'rackley',
  BONUS: 'purple',
};

export const TYPE_IMPACTS: Record<BlockType, number> = {
  ROLE: 34,
  TASK: 22,
  TARGET: 28,
  CONTEXT: 20,
  TONE: 14,
  FORMAT: 8,
  EXAMPLE: -4,
  CONSTRAINT: 6,
  BONUS: 4,
};

export const MOCK_LIBRARY_BLOCKS: LibraryBlock[] = [
  // ROLE blocks
  {
    id: 'role-1',
    type: 'ROLE',
    content: 'คุณคือ expert ที่มีประสบการณ์ 10 ปี',
    priority: 'critical',
    impact: 34,
    usageCount: 156,
    isFavorite: true,
    isCustom: false,
    tags: ['professional', 'authority'],
    description: 'กำหนดให้ AI เป็นผู้เชี่ยวชาญที่มีความน่าเชื่อถือสูง เหมาะสำหรับ content ที่ต้องการ authority',
  },
  {
    id: 'role-2',
    type: 'ROLE',
    content: 'คุณคือเพื่อนที่ให้คำแนะนำ',
    priority: 'critical',
    impact: 34,
    usageCount: 89,
    isFavorite: false,
    isCustom: false,
    tags: ['friendly', 'casual'],
    description: 'กำหนดให้ AI เป็นเพื่อนที่เข้าถึงง่าย เหมาะสำหรับ content ที่ต้องการความเป็นกันเอง',
  },
  {
    id: 'role-3',
    type: 'ROLE',
    content: 'คุณคือ copywriter มืออาชีพ',
    priority: 'critical',
    impact: 34,
    usageCount: 203,
    isFavorite: true,
    isCustom: false,
    tags: ['marketing', 'creative'],
    description: 'กำหนดให้ AI เป็น copywriter สำหรับงานเขียน marketing content',
  },
  {
    id: 'role-4',
    type: 'ROLE',
    content: 'คุณคือ customer service ที่ใจดี',
    priority: 'critical',
    impact: 34,
    usageCount: 67,
    isFavorite: false,
    isCustom: false,
    tags: ['service', 'helpful'],
    description: 'กำหนดให้ AI เป็น CS ที่ใส่ใจลูกค้า',
  },
  {
    id: 'role-5',
    type: 'ROLE',
    content: 'คุณคือ coach ที่กระตุ้นให้ลงมือทำ',
    priority: 'critical',
    impact: 34,
    usageCount: 45,
    isFavorite: false,
    isCustom: false,
    tags: ['motivational', 'action'],
    description: 'กำหนดให้ AI เป็น coach ที่ช่วย motivate',
  },
  // TASK blocks
  {
    id: 'task-1',
    type: 'TASK',
    content: 'เขียน email follow-up',
    priority: 'critical',
    impact: 22,
    usageCount: 234,
    isFavorite: false,
    isCustom: false,
    tags: ['email', 'follow-up'],
    description: 'สั่งให้เขียน email ติดตามลูกค้า',
  },
  {
    id: 'task-2',
    type: 'TASK',
    content: 'สร้าง content สำหรับ social media',
    priority: 'critical',
    impact: 22,
    usageCount: 189,
    isFavorite: false,
    isCustom: false,
    tags: ['social', 'content'],
    description: 'สั่งให้สร้าง social media post',
  },
  {
    id: 'task-3',
    type: 'TASK',
    content: 'เขียน product description',
    priority: 'critical',
    impact: 22,
    usageCount: 156,
    isFavorite: true,
    isCustom: false,
    tags: ['product', 'description'],
    description: 'สั่งให้เขียนรายละเอียดสินค้า',
  },
  // TARGET blocks
  {
    id: 'target-1',
    type: 'TARGET',
    content: 'สำหรับลูกค้าที่สนใจแต่ยังไม่ซื้อ',
    priority: 'high',
    impact: 28,
    usageCount: 145,
    isFavorite: false,
    isCustom: false,
    tags: ['prospect', 'warm-lead'],
    description: 'กำหนดกลุ่มเป้าหมายเป็น warm leads',
  },
  {
    id: 'target-2',
    type: 'TARGET',
    content: 'สำหรับลูกค้าใหม่ที่ยังไม่รู้จักแบรนด์',
    priority: 'high',
    impact: 28,
    usageCount: 98,
    isFavorite: false,
    isCustom: false,
    tags: ['new-customer', 'awareness'],
    description: 'กำหนดกลุ่มเป้าหมายเป็นคนใหม่',
  },
  {
    id: 'target-3',
    type: 'TARGET',
    content: 'สำหรับลูกค้าเก่าที่ต้องการ upsell',
    priority: 'high',
    impact: 28,
    usageCount: 76,
    isFavorite: false,
    isCustom: false,
    tags: ['existing', 'upsell'],
    description: 'กำหนดกลุ่มเป้าหมายเป็นลูกค้าเก่า',
  },
  // TONE blocks
  {
    id: 'tone-1',
    type: 'TONE',
    content: 'โทนเป็นกันเอง สนุก',
    priority: 'medium',
    impact: 14,
    usageCount: 178,
    isFavorite: true,
    isCustom: false,
    tags: ['casual', 'fun'],
    description: 'กำหนดน้ำเสียงให้เป็นมิตรและสนุกสนาน',
  },
  {
    id: 'tone-2',
    type: 'TONE',
    content: 'โทนเป็นทางการ มืออาชีพ',
    priority: 'medium',
    impact: 14,
    usageCount: 134,
    isFavorite: false,
    isCustom: false,
    tags: ['formal', 'professional'],
    description: 'กำหนดน้ำเสียงให้เป็นทางการ',
  },
  {
    id: 'tone-3',
    type: 'TONE',
    content: 'โทนอบอุ่น ใส่ใจ',
    priority: 'medium',
    impact: 14,
    usageCount: 89,
    isFavorite: false,
    isCustom: false,
    tags: ['warm', 'caring'],
    description: 'กำหนดน้ำเสียงให้อบอุ่นและห่วงใย',
  },
  {
    id: 'tone-4',
    type: 'TONE',
    content: 'โทนกระตุ้น urgent',
    priority: 'medium',
    impact: 14,
    usageCount: 67,
    isFavorite: false,
    isCustom: false,
    tags: ['urgent', 'action'],
    description: 'กำหนดน้ำเสียงให้เร่งด่วนกระตุ้นให้ action',
  },
  {
    id: 'tone-5',
    type: 'TONE',
    content: 'โทนสุขุม น่าเชื่อถือ',
    priority: 'medium',
    impact: 14,
    usageCount: 112,
    isFavorite: false,
    isCustom: false,
    tags: ['calm', 'trustworthy'],
    description: 'กำหนดน้ำเสียงให้สุขุมและน่าเชื่อถือ',
  },
  // FORMAT blocks
  {
    id: 'format-1',
    type: 'FORMAT',
    content: 'ความยาว 50 คำ',
    priority: 'medium',
    impact: 8,
    usageCount: 234,
    isFavorite: false,
    isCustom: false,
    tags: ['short', 'concise'],
    description: 'จำกัดความยาวให้กระชับ 50 คำ',
  },
  {
    id: 'format-2',
    type: 'FORMAT',
    content: 'ความยาว 100 คำ',
    priority: 'medium',
    impact: 8,
    usageCount: 189,
    isFavorite: false,
    isCustom: false,
    tags: ['medium', 'standard'],
    description: 'ความยาวมาตรฐาน 100 คำ',
  },
  {
    id: 'format-3',
    type: 'FORMAT',
    content: 'เป็น bullet points 5 ข้อ',
    priority: 'medium',
    impact: 8,
    usageCount: 156,
    isFavorite: false,
    isCustom: false,
    tags: ['list', 'bullets'],
    description: 'กำหนดให้แสดงผลเป็น bullet points',
  },
  {
    id: 'format-4',
    type: 'FORMAT',
    content: 'มี emoji ให้น่าอ่าน',
    priority: 'medium',
    impact: 8,
    usageCount: 98,
    isFavorite: false,
    isCustom: false,
    tags: ['emoji', 'visual'],
    description: 'เพิ่ม emoji เพื่อความน่าสนใจ',
  },
  {
    id: 'format-5',
    type: 'FORMAT',
    content: 'แบ่งเป็น 3 ย่อหน้า',
    priority: 'medium',
    impact: 8,
    usageCount: 87,
    isFavorite: false,
    isCustom: false,
    tags: ['paragraphs', 'structure'],
    description: 'กำหนดโครงสร้างเป็น 3 ย่อหน้า',
  },
  {
    id: 'format-6',
    type: 'FORMAT',
    content: 'มี headline + body + CTA',
    priority: 'medium',
    impact: 8,
    usageCount: 145,
    isFavorite: true,
    isCustom: false,
    tags: ['marketing', 'structure'],
    description: 'โครงสร้าง marketing content มาตรฐาน',
  },
  // EXAMPLE blocks
  {
    id: 'example-1',
    type: 'EXAMPLE',
    content: 'ให้ตัวอย่าง 2 แบบ',
    priority: 'medium',
    impact: -4,
    usageCount: 123,
    isFavorite: false,
    isCustom: false,
    tags: ['options', 'variety'],
    description: 'ขอให้ AI สร้าง 2 versions',
  },
  {
    id: 'example-2',
    type: 'EXAMPLE',
    content: 'แสดงตัวอย่าง before/after',
    priority: 'medium',
    impact: -4,
    usageCount: 67,
    isFavorite: false,
    isCustom: false,
    tags: ['comparison', 'transformation'],
    description: 'ขอให้แสดงการเปลี่ยนแปลง',
  },
  // CONSTRAINT blocks
  {
    id: 'constraint-1',
    type: 'CONSTRAINT',
    content: 'ห้ามใช้ศัพท์เทคนิค',
    priority: 'low',
    impact: 6,
    usageCount: 89,
    isFavorite: false,
    isCustom: false,
    tags: ['simple', 'accessible'],
    description: 'ห้ามใช้คำศัพท์ที่ยากเกินไป',
  },
  {
    id: 'constraint-2',
    type: 'CONSTRAINT',
    content: 'เน้น benefit ไม่ใช่ feature',
    priority: 'low',
    impact: 6,
    usageCount: 134,
    isFavorite: true,
    isCustom: false,
    tags: ['benefits', 'customer-centric'],
    description: 'ให้เน้นประโยชน์ที่ลูกค้าได้รับ',
  },
  {
    id: 'constraint-3',
    type: 'CONSTRAINT',
    content: 'ใส่ตัวเลข/สถิติ',
    priority: 'low',
    impact: 6,
    usageCount: 112,
    isFavorite: false,
    isCustom: false,
    tags: ['data', 'credibility'],
    description: 'เพิ่มความน่าเชื่อถือด้วยตัวเลข',
  },
  {
    id: 'constraint-4',
    type: 'CONSTRAINT',
    content: 'จบด้วยคำถาม',
    priority: 'low',
    impact: 6,
    usageCount: 78,
    isFavorite: false,
    isCustom: false,
    tags: ['engagement', 'question'],
    description: 'สร้าง engagement ด้วยคำถามท้าย',
  },
  // CONTEXT blocks
  {
    id: 'context-1',
    type: 'CONTEXT',
    content: 'ในบริบทของ startup',
    priority: 'high',
    impact: 20,
    usageCount: 56,
    isFavorite: false,
    isCustom: false,
    tags: ['startup', 'business'],
    description: 'กำหนดบริบทให้เป็น startup environment',
  },
  {
    id: 'context-2',
    type: 'CONTEXT',
    content: 'สำหรับแคมเปญปีใหม่',
    priority: 'high',
    impact: 20,
    usageCount: 45,
    isFavorite: false,
    isCustom: false,
    tags: ['campaign', 'seasonal'],
    description: 'กำหนดบริบทให้เป็นแคมเปญเทศกาล',
  },
  {
    id: 'context-3',
    type: 'CONTEXT',
    content: 'เป็นส่วนหนึ่งของ email series',
    priority: 'high',
    impact: 20,
    usageCount: 34,
    isFavorite: false,
    isCustom: false,
    tags: ['email', 'series'],
    description: 'กำหนดบริบทให้เป็นส่วนหนึ่งของ email automation',
  },
];

export const filterBlocks = (blocks: LibraryBlock[], filters: LibraryFilters): LibraryBlock[] => {
  return blocks.filter(block => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchContent = block.content.toLowerCase().includes(searchLower);
      const matchTags = block.tags?.some(t => t.toLowerCase().includes(searchLower));
      const matchDesc = block.description?.toLowerCase().includes(searchLower);
      if (!matchContent && !matchTags && !matchDesc) return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      if (block.type !== filters.type) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (block.priority !== filters.priority) return false;
    }

    // Tab filter
    if (filters.tab === 'favorites' && !block.isFavorite) return false;
    if (filters.tab === 'custom' && !block.isCustom) return false;
    if (filters.tab === 'critical' && block.priority !== 'critical') return false;
    if (filters.tab === 'high' && block.priority !== 'high') return false;
    if (filters.tab === 'medium' && (block.priority !== 'medium' && block.priority !== 'low')) return false;

    return true;
  });
};

export const sortBlocks = (blocks: LibraryBlock[], sortBy: SortOption): LibraryBlock[] => {
  switch (sortBy) {
    case 'popular':
    case 'usage':
      return [...blocks].sort((a, b) => b.usageCount - a.usageCount);
    case 'impact':
      return [...blocks].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    case 'az':
      return [...blocks].sort((a, b) => a.content.localeCompare(b.content, 'th'));
    case 'recent':
      return [...blocks].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    default:
      return blocks;
  }
};
