export interface SOPTemplate {
  id: string;
  type: string;
  icon: string;
  title: string;
  titleTh: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  recommended?: boolean;
}

export interface SOPSection {
  title: string;
  content?: string;
  steps?: SOPStep[];
  items?: string[];
}

export interface SOPStep {
  step: string;
  tasks: string[];
  responsible: string;
  timeline: string;
}

export interface GeneratedSOP {
  title: string;
  version: string;
  effectiveDate: string;
  department: string;
  owner: string;
  sections: SOPSection[];
}

export const sopTemplates: SOPTemplate[] = [
  {
    id: 'onboarding',
    type: 'onboarding',
    icon: '🏢',
    title: 'Employee Onboarding SOP',
    titleTh: 'กระบวนการรับพนักงานใหม่',
    description: 'กระบวนการรับพนักงานใหม่ ตั้งแต่วันแรกจนครบ probation',
    difficulty: 'Easy',
    estimatedTime: '15 นาที',
    recommended: true,
  },
  {
    id: 'customer-service',
    type: 'customer-service',
    icon: '📞',
    title: 'Customer Service Response SOP',
    titleTh: 'ขั้นตอนตอบลูกค้า',
    description: 'ขั้นตอนตอบลูกค้าตั้งแต่รับเรื่องจนปิด case',
    difficulty: 'Easy',
    estimatedTime: '15 นาที',
  },
  {
    id: 'content-approval',
    type: 'content-approval',
    icon: '📝',
    title: 'Content Approval SOP',
    titleTh: 'กระบวนการ Approve Content',
    description: 'กระบวนการ review และ approve content ก่อนเผยแพร่',
    difficulty: 'Medium',
    estimatedTime: '20 นาที',
  },
  {
    id: 'change-management',
    type: 'change-management',
    icon: '🔄',
    title: 'Change Management SOP',
    titleTh: 'ขั้นตอนจัดการการเปลี่ยนแปลง',
    description: 'ขั้นตอนจัดการการเปลี่ยนแปลงในองค์กร',
    difficulty: 'Medium',
    estimatedTime: '20 นาที',
  },
  {
    id: 'data-security',
    type: 'data-security',
    icon: '🛡️',
    title: 'Data Security Incident SOP',
    titleTh: 'ขั้นตอนรับมือเหตุละเมิดข้อมูล',
    description: 'ขั้นตอนรับมือเหตุละเมิดข้อมูล',
    difficulty: 'Hard',
    estimatedTime: '25 นาที',
  },
  {
    id: 'performance-review',
    type: 'performance-review',
    icon: '🎯',
    title: 'Performance Review SOP',
    titleTh: 'กระบวนการประเมินผลงาน',
    description: 'กระบวนการประเมินผลงานรายปี',
    difficulty: 'Hard',
    estimatedTime: '25 นาที',
  },
];

// Template generator functions for each SOP type
export const generateSOPFromInputs = (
  templateType: string,
  inputs: Record<string, any>
): GeneratedSOP => {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const companyName = inputs.companyName || 'บริษัทของคุณ';
  const departments = Array.isArray(inputs.departments)
    ? inputs.departments.join(', ')
    : inputs.departments || 'ทุกแผนก';
  const responsiblePerson = inputs.responsiblePerson || 'ผู้รับผิดชอบ';
  const tools = Array.isArray(inputs.tools)
    ? inputs.tools.join(', ')
    : inputs.tools || '';
  const problems = inputs.problems || '';
  const timeline = inputs.timeline || '3 เดือน';

  const generators: Record<string, () => GeneratedSOP> = {
    onboarding: () => generateOnboardingSOP(companyName, departments, responsiblePerson, tools, problems, timeline, inputs),
    'customer-service': () => generateCustomerServiceSOP(companyName, inputs),
    'content-approval': () => generateContentApprovalSOP(companyName, inputs),
    'change-management': () => generateChangeManagementSOP(companyName, inputs),
    'data-security': () => generateDataSecuritySOP(companyName, inputs),
    'performance-review': () => generatePerformanceReviewSOP(companyName, inputs),
  };

  const generator = generators[templateType];
  if (!generator) {
    return {
      title: `SOP: ${templateType} — ${companyName}`,
      version: '1.0',
      effectiveDate: today,
      department: departments,
      owner: responsiblePerson,
      sections: [],
    };
  }

  return generator();
};

function generateOnboardingSOP(
  companyName: string,
  departments: string,
  responsiblePerson: string,
  tools: string,
  problems: string,
  timeline: string,
  inputs: Record<string, any>
): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timelineMap: Record<string, string> = {
    '1-3days': '1-3 วัน',
    '1week': '1 สัปดาห์',
    '2weeks': '2 สัปดาห์',
    '1month': '1 เดือน',
    '3months': '3 เดือน (Probation)',
  };

  const displayTimeline = timelineMap[timeline] || timeline;

  return {
    title: `SOP: กระบวนการรับพนักงานใหม่ — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: departments,
    owner: responsiblePerson,
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดขั้นตอนมาตรฐานสำหรับการรับพนักงานใหม่เข้า ${departments} ของ ${companyName} เพื่อให้กระบวนการเป็นระบบ สม่ำเสมอ และช่วยลดปัญหา${problems ? ` เช่น ${problems}` : 'ที่อาจเกิดขึ้น'}`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุมตั้งแต่วันที่พนักงานใหม่เริ่มงานจนถึง ${displayTimeline} โดยมี ${responsiblePerson} เป็นผู้รับผิดชอบหลัก`,
      },
      {
        title: '3. เครื่องมือที่ใช้',
        content: `${tools || 'Email, LINE, Google Workspace'} — แนะนำให้ setup ทุกเครื่องมือก่อนวันเริ่มงาน`,
      },
      {
        title: '4. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '4.1 ก่อนวันเริ่มงาน (Pre-boarding)',
            tasks: [
              'เตรียมอุปกรณ์และ workstation',
              'สร้าง account ใน ' + (tools || 'ระบบต่างๆ'),
              'ส่ง welcome email พร้อมข้อมูลเบื้องต้น',
              'แจ้งทีมเรื่องพนักงานใหม่',
            ],
            responsible: 'HR',
            timeline: '3 วันก่อน',
          },
          {
            step: '4.2 วันแรก (Day 1)',
            tasks: [
              'ต้อนรับและแนะนำทีม',
              'พาเยี่ยมชมสำนักงาน',
              'ทำเอกสาร HR',
              'Setup เครื่องมือและ access',
              'อธิบาย culture และ values',
            ],
            responsible: 'HR + Team Lead',
            timeline: 'วันแรก',
          },
          {
            step: '4.3 สัปดาห์แรก (Week 1)',
            tasks: [
              'Training เครื่องมือและระบบ',
              'แนะนำ workflow หลัก',
              'มอบหมายงาน buddy/mentor',
              'Check-in รายวัน',
            ],
            responsible: 'Team Lead',
            timeline: 'สัปดาห์ 1',
          },
          {
            step: '4.4 เดือนแรก (Month 1)',
            tasks: [
              'มอบหมายโปรเจกต์แรก',
              'Feedback session',
              'ทบทวนความเข้าใจ process',
              '1-on-1 กับ manager',
            ],
            responsible: 'Team Lead + Manager',
            timeline: 'เดือน 1',
          },
          {
            step: '4.5 ประเมินผล (Review)',
            tasks: [
              'ประเมินผล probation',
              'ทบทวนเป้าหมายและ expectations',
              'วางแผนพัฒนาต่อเนื่อง',
              'ยืนยันการผ่าน probation',
            ],
            responsible: 'Manager',
            timeline: displayTimeline,
          },
        ],
      },
      {
        title: '5. Checklist พนักงานใหม่',
        items: [
          '☐ อุปกรณ์และ workstation พร้อม',
          '☐ Account ระบบต่างๆ ถูกสร้างแล้ว',
          '☐ Welcome email ถูกส่งแล้ว',
          '☐ เอกสาร HR ครบถ้วน',
          '☐ ผ่าน orientation training',
          '☐ มี buddy/mentor assigned',
          '☐ เข้าร่วม team meeting แรก',
          '☐ ผ่านการประเมิน probation',
        ],
      },
      {
        title: '6. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${responsiblePerson}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

function generateCustomerServiceSOP(companyName: string, inputs: Record<string, any>): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const channels = Array.isArray(inputs.channels) ? inputs.channels.join(', ') : 'โทรศัพท์, LINE, Email';
  const caseTypes = Array.isArray(inputs.caseTypes) ? inputs.caseTypes.join(', ') : 'สอบถามข้อมูล';
  const slaMap: Record<string, string> = {
    '1hour': '1 ชั่วโมง',
    '4hours': '4 ชั่วโมง',
    '24hours': '24 ชั่วโมง',
    '48hours': '48 ชั่วโมง',
  };
  const sla = slaMap[inputs.sla] || '24 ชั่วโมง';

  return {
    title: `SOP: การตอบลูกค้า — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: 'Customer Service',
    owner: inputs.responsiblePerson || 'CS Manager',
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดมาตรฐานการตอบลูกค้าของ ${companyName} ผ่านช่องทาง ${channels} เพื่อให้บริการที่สม่ำเสมอและมีคุณภาพ ตอบกลับภายใน ${sla}`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุมการจัดการ case ประเภท: ${caseTypes} ตั้งแต่รับเรื่องจนปิด case`,
      },
      {
        title: '3. SLA และมาตรฐาน',
        content: `• First Response: ภายใน ${sla}\n• Resolution Time: ขึ้นอยู่กับประเภท case\n• Customer Satisfaction Target: ≥ 90%`,
      },
      {
        title: '4. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '4.1 รับเรื่อง',
            tasks: [
              'รับเรื่องผ่านช่องทางที่กำหนด',
              'บันทึกข้อมูลลูกค้าและปัญหา',
              'กำหนดประเภท case',
              'ส่ง auto-reply ยืนยันการรับเรื่อง',
            ],
            responsible: 'CS Team',
            timeline: 'ทันที',
          },
          {
            step: '4.2 วิเคราะห์และจัดลำดับ',
            tasks: [
              'วิเคราะห์ความเร่งด่วน',
              'ตรวจสอบ case history',
              'assign ให้ผู้รับผิดชอบ',
              'กำหนด expected resolution time',
            ],
            responsible: 'CS Lead',
            timeline: '15 นาที',
          },
          {
            step: '4.3 ดำเนินการแก้ไข',
            tasks: [
              'ติดต่อลูกค้าเพื่อสอบถามรายละเอียด',
              'ดำเนินการแก้ไขตาม procedure',
              'Escalate หากเกินขอบเขต',
              'Update status ใน system',
            ],
            responsible: 'CS Team',
            timeline: 'ตาม SLA',
          },
          {
            step: '4.4 ปิด Case',
            tasks: [
              'แจ้งผลการแก้ไขให้ลูกค้า',
              'ยืนยันความพึงพอใจ',
              'บันทึก case summary',
              'ปิด case ใน system',
            ],
            responsible: 'CS Team',
            timeline: 'หลังแก้ไขเสร็จ',
          },
        ],
      },
      {
        title: '5. Escalation Matrix',
        content: `ระดับ 1: CS Team → ระดับ 2: CS Lead → ระดับ 3: CS Manager → ระดับ 4: Management`,
      },
      {
        title: '6. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${inputs.responsiblePerson || 'CS Manager'}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

function generateContentApprovalSOP(companyName: string, inputs: Record<string, any>): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const contentTypes = Array.isArray(inputs.contentTypes) ? inputs.contentTypes.join(', ') : 'Blog, Social Media';
  const tools = Array.isArray(inputs.tools) ? inputs.tools.join(', ') : 'Google Docs';
  const timelineMap: Record<string, string> = {
    '1day': '1 วัน',
    '2-3days': '2-3 วัน',
    '1week': '1 สัปดาห์',
  };
  const reviewTime = timelineMap[inputs.reviewTimeline] || '2-3 วัน';

  return {
    title: `SOP: Content Approval — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: 'Marketing',
    owner: inputs.reviewer || 'Marketing Manager',
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดกระบวนการ review และ approve content ของ ${companyName} ประเภท ${contentTypes} เพื่อให้มี quality control ที่สม่ำเสมอ`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุม content ทุกประเภทที่เผยแพร่ภายนอก โดยใช้เวลา review ${reviewTime}`,
      },
      {
        title: '3. เครื่องมือที่ใช้',
        content: tools,
      },
      {
        title: '4. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '4.1 สร้าง Content',
            tasks: [
              'Draft content ตาม brief',
              'ตรวจสอบความถูกต้อง',
              'เตรียม visual assets',
              'Submit เข้าระบบ review',
            ],
            responsible: inputs.contentCreator || 'Content Writer',
            timeline: 'ตาม plan',
          },
          {
            step: '4.2 Review รอบแรก',
            tasks: [
              'ตรวจสอบความถูกต้องของเนื้อหา',
              'ตรวจ grammar และ style',
              'ให้ feedback',
              'Request revision หากจำเป็น',
            ],
            responsible: inputs.reviewer || 'Marketing Manager',
            timeline: reviewTime,
          },
          {
            step: '4.3 แก้ไขและ Final Review',
            tasks: [
              'แก้ไขตาม feedback',
              'Submit revision',
              'Final check',
              'Approve หรือ reject',
            ],
            responsible: inputs.reviewer || 'Marketing Manager',
            timeline: '1 วัน',
          },
          {
            step: '4.4 เผยแพร่',
            tasks: [
              'Schedule หรือ publish content',
              'แจ้งทีมที่เกี่ยวข้อง',
              'Monitor engagement',
              'Archive ใน content library',
            ],
            responsible: inputs.contentCreator || 'Content Writer',
            timeline: 'ตาม schedule',
          },
        ],
      },
      {
        title: '5. Checklist การ Review',
        items: [
          '☐ ข้อมูลถูกต้อง factually',
          '☐ ตรง brand voice และ tone',
          '☐ ไม่มี typo หรือ grammar error',
          '☐ Visual ตรง brand guideline',
          '☐ CTA ชัดเจน',
          '☐ ไม่ละเมิดลิขสิทธิ์',
        ],
      },
      {
        title: '6. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${inputs.reviewer || 'Marketing Manager'}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

function generateChangeManagementSOP(companyName: string, inputs: Record<string, any>): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const changeTypes = Array.isArray(inputs.changeTypes) ? inputs.changeTypes.join(', ') : 'กระบวนการทำงาน';
  const channels = Array.isArray(inputs.communicationChannels) ? inputs.communicationChannels.join(', ') : 'Email';
  const impactMap: Record<string, string> = {
    'team': 'ทีมเดียว',
    'multiple': 'หลายทีม',
    'organization': 'ทั้งองค์กร',
  };
  const impact = impactMap[inputs.impactSize] || 'หลายทีม';

  return {
    title: `SOP: Change Management — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: 'Organization',
    owner: inputs.responsiblePerson || 'Project Manager',
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดกระบวนการจัดการการเปลี่ยนแปลงประเภท ${changeTypes} ใน ${companyName} ที่กระทบ ${impact} เพื่อให้การเปลี่ยนผ่านราบรื่น`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุมการเปลี่ยนแปลงที่มีผลกระทบต่อ ${impact} โดยใช้ช่องทางสื่อสาร: ${channels}`,
      },
      {
        title: '3. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '3.1 วิเคราะห์และวางแผน',
            tasks: [
              'ระบุ scope และผลกระทบ',
              'ประเมิน stakeholders',
              'วางแผน timeline',
              'เตรียม resources',
            ],
            responsible: inputs.responsiblePerson || 'Project Manager',
            timeline: 'สัปดาห์ 1',
          },
          {
            step: '3.2 สื่อสารเบื้องต้น',
            tasks: [
              'แจ้ง leadership team',
              'สื่อสารกับ stakeholders หลัก',
              'ชี้แจงเหตุผลและประโยชน์',
              'รับ feedback เบื้องต้น',
            ],
            responsible: inputs.responsiblePerson || 'Project Manager',
            timeline: 'สัปดาห์ 2',
          },
          {
            step: '3.3 ดำเนินการเปลี่ยนแปลง',
            tasks: [
              'Implement ตาม plan',
              'จัด training ถ้าจำเป็น',
              'Support ผู้ได้รับผลกระทบ',
              'Monitor และแก้ปัญหา',
            ],
            responsible: 'ทีมที่เกี่ยวข้อง',
            timeline: 'ตาม plan',
          },
          {
            step: '3.4 ติดตามผลและปิด',
            tasks: [
              'ประเมินผลการเปลี่ยนแปลง',
              'รวบรวม lessons learned',
              'ปรับปรุง documentation',
              'ปิดโครงการ',
            ],
            responsible: inputs.responsiblePerson || 'Project Manager',
            timeline: 'หลัง go-live 1 เดือน',
          },
        ],
      },
      {
        title: '4. Communication Plan',
        content: `ช่องทางสื่อสาร: ${channels}\nความถี่: รายสัปดาห์\nกลุ่มเป้าหมาย: ${impact}`,
      },
      {
        title: '5. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${inputs.responsiblePerson || 'Project Manager'}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

function generateDataSecuritySOP(companyName: string, inputs: Record<string, any>): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sensitiveData = Array.isArray(inputs.sensitiveData) ? inputs.sensitiveData.join(', ') : 'ข้อมูลลูกค้า';
  const compliance = Array.isArray(inputs.compliance) ? inputs.compliance.join(', ') : 'PDPA';
  const tools = Array.isArray(inputs.tools) ? inputs.tools.join(', ') : 'Firewall, Antivirus';

  return {
    title: `SOP: Data Security Incident Response — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: 'IT Security',
    owner: inputs.responsiblePerson || 'IT Manager',
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดขั้นตอนรับมือเหตุละเมิดข้อมูล ${sensitiveData} ของ ${companyName} เพื่อให้สอดคล้องกับ ${compliance}`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุมเหตุการณ์ที่เกี่ยวข้องกับ ${sensitiveData} โดยใช้เครื่องมือ: ${tools}`,
      },
      {
        title: '3. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '3.1 ตรวจพบและแจ้งเตือน',
            tasks: [
              'ตรวจพบเหตุการณ์ผิดปกติ',
              'บันทึกรายละเอียดเบื้องต้น',
              'แจ้ง IT Security ทันที',
              'เริ่ม incident log',
            ],
            responsible: 'ผู้พบเหตุ',
            timeline: 'ทันที',
          },
          {
            step: '3.2 ประเมินและจำกัดผลกระทบ',
            tasks: [
              'ประเมินความรุนแรง',
              'Isolate ระบบที่ได้รับผลกระทบ',
              'Preserve evidence',
              'แจ้ง management',
            ],
            responsible: inputs.responsiblePerson || 'IT Manager',
            timeline: '1 ชั่วโมง',
          },
          {
            step: '3.3 แก้ไขและกู้คืน',
            tasks: [
              'ระบุ root cause',
              'ดำเนินการแก้ไข',
              'Restore ระบบ',
              'Verify ความปลอดภัย',
            ],
            responsible: 'IT Team',
            timeline: 'ตามความรุนแรง',
          },
          {
            step: '3.4 รายงานและปรับปรุง',
            tasks: [
              'จัดทำ incident report',
              'แจ้งหน่วยงานกำกับ (ถ้าจำเป็น)',
              'แจ้ง affected parties',
              'ปรับปรุง security measures',
            ],
            responsible: inputs.responsiblePerson || 'IT Manager',
            timeline: '72 ชั่วโมง',
          },
        ],
      },
      {
        title: '4. Contact List',
        content: `IT Security: ${inputs.responsiblePerson || 'IT Manager'}\nManagement: [ระบุ]\nLegal: [ระบุ]\nRegulator: ${compliance === 'PDPA' ? 'สคส.' : '[ระบุ]'}`,
      },
      {
        title: '5. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${inputs.responsiblePerson || 'IT Manager'}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

function generatePerformanceReviewSOP(companyName: string, inputs: Record<string, any>): GeneratedSOP {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const methods = Array.isArray(inputs.methods) ? inputs.methods.join(', ') : 'Self-evaluation, Manager review';
  const tools = Array.isArray(inputs.tools) ? inputs.tools.join(', ') : 'Excel/Sheets';
  const frequencyMap: Record<string, string> = {
    'quarterly': 'ทุก 3 เดือน',
    'biannual': 'ทุก 6 เดือน',
    'annual': 'ปีละครั้ง',
  };
  const frequency = frequencyMap[inputs.frequency] || 'ปีละครั้ง';
  const metricsMap: Record<string, string> = {
    'kpis': 'KPIs',
    'okrs': 'OKRs',
    'both': 'KPIs และ OKRs',
    'none': 'ไม่มีระบบวัดผลเฉพาะ',
  };
  const metrics = metricsMap[inputs.metrics] || 'KPIs';

  return {
    title: `SOP: Performance Review — ${companyName}`,
    version: '1.0',
    effectiveDate: today,
    department: 'HR',
    owner: inputs.responsiblePerson || 'HR Manager',
    sections: [
      {
        title: '1. วัตถุประสงค์',
        content: `กำหนดกระบวนการประเมินผลงาน ${frequency} ของ ${companyName} โดยใช้วิธี ${methods} และวัดผลด้วย ${metrics}`,
      },
      {
        title: '2. ขอบเขต',
        content: `SOP นี้ครอบคลุมพนักงานทุกระดับ โดยผลประเมิน${inputs.bonusLink === 'yes' ? 'เชื่อมโยงกับโบนัส' : inputs.bonusLink === 'partial' ? 'เชื่อมโยงกับโบนัสบางส่วน' : 'ไม่เชื่อมโยงกับโบนัส'}`,
      },
      {
        title: '3. เครื่องมือที่ใช้',
        content: tools,
      },
      {
        title: '4. ขั้นตอนปฏิบัติ',
        steps: [
          {
            step: '4.1 เตรียมการ',
            tasks: [
              'ประกาศรอบการประเมิน',
              'เตรียม form และ template',
              'ทบทวน ${metrics} ที่กำหนด',
              'กำหนด deadline',
            ],
            responsible: 'HR',
            timeline: '2 สัปดาห์ก่อน',
          },
          {
            step: '4.2 Self-Evaluation',
            tasks: [
              'พนักงานประเมินตนเอง',
              'รวบรวมผลงาน/หลักฐาน',
              'กรอก form ประเมิน',
              'Submit ให้ manager',
            ],
            responsible: 'พนักงาน',
            timeline: '1 สัปดาห์',
          },
          {
            step: '4.3 Manager Review',
            tasks: [
              'Review self-evaluation',
              'ประเมินผลงานจริง',
              'เตรียม feedback',
              'นัด 1-on-1 meeting',
            ],
            responsible: 'Manager',
            timeline: '1 สัปดาห์',
          },
          {
            step: '4.4 Feedback Session',
            tasks: [
              'จัด 1-on-1 meeting',
              'แชร์ feedback',
              'กำหนดเป้าหมายใหม่',
              'Finalize rating',
            ],
            responsible: 'Manager',
            timeline: '1 สัปดาห์',
          },
        ],
      },
      {
        title: '5. Rating Scale',
        content: `5 = ดีเยี่ยม (Exceeds Expectations)\n4 = ดี (Above Expectations)\n3 = ตามเป้า (Meets Expectations)\n2 = ต้องปรับปรุง (Below Expectations)\n1 = ไม่ผ่าน (Unsatisfactory)`,
      },
      {
        title: '6. ผู้อนุมัติ',
        content: `จัดทำโดย: AI + ${inputs.responsiblePerson || 'HR Manager'}\nอนุมัติโดย: ____________\nวันที่: ____________`,
      },
    ],
  };
}

export const getTemplateById = (id: string): SOPTemplate | undefined => {
  return sopTemplates.find(t => t.id === id);
};
