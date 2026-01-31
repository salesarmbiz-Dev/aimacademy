import React from 'react';
import { Minimize2, TrendingUp, Wrench, Building2 } from 'lucide-react';

const challenges = [
  {
    icon: Minimize2,
    title: 'Minimize',
    description: 'ลบ Block ให้เหลือน้อยที่สุด แต่ยังได้ผลลัพธ์ดี',
    challenge: 'ลดเหลือ 3 Blocks แต่ได้ Score 80+',
    color: 'turquoise',
    borderColor: 'border-turquoise',
    textColor: 'text-turquoise',
  },
  {
    icon: TrendingUp,
    title: 'Maximize',
    description: 'เพิ่ม Block เพื่อดันคะแนนจาก 70 ให้ถึง 90+',
    challenge: 'เพิ่ม Blocks เพื่อ Score 95+',
    color: 'tennessee',
    borderColor: 'border-tennessee',
    textColor: 'text-tennessee',
  },
  {
    icon: Wrench,
    title: 'Fix',
    description: 'แก้ไข Prompt ที่มี Block ผิดหรือขาดหายไป',
    challenge: 'หา Block ที่ผิดและแก้ไข',
    color: 'turquoise',
    borderColor: 'border-turquoise',
    textColor: 'text-turquoise',
  },
  {
    icon: Building2,
    title: 'Build',
    description: 'สร้าง Prompt ใหม่จากศูนย์ด้วย Library ที่มีให้',
    challenge: 'ประกอบ Prompt ให้ได้ Score 85+',
    color: 'tennessee',
    borderColor: 'border-tennessee',
    textColor: 'text-tennessee',
  },
];

const ChallengeModes: React.FC = () => {
  return (
    <section className="bg-root-beer py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold">Challenge Modes</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">
            4 โหมดท้าทาย ฝึกทักษะรอบด้าน
          </h2>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.title}
              className={`bg-oxford-blue border-2 ${challenge.borderColor} rounded-2xl p-8 hover:scale-102 transition-all duration-300 hover:shadow-lg group`}
            >
              <challenge.icon className={`h-10 w-10 ${challenge.textColor} mb-4`} />
              <h3 className={`${challenge.textColor} font-bold text-2xl mb-2`}>{challenge.title}</h3>
              <p className="text-rackley mb-4">{challenge.description}</p>
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
