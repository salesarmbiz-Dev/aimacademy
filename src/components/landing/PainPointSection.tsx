import React from 'react';
import { Brain, FileX, BarChart3 } from 'lucide-react';

const PainPointSection: React.FC = () => {
  const painPoints = [
    {
      icon: Brain,
      title: 'เรียนแล้วลืม',
      description: 'Completion rate แค่ 15-30% — พนักงานนั่งฟัง lecture แล้วลืมหมดภายในสัปดาห์',
    },
    {
      icon: FileX,
      title: 'ไม่ได้อะไรกลับไป',
      description: "ได้แค่ certificate กับ 'ความรู้' — ไม่มี deliverables ที่ใช้งานได้จริง",
    },
    {
      icon: BarChart3,
      title: 'วัดผลไม่ได้',
      description: 'HR justify budget ไม่ได้ — ไม่รู้ว่าพนักงานเก่งขึ้นจริงหรือแค่ผ่าน quiz',
    },
  ];

  return (
    <section id="pain-points" className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            ปัญหาที่องค์กรไทยเจอ
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            AI Training แบบเดิม ไม่ตอบโจทย์อีกต่อไป
          </h2>
        </div>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border/30 hover:border-tennessee/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-tennessee/10 flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-tennessee" />
              </div>
              <h3 className="text-foreground text-xl font-bold mb-3">
                {point.title}
              </h3>
              <p className="text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-muted-foreground text-lg italic">
            "McKinsey/Big 4 คิด ฿15-50M+ — Freelancer ไม่มี framework — Online course ไม่ customize — แล้วองค์กรที่มี budget ฿300K-3M จะไปหาใคร?"
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPointSection;
