export type QuestionType = 'text' | 'textarea' | 'radio' | 'multiselect';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface SOPQuestion {
  id: string;
  question: string;
  helperText: string;
  type: QuestionType;
  placeholder?: string;
  options?: QuestionOption[];
  required: boolean;
  minLength?: number;
}

export interface TemplateQuestions {
  templateType: string;
  questions: SOPQuestion[];
}

// Shared questions used across all templates
const sharedQuestions = {
  companyName: {
    id: 'companyName',
    question: 'บริษัทของคุณชื่ออะไร?',
    helperText: 'ใช้ในหัวเรื่อง SOP',
    type: 'text' as QuestionType,
    placeholder: 'เช่น บริษัท ABC จำกัด',
    required: true,
    minLength: 2,
  },
  optionalRequirements: {
    id: 'specialRequirements',
    question: 'มีข้อกำหนดพิเศษไหม?',
    helperText: 'ข้อมูลเพิ่มเติมที่จะช่วยให้ SOP ตรงกับองค์กรของคุณ',
    type: 'textarea' as QuestionType,
    placeholder: 'เช่น ต้องผ่าน security training ก่อน, ต้อง sign NDA',
    required: false,
  },
};

export const sopQuestionsData: TemplateQuestions[] = [
  {
    templateType: 'onboarding',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'departments',
        question: 'แผนกที่รับพนักงานใหม่?',
        helperText: 'เลือกได้หลายแผนก',
        type: 'multiselect',
        options: [
          { value: 'all', label: 'ทุกแผนก' },
          { value: 'it', label: 'IT/Tech' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' },
          { value: 'operations', label: 'Operations' },
          { value: 'hr', label: 'HR' },
          { value: 'finance', label: 'Finance' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      {
        id: 'timeline',
        question: 'ขั้นตอนปัจจุบันมีกี่วันตั้งแต่เริ่มจนจบ?',
        helperText: 'เราจะออกแบบ timeline ให้เหมาะ',
        type: 'radio',
        options: [
          { value: '1-3days', label: '1-3 วัน' },
          { value: '1week', label: '1 สัปดาห์' },
          { value: '2weeks', label: '2 สัปดาห์' },
          { value: '1month', label: '1 เดือน' },
          { value: '3months', label: '3 เดือน (probation)' },
        ],
        required: true,
      },
      {
        id: 'responsiblePerson',
        question: 'ใครเป็นผู้รับผิดชอบหลัก?',
        helperText: 'ระบุตำแหน่ง ไม่ต้องใส่ชื่อจริง',
        type: 'text',
        placeholder: 'เช่น HR Manager, Team Lead',
        required: true,
      },
      {
        id: 'tools',
        question: 'เครื่องมือที่ใช้ในองค์กร?',
        helperText: 'SOP จะอ้างอิงเครื่องมือที่คุณใช้จริง',
        type: 'multiselect',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'line', label: 'LINE' },
          { value: 'slack', label: 'Slack' },
          { value: 'google', label: 'Google Workspace' },
          { value: 'microsoft', label: 'Microsoft 365' },
          { value: 'notion', label: 'Notion' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      {
        id: 'problems',
        question: 'ปัญหาที่เจอบ่อยที่สุดในกระบวนการปัจจุบัน?',
        helperText: 'AI จะออกแบบ SOP ที่แก้ปัญหาเหล่านี้โดยเฉพาะ',
        type: 'textarea',
        placeholder: 'เช่น พนักงานใหม่ไม่รู้ว่าต้องติดต่อใคร, ลืม setup tools',
        required: true,
        minLength: 10,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
  {
    templateType: 'customer-service',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'channels',
        question: 'ช่องทางรับเรื่อง?',
        helperText: 'เลือกช่องทางที่ลูกค้าติดต่อเข้ามา',
        type: 'multiselect',
        options: [
          { value: 'phone', label: 'โทรศัพท์' },
          { value: 'line', label: 'LINE' },
          { value: 'email', label: 'Email' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'chat', label: 'Chat' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      {
        id: 'sla',
        question: 'SLA เป้าหมาย?',
        helperText: 'ระยะเวลาที่ต้องตอบกลับลูกค้า',
        type: 'radio',
        options: [
          { value: '1hour', label: 'ภายใน 1 ชม.' },
          { value: '4hours', label: 'ภายใน 4 ชม.' },
          { value: '24hours', label: 'ภายใน 24 ชม.' },
          { value: '48hours', label: 'ภายใน 48 ชม.' },
        ],
        required: true,
      },
      {
        id: 'caseTypes',
        question: 'ประเภท case ที่พบบ่อย?',
        helperText: 'เลือกประเภทปัญหาที่ลูกค้ามักแจ้ง',
        type: 'multiselect',
        options: [
          { value: 'defect', label: 'สินค้าชำรุด' },
          { value: 'delay', label: 'ส่งล่าช้า' },
          { value: 'refund', label: 'คืนเงิน' },
          { value: 'inquiry', label: 'สอบถามข้อมูล' },
          { value: 'complaint', label: 'ร้องเรียน' },
        ],
        required: true,
      },
      {
        id: 'escalationLevels',
        question: 'ระดับ escalation?',
        helperText: 'จำนวนระดับการส่งต่อเรื่อง',
        type: 'radio',
        options: [
          { value: '2levels', label: '2 ระดับ' },
          { value: '3levels', label: '3 ระดับ' },
          { value: '4levels', label: '4 ระดับ' },
        ],
        required: true,
      },
      {
        id: 'responsiblePerson',
        question: 'ใครเป็นผู้รับผิดชอบหลัก?',
        helperText: 'ระบุตำแหน่ง ไม่ต้องใส่ชื่อจริง',
        type: 'text',
        placeholder: 'เช่น Customer Service Manager',
        required: true,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
  {
    templateType: 'content-approval',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'contentTypes',
        question: 'ประเภท content?',
        helperText: 'เลือกประเภท content ที่ต้อง approve',
        type: 'multiselect',
        options: [
          { value: 'blog', label: 'Blog' },
          { value: 'social', label: 'Social Media' },
          { value: 'email', label: 'Email' },
          { value: 'press', label: 'Press Release' },
          { value: 'ad', label: 'Ad Creative' },
          { value: 'video', label: 'Video' },
        ],
        required: true,
      },
      {
        id: 'contentCreator',
        question: 'ใครเป็นคนสร้าง content?',
        helperText: 'ระบุตำแหน่งผู้สร้าง content',
        type: 'text',
        placeholder: 'เช่น Content Writer, Marketing Team',
        required: true,
      },
      {
        id: 'reviewer',
        question: 'ใครเป็น reviewer?',
        helperText: 'ระบุตำแหน่งผู้ตรวจสอบ',
        type: 'text',
        placeholder: 'เช่น Marketing Manager, Brand Manager',
        required: true,
      },
      {
        id: 'reviewTimeline',
        question: 'ใช้เวลา review กี่วัน?',
        helperText: 'ระยะเวลาในการ review content',
        type: 'radio',
        options: [
          { value: '1day', label: '1 วัน' },
          { value: '2-3days', label: '2-3 วัน' },
          { value: '1week', label: '1 สัปดาห์' },
        ],
        required: true,
      },
      {
        id: 'tools',
        question: 'เครื่องมือที่ใช้จัดการ content?',
        helperText: 'SOP จะอ้างอิงเครื่องมือที่คุณใช้จริง',
        type: 'multiselect',
        options: [
          { value: 'google', label: 'Google Docs' },
          { value: 'notion', label: 'Notion' },
          { value: 'canva', label: 'Canva' },
          { value: 'figma', label: 'Figma' },
          { value: 'trello', label: 'Trello' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
  {
    templateType: 'change-management',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'changeTypes',
        question: 'ประเภทการเปลี่ยนแปลง?',
        helperText: 'เลือกประเภทการเปลี่ยนแปลงที่เกี่ยวข้อง',
        type: 'multiselect',
        options: [
          { value: 'it', label: 'ระบบ IT' },
          { value: 'process', label: 'กระบวนการทำงาน' },
          { value: 'structure', label: 'โครงสร้างองค์กร' },
          { value: 'policy', label: 'นโยบาย' },
        ],
        required: true,
      },
      {
        id: 'impactSize',
        question: 'ขนาดผลกระทบ?',
        helperText: 'จำนวนคนที่ได้รับผลกระทบ',
        type: 'radio',
        options: [
          { value: 'team', label: 'ทีมเดียว' },
          { value: 'multiple', label: 'หลายทีม' },
          { value: 'organization', label: 'ทั้งองค์กร' },
        ],
        required: true,
      },
      {
        id: 'communicationChannels',
        question: 'ช่องทางสื่อสาร?',
        helperText: 'เลือกช่องทางที่ใช้สื่อสารการเปลี่ยนแปลง',
        type: 'multiselect',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'townhall', label: 'Town Hall' },
          { value: 'line', label: 'LINE Group' },
          { value: 'intranet', label: 'Intranet' },
          { value: '1on1', label: '1-on-1' },
        ],
        required: true,
      },
      {
        id: 'responsiblePerson',
        question: 'ใครเป็นผู้รับผิดชอบหลัก?',
        helperText: 'ระบุตำแหน่ง ไม่ต้องใส่ชื่อจริง',
        type: 'text',
        placeholder: 'เช่น Project Manager, Change Lead',
        required: true,
      },
      {
        id: 'timeline',
        question: 'ระยะเวลาการเปลี่ยนแปลง?',
        helperText: 'ระยะเวลาตั้งแต่เริ่มจนเสร็จ',
        type: 'radio',
        options: [
          { value: '1week', label: '1 สัปดาห์' },
          { value: '1month', label: '1 เดือน' },
          { value: '3months', label: '3 เดือน' },
          { value: '6months', label: '6 เดือน+' },
        ],
        required: true,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
  {
    templateType: 'data-security',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'sensitiveData',
        question: 'ประเภทข้อมูลที่ sensitive?',
        helperText: 'เลือกประเภทข้อมูลที่ต้องปกป้อง',
        type: 'multiselect',
        options: [
          { value: 'customer', label: 'ข้อมูลลูกค้า' },
          { value: 'financial', label: 'ข้อมูลการเงิน' },
          { value: 'employee', label: 'ข้อมูลพนักงาน' },
          { value: 'ip', label: 'IP/ความลับทางการค้า' },
        ],
        required: true,
      },
      {
        id: 'itTeamSize',
        question: 'มี IT team กี่คน?',
        helperText: 'ขนาดทีม IT ที่รับผิดชอบ',
        type: 'radio',
        options: [
          { value: '1-3', label: '1-3 คน' },
          { value: '4-10', label: '4-10 คน' },
          { value: '10+', label: '10+ คน' },
        ],
        required: true,
      },
      {
        id: 'compliance',
        question: 'ต้อง comply กฏหมายอะไร?',
        helperText: 'เลือกข้อกำหนดที่เกี่ยวข้อง',
        type: 'multiselect',
        options: [
          { value: 'pdpa', label: 'PDPA' },
          { value: 'iso27001', label: 'ISO 27001' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      {
        id: 'responsiblePerson',
        question: 'ใครเป็นผู้รับผิดชอบหลัก?',
        helperText: 'ระบุตำแหน่ง ไม่ต้องใส่ชื่อจริง',
        type: 'text',
        placeholder: 'เช่น IT Manager, Security Officer',
        required: true,
      },
      {
        id: 'tools',
        question: 'ระบบ security ที่ใช้?',
        helperText: 'SOP จะอ้างอิงเครื่องมือที่คุณใช้จริง',
        type: 'multiselect',
        options: [
          { value: 'firewall', label: 'Firewall' },
          { value: 'antivirus', label: 'Antivirus' },
          { value: 'backup', label: 'Backup System' },
          { value: 'monitoring', label: 'Monitoring' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
  {
    templateType: 'performance-review',
    questions: [
      sharedQuestions.companyName,
      {
        id: 'frequency',
        question: 'ความถี่การประเมิน?',
        helperText: 'รอบการประเมินผลงาน',
        type: 'radio',
        options: [
          { value: 'quarterly', label: 'ทุก 3 เดือน' },
          { value: 'biannual', label: '6 เดือน' },
          { value: 'annual', label: 'ปีละครั้ง' },
        ],
        required: true,
      },
      {
        id: 'methods',
        question: 'วิธีประเมิน?',
        helperText: 'เลือกวิธีที่ใช้ในการประเมิน',
        type: 'multiselect',
        options: [
          { value: 'self', label: 'Self-evaluation' },
          { value: 'manager', label: 'Manager review' },
          { value: 'peer', label: 'Peer review' },
          { value: '360', label: '360-degree' },
        ],
        required: true,
      },
      {
        id: 'metrics',
        question: 'ใช้ KPIs/OKRs?',
        helperText: 'ระบบวัดผลที่ใช้',
        type: 'radio',
        options: [
          { value: 'kpis', label: 'KPIs' },
          { value: 'okrs', label: 'OKRs' },
          { value: 'both', label: 'ทั้งคู่' },
          { value: 'none', label: 'ไม่ใช้' },
        ],
        required: true,
      },
      {
        id: 'bonusLink',
        question: 'เชื่อมกับ bonus?',
        helperText: 'ผลประเมินเชื่อมโยงกับโบนัสหรือไม่',
        type: 'radio',
        options: [
          { value: 'yes', label: 'ใช่' },
          { value: 'no', label: 'ไม่' },
          { value: 'partial', label: 'บางส่วน' },
        ],
        required: true,
      },
      {
        id: 'responsiblePerson',
        question: 'ใครเป็นผู้รับผิดชอบหลัก?',
        helperText: 'ระบุตำแหน่ง ไม่ต้องใส่ชื่อจริง',
        type: 'text',
        placeholder: 'เช่น HR Manager, Department Head',
        required: true,
      },
      {
        id: 'tools',
        question: 'เครื่องมือที่ใช้จัดการประเมิน?',
        helperText: 'SOP จะอ้างอิงเครื่องมือที่คุณใช้จริง',
        type: 'multiselect',
        options: [
          { value: 'excel', label: 'Excel/Sheets' },
          { value: 'hris', label: 'HRIS System' },
          { value: 'form', label: 'Google Forms' },
          { value: 'other', label: 'อื่นๆ' },
        ],
        required: true,
      },
      sharedQuestions.optionalRequirements,
    ],
  },
];

export const getQuestionsForTemplate = (templateType: string): SOPQuestion[] => {
  const template = sopQuestionsData.find(t => t.templateType === templateType);
  return template?.questions || [];
};
