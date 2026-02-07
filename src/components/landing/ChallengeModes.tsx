import React from 'react';
import { Minimize2, TrendingUp, Wrench, Building2 } from 'lucide-react';

const challenges = [
  {
    icon: Minimize2,
    title: 'Minimize',
    description: 'ลบ Block ให้เหลือน้อยที่สุด แต่ยังได้ผลลัพธ์ดี',
    challenge: 'ลดเหลือ 3 Blocks แต่ได้ Score 80+',
    borderColor: 'border-border/30 hover:border-turquoise/40',
    iconColor: 'text-turquoise',
    titleColor: 'text-foreground',
  },
  {
    icon: TrendingUp,
    title: 'Maximize',
    description: 'เพิ่ม Block เพื่อดันคะแนนจาก 70 ให้ถึง 90+',
    challenge: 'เพิ่ม Blocks เพื่อ Score 95+',
    borderColor: 'border-border/30 hover:border-tennessee/40',
    iconColor: 'text-tennessee',
    titleColor: 'text-foreground',
  },
  {
    icon: Wrench,
    title: 'Fix',
    description: 'แก้ไข Prompt ที่มี Block ผิดหรือขาดหายไป',
    challenge: 'หา Block ที่ผิดและแก้ไข',
    borderColor: 'border-border/30 hover:border-turquoise/40',
    iconColor: 'text-turquoise',
    titleColor: 'text-foreground',
  },
  {
    icon: Building2,
    title: 'Build',
    description: 'สร้าง Prompt ใหม่จากศูนย์ด้วย Library ที่มีให้',
    challenge: 'ประกอบ Prompt ให้ได้ Score 85+',
    borderColor: 'border-border/30 hover:border-tennessee/40',
    iconColor: 'text-tennessee',
    titleColor: 'text-foreground',
  },
];

const ChallengeModes: React.FC = () => {
  return (
    <section className="bg-root-beer py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">Challenge Modes</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">
            4 โหมดท้าทาย ฝึกทักษะรอบด้าน
          </h2>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.title}
              className={`bg-oxford-blue border ${challenge.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-lg group`}
            >
              <challenge.icon className={`h-10 w-10 ${challenge.iconColor} mb-4`} />
              <h3 className={`${challenge.titleColor} font-bold text-2xl mb-2`}>{challenge.title}</h3>
              <p className="text-muted-foreground mb-4">{challenge.description}</p>
              <p className="text-foreground text-sm bg-root-beer/50 inline-block px-4 py-2 rounded-lg">
                {challenge.challenge}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengeModes;
