import React from 'react';
import { GraduationCap, BarChart3, Users, ArrowDown } from 'lucide-react';

const painPoints = [
  {
    icon: GraduationCap,
    title: 'อบรมแล้ว แต่ทำไม่เป็น',
    description: 'ส่งพนักงานไปอบรม AI 1-2 วัน กลับมาก็ลืมหมด เพราะไม่มีพื้นที่ฝึกฝนต่อเนื่อง',
  },
  {
    icon: BarChart3,
    title: 'วัดผลไม่ได้',
    description: 'จ่ายเงินจ้าง trainer หรือซื้อคอร์ส แต่ไม่มีข้อมูลว่าพนักงานเก่งขึ้นจริงหรือเปล่า',
  },
  {
    icon: Users,
    title: 'พนักงานไม่อยากเรียน',
    description: 'คอร์สออนไลน์ Completion Rate แค่ 5-15% เพราะน่าเบื่อ ดูวิดีโอแล้วหลับ',
  },
];

const B2BPainPointsSection: React.FC = () => {
  return (
    <section className="bg-oxford-blue py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-foreground text-center mb-12">
          ปัญหาที่ HR เจอเมื่อ Upskill ทีมด้าน AI
        </h2>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-oxford-blue/60 border border-border/30 rounded-2xl p-8 hover:border-tennessee/40 hover:-translate-y-1 transition-all duration-300"
            >
              <point.icon className="w-10 h-10 text-tennessee mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Transition Element */}
        <div className="flex flex-col items-center mt-12">
          <ArrowDown className="w-6 h-6 text-tennessee animate-bounce" />
          <p className="text-lg text-tennessee font-medium mt-2">
            AIM Academy แก้ปัญหาเหล่านี้
          </p>
        </div>
      </div>
    </section>
  );
};

export default B2BPainPointsSection;
