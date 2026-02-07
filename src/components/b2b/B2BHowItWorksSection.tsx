import React from 'react';
import { UserPlus, Gamepad2, LayoutDashboard } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'สร้างทีม',
    description: 'HR สร้างทีมบน AIM Academy แล้วแชร์ Invite Code ให้พนักงาน ใช้เวลาแค่ 2 นาที',
  },
  {
    number: '02',
    icon: Gamepad2,
    title: 'พนักงานเรียนรู้ผ่านเกม',
    description: 'พนักงานทำ Pre-test แล้วฝึกทักษะผ่านเกม Interactive ใช้เวลาแค่ 10-15 นาที/วัน',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'HR ดูผลผ่าน Dashboard',
    description: 'เห็นทุกอย่าง: ใครเข้ามาบ้าง ทำครบหรือยัง คะแนนเพิ่มขึ้นเท่าไหร่ Export report ได้ทันที',
  },
];

const B2BHowItWorksSection: React.FC = () => {
  return (
    <section className="bg-oxford-blue py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-foreground text-center mb-16">
          เริ่มต้นง่ายใน 3 ขั้นตอน
        </h2>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line - Desktop (Horizontal) */}
          <div className="hidden lg:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-tennessee/30" />
          
          {/* Connecting Line - Mobile (Vertical) */}
          <div className="lg:hidden absolute left-8 top-16 bottom-16 w-0.5 bg-tennessee/30" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col lg:items-center">
                {/* Number Circle */}
                <div className="flex items-start lg:flex-col lg:items-center gap-6 lg:gap-0">
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-2 border-tennessee bg-tennessee/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-tennessee">{step.number}</span>
                  </div>

                  {/* Mobile: Content to the right */}
                  <div className="lg:hidden flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Desktop: Content below */}
                <div className="hidden lg:block text-center mt-6">
                  <step.icon className="w-6 h-6 text-tennessee mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Mobile: Icon below */}
                <div className="lg:hidden pl-[88px] mt-2">
                  <step.icon className="w-5 h-5 text-tennessee" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BHowItWorksSection;
