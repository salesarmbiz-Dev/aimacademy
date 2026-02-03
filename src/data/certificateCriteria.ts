export interface CertificateCriteria {
  minLevel?: number;
  minTotalXp?: number;
  minChallengesCompleted?: number;
  minAccuracy?: number;
  minSpotChallenges?: number;
  minSpotAccuracy?: number;
  minLegoChallenges?: number;
  minLegoAccuracy?: number;
}

export interface CertificateType {
  type: string;
  title: string;
  titleTh: string;
  description: string;
  icon: string;
  color: string;
  criteria: CertificateCriteria;
}

export const CERTIFICATE_CRITERIA: CertificateType[] = [
  {
    type: 'prompt_beginner',
    title: 'Prompt Beginner',
    titleTh: 'นักสร้าง Prompt ระดับเริ่มต้น',
    description: 'ผ่านการฝึกพื้นฐานด้าน AI Prompting',
    icon: '🌱',
    color: '#05F2F2',
    criteria: {
      minLevel: 3,
      minTotalXp: 500,
      minChallengesCompleted: 10
    }
  },
  {
    type: 'prompt_builder',
    title: 'Prompt Builder',
    titleTh: 'นักสร้าง Prompt ระดับกลาง',
    description: 'สามารถวิเคราะห์และสร้าง Prompt ได้อย่างมีประสิทธิภาพ',
    icon: '🔧',
    color: '#F27405',
    criteria: {
      minLevel: 7,
      minTotalXp: 2000,
      minChallengesCompleted: 30,
      minAccuracy: 70
    }
  },
  {
    type: 'prompt_pro',
    title: 'Prompt Professional',
    titleTh: 'นักสร้าง Prompt ระดับมืออาชีพ',
    description: 'เชี่ยวชาญการออกแบบ Prompt ในระดับสูง',
    icon: '🏆',
    color: '#FFD700',
    criteria: {
      minLevel: 12,
      minTotalXp: 5000,
      minChallengesCompleted: 50,
      minAccuracy: 85
    }
  },
  {
    type: 'spot_master',
    title: 'Spot the Difference Master',
    titleTh: 'ผู้เชี่ยวชาญการวิเคราะห์ Prompt',
    description: 'เชี่ยวชาญการจับความแตกต่างของ Prompt',
    icon: '🔍',
    color: '#05F2F2',
    criteria: {
      minSpotChallenges: 30,
      minSpotAccuracy: 80
    }
  },
  {
    type: 'lego_master',
    title: 'Prompt Lego Master',
    titleTh: 'ผู้เชี่ยวชาญการประกอบ Prompt',
    description: 'เชี่ยวชาญการสร้างและประกอบ Prompt',
    icon: '🧱',
    color: '#F27405',
    criteria: {
      minLegoChallenges: 30,
      minLegoAccuracy: 80
    }
  }
];

export const getCertificateByType = (type: string): CertificateType | undefined => {
  return CERTIFICATE_CRITERIA.find(cert => cert.type === type);
};

export const generateVerifyCode = (): string => {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase();
};

export const formatThaiDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543; // Convert to Buddhist Era
  return `${day} ${month} ${year}`;
};

export const formatShortThaiDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};
