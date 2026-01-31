// Spot the Difference - Pattern Library Data

export type PatternCategory = 'role' | 'context' | 'format' | 'tone' | 'efficiency';

export interface PatternData {
  id: string;
  text: string;
  category: PatternCategory;
  description: string;
  example?: string;
  relatedChallenges: string[];
}

// All possible patterns that can be discovered
export const ALL_PATTERNS: PatternData[] = [
  // ============ ROLE PATTERNS ============
  {
    id: 'pattern_role_specific',
    text: 'Prompt ที่ดีต้องมี Role ชัดเจน',
    category: 'role',
    description: 'Role ที่ specific ดีกว่า generic เช่น "copywriter 10 ปี" ดีกว่า "ผู้เชี่ยวชาญ"',
    example: '"คุณคือ copywriter ที่เชี่ยวชาญการขายคอร์สออนไลน์" แทน "เขียนโฆษณา"',
    relatedChallenges: ['sm_001', 'sm_006'],
  },
  {
    id: 'pattern_role_expertise',
    text: 'Role + Expertise Level = Authority สูงขึ้น',
    category: 'role',
    description: 'การระบุระดับความเชี่ยวชาญทำให้ Output มีคุณภาพดีขึ้น',
    example: '"senior marketing specialist 10 ปี" แทน "marketing specialist"',
    relatedChallenges: ['sm_001'],
  },
  {
    id: 'pattern_role_target',
    text: 'Prompt ที่ดีต้องมี Role + Target + Pain Point',
    category: 'role',
    description: 'ทั้ง 3 องค์ประกอบนี้ทำให้ AI เข้าใจบริบทได้ครบถ้วน',
    relatedChallenges: ['sm_001'],
  },
  {
    id: 'pattern_role_requirements',
    text: 'Role + Requirements ที่ชัด = Output ที่ใช้งานได้จริง',
    category: 'role',
    description: 'การระบุ Role พร้อม requirements ที่ต้องการทำให้ได้ผลลัพธ์ตรงประเด็น',
    relatedChallenges: ['sm_006'],
  },

  // ============ CONTEXT PATTERNS ============
  {
    id: 'pattern_context_complete',
    text: 'ยิ่ง Context ครบ Output ยิ่งตรงประเด็น',
    category: 'context',
    description: 'Context ที่ดีต้องบอก อะไร เมื่อไหร่ ให้ใคร อย่างชัดเจน',
    example: 'Black Friday, 50%, 3 วันเท่านั้น vs "โปรโมชัน"',
    relatedChallenges: ['em_001', 'sm_003'],
  },
  {
    id: 'pattern_context_pain',
    text: 'บอก Pain Point = Output address ปัญหาได้',
    category: 'context',
    description: 'เมื่อระบุ pain point AI จะเขียน copy ที่ตอบโจทย์ปัญหานั้นๆ',
    relatedChallenges: ['sm_001'],
  },
  {
    id: 'pattern_context_target',
    text: 'Target Audience ชัด = Tone เหมาะสม',
    category: 'context',
    description: 'การระบุกลุ่มเป้าหมายช่วยให้ AI ปรับภาษาให้เหมาะสม',
    example: 'วัยรุ่น 18-25 = ภาษา Gen Z vs ผู้บริหาร = formal',
    relatedChallenges: ['sm_004', 'sm_003'],
  },
  {
    id: 'pattern_context_situation',
    text: 'ยิ่งบอกสถานการณ์ชัด Output ยิ่งเฉพาะเจาะจง',
    category: 'context',
    description: 'รายละเอียดสถานการณ์ช่วยให้ AI เข้าใจบริบทได้ดีขึ้น',
    relatedChallenges: ['em_001', 'cs_001'],
  },

  // ============ FORMAT PATTERNS ============
  {
    id: 'pattern_format_match',
    text: 'Format ต้องเหมาะกับช่องทาง',
    category: 'format',
    description: 'DM ต้องสั้น อ่านง่าย, Email ต้องมี subject และ structure',
    example: 'DM: ข้อความสั้น แยกบรรทัด vs Email: เนื้อหายาวกว่า มี subject',
    relatedChallenges: ['cs_001', 'cs_002'],
  },
  {
    id: 'pattern_format_constraints',
    text: 'ระบุ Format + Constraints + Required Elements = Output ตรงใจ',
    category: 'format',
    description: 'การบอก constraints เช่น จำนวนตัวอักษร องค์ประกอบที่ต้องมี ช่วยให้ได้ผลตรงต้องการ',
    example: '5 tweets, 280 chars, include [LINK], create urgency',
    relatedChallenges: ['sm_005'],
  },
  {
    id: 'pattern_format_structure',
    text: 'ระบุ Structure ช่วยให้ Output จัดระเบียบดี',
    category: 'format',
    description: 'บอกโครงสร้างที่ต้องการ เช่น intro-body-cta ได้ผลลัพธ์ที่เป็นระเบียบ',
    relatedChallenges: ['cs_002', 'ad_001'],
  },

  // ============ TONE PATTERNS ============
  {
    id: 'pattern_tone_match',
    text: 'Tone ต้องตรงกับ Target Audience และ Platform',
    category: 'tone',
    description: 'IG Story วัยรุ่น = สนุก emoji, Email formal = สุภาพ',
    example: 'Gen Z: "ปังมาก 🔥" vs Corporate: "ขอเรียนให้ทราบ"',
    relatedChallenges: ['sm_004', 'ad_001'],
  },
  {
    id: 'pattern_tone_specify',
    text: 'ระบุ Tone ไม่ให้ AI เดา',
    category: 'tone',
    description: 'ถ้าไม่ระบุ Tone AI จะใช้ default ที่อาจไม่ตรงใจ',
    relatedChallenges: ['em_001', 'cs_001'],
  },
  {
    id: 'pattern_tone_platform',
    text: 'แต่ละ Platform มี Tone ที่เหมาะสมต่างกัน',
    category: 'tone',
    description: 'LinkedIn = professional, Twitter = casual & witty, IG = visual & fun',
    relatedChallenges: ['sm_004', 'sm_005'],
  },

  // ============ EFFICIENCY PATTERNS ============
  {
    id: 'pattern_efficiency_concise',
    text: 'Prompt ที่ดีคือสั้นแต่ครบ - ไม่ต้องยาวก็ได้ผลดี',
    category: 'efficiency',
    description: 'Prompt สั้นที่มีข้อมูลครบได้ผลเท่ากับ prompt ยาว แต่ประหยัดกว่า',
    example: 'Short & complete > Long & redundant',
    relatedChallenges: ['sm_002'],
  },
  {
    id: 'pattern_efficiency_token',
    text: 'ยิ่ง Prompt ยาว ยิ่งเปลือง Token',
    category: 'efficiency',
    description: 'Token = ค่าใช้จ่าย ควรเขียนให้กระชับ',
    relatedChallenges: ['sm_002'],
  },
  {
    id: 'pattern_efficiency_redundant',
    text: 'ตัดข้อมูลซ้ำซ้อนออก ไม่ช่วยให้ Output ดีขึ้น',
    category: 'efficiency',
    description: 'การพูดซ้ำไม่ได้ทำให้ AI เข้าใจดีขึ้น แค่เปลือง Token',
    relatedChallenges: ['sm_002', 'em_002'],
  },
];

export const PATTERN_CATEGORY_INFO: Record<PatternCategory, { name: string; nameTh: string; color: string; icon: string }> = {
  role: { name: 'Role', nameTh: 'บทบาท', color: '#05F2F2', icon: '👤' },
  context: { name: 'Context', nameTh: 'บริบท', color: '#6593A6', icon: '📋' },
  format: { name: 'Format', nameTh: 'รูปแบบ', color: '#9333EA', icon: '📐' },
  tone: { name: 'Tone', nameTh: 'โทน', color: '#F27405', icon: '🎭' },
  efficiency: { name: 'Efficiency', nameTh: 'ประสิทธิภาพ', color: '#22C55E', icon: '⚡' },
};

// Get pattern by ID
export const getPatternById = (id: string): PatternData | undefined => {
  return ALL_PATTERNS.find(p => p.id === id);
};

// Get patterns by category
export const getPatternsByCategory = (category: PatternCategory): PatternData[] => {
  return ALL_PATTERNS.filter(p => p.category === category);
};

// Get pattern ID from text (for matching challenge patterns)
export const getPatternIdFromText = (text: string): string | undefined => {
  const pattern = ALL_PATTERNS.find(p => p.text === text);
  return pattern?.id;
};

// Count patterns by category
export const countPatternsByCategory = (): Record<PatternCategory, number> => {
  const counts: Record<PatternCategory, number> = {
    role: 0,
    context: 0,
    format: 0,
    tone: 0,
    efficiency: 0,
  };
  
  ALL_PATTERNS.forEach(p => {
    counts[p.category]++;
  });
  
  return counts;
};
