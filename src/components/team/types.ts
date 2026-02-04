export interface TeamStats {
  totalMembers: number;
  completedMembers: number;
  activeThisWeek: number;
  averageImprovement: number;
}

export interface EngagementData {
  date: string;
  activeUsers: number;
}

export interface SkillAverage {
  skill: string;
  skillLabel: string;
  preTest: number;
  postTest: number;
}

export const SKILL_LABELS: Record<string, string> = {
  prompt_structure: 'โครงสร้าง Prompt',
  context_setting: 'การกำหนดบริบท',
  output_control: 'การควบคุมผลลัพธ์',
  role_assignment: 'การกำหนดบทบาท',
  chain_prompting: 'การเชื่อมต่อ Prompt',
  error_detection: 'การจับผิด Prompt',
};

// Mock data for demo
export const MOCK_MEMBERS = [
  {
    id: '1',
    display_name: 'สมชาย กองทอง',
    level: 8,
    pre_test_score: 65,
    post_test_score: 88,
    score_change: 23,
    last_active: new Date().toISOString(),
  },
  {
    id: '2',
    display_name: 'สมหญิง ขาวสะอาด',
    level: 6,
    pre_test_score: 70,
    post_test_score: 85,
    score_change: 15,
    last_active: new Date().toISOString(),
  },
  {
    id: '3',
    display_name: 'วิชัย คำแก้ว',
    level: 4,
    pre_test_score: 55,
    post_test_score: null,
    score_change: null,
    last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    display_name: 'มาลี ดอกไม้',
    level: 2,
    pre_test_score: null,
    post_test_score: null,
    score_change: null,
    last_active: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    display_name: 'ประยุทธ์ จันทร์ฉาย',
    level: 10,
    pre_test_score: 80,
    post_test_score: 95,
    score_change: 15,
    last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    display_name: 'นภา สายน้ำ',
    level: 5,
    pre_test_score: 60,
    post_test_score: 78,
    score_change: 18,
    last_active: new Date().toISOString(),
  },
  {
    id: '7',
    display_name: 'ธนา รุ่งเรือง',
    level: 3,
    pre_test_score: 45,
    post_test_score: null,
    score_change: null,
    last_active: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    display_name: 'จันทร์ แสงทอง',
    level: 7,
    pre_test_score: 72,
    post_test_score: 90,
    score_change: 18,
    last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_ENGAGEMENT_DATA: EngagementData[] = [
  { date: '28 ม.ค.', activeUsers: 12 },
  { date: '29 ม.ค.', activeUsers: 15 },
  { date: '30 ม.ค.', activeUsers: 18 },
  { date: '31 ม.ค.', activeUsers: 14 },
  { date: '1 ก.พ.', activeUsers: 20 },
  { date: '2 ก.พ.', activeUsers: 22 },
  { date: '3 ก.พ.', activeUsers: 18 },
];

export const MOCK_SKILL_AVERAGES: SkillAverage[] = [
  { skill: 'prompt_structure', skillLabel: 'โครงสร้าง', preTest: 65, postTest: 82 },
  { skill: 'context_setting', skillLabel: 'บริบท', preTest: 58, postTest: 75 },
  { skill: 'output_control', skillLabel: 'ผลลัพธ์', preTest: 70, postTest: 88 },
  { skill: 'role_assignment', skillLabel: 'บทบาท', preTest: 55, postTest: 72 },
  { skill: 'chain_prompting', skillLabel: 'Chain', preTest: 45, postTest: 68 },
  { skill: 'error_detection', skillLabel: 'จับผิด', preTest: 50, postTest: 70 },
];
