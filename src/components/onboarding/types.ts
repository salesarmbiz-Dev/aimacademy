export interface OnboardingData {
  displayName: string;
  jobTitle: string;
  jobTitleOther?: string;
  department?: string;
  aiExperienceLevel: number;
  selectedGoals: string[];
  preAssessmentSkipped: boolean;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const JOB_TITLES = [
  'เจ้าของธุรกิจ / CEO',
  'ผู้จัดการ / Manager',
  'HR / L&D',
  'Marketing',
  'IT / Developer',
  'พนักงานทั่วไป',
  'อื่นๆ',
] as const;

export const DEPARTMENTS = [
  'Management',
  'HR',
  'Marketing',
  'Sales',
  'IT',
  'Operations',
  'Finance',
  'อื่นๆ',
] as const;

export const AI_EXPERIENCE_LEVELS = [
  { level: 1, emoji: '🌱', label: 'เริ่มต้น', description: 'ไม่เคยใช้ AI เลย', color: 'bg-green-50 border-green-200' },
  { level: 2, emoji: '📱', label: 'รู้จัก', description: 'ใช้ ChatGPT บ้าง', color: 'bg-blue-50 border-blue-200' },
  { level: 3, emoji: '💡', label: 'ใช้ได้', description: 'ใช้ AI ในงานเป็นประจำ', color: 'bg-yellow-50 border-yellow-200' },
  { level: 4, emoji: '🔧', label: 'เชี่ยวชาญ', description: 'สร้าง prompt ซับซ้อนได้', color: 'bg-orange-50 border-orange-200' },
  { level: 5, emoji: '🚀', label: 'Pro', description: 'สอนคนอื่นใช้ AI ได้', color: 'bg-purple-50 border-purple-200' },
] as const;

export const LEARNING_GOALS = [
  { id: 'prompt-writing', emoji: '🎯', title: 'เขียน Prompt ได้เก่ง', description: 'สร้าง prompt ที่ได้ผลลัพธ์ตรงใจทุกครั้ง' },
  { id: 'content-creation', emoji: '📝', title: 'สร้าง Content ด้วย AI', description: 'เขียน content, social media, email ด้วย AI' },
  { id: 'sop-documents', emoji: '📋', title: 'สร้าง SOP/เอกสารองค์กร', description: 'ใช้ AI สร้าง SOP, workflow, process ที่ใช้งานจริง' },
  { id: 'ai-review', emoji: '🔍', title: 'ตรวจสอบ/แก้ไข AI Output', description: 'รู้จักจุดอ่อนของ AI และแก้ไขให้ถูกต้อง' },
  { id: 'ai-organization', emoji: '🏢', title: 'นำ AI มาใช้ในองค์กร', description: 'วางแผนและนำ AI มาใช้ในทีม/องค์กร' },
  { id: 'ai-governance', emoji: '🤖', title: 'เข้าใจ AI Governance', description: 'ใช้ AI อย่างปลอดภัย มีจริยธรรม' },
] as const;
