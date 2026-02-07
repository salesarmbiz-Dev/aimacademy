import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HowItWorksSection: React.FC = () => {
  const headerRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  const steps = [
    {
      number: 1,
      title: 'สมัคร + วัดระดับ',
      description: 'ทำ Pre-Assessment 10 ข้อ เพื่อดูจุดเริ่มต้นของทีม',
    },
    {
      number: 2,
      title: 'เล่นเกม + สร้างเครื่องมือ',
      description: 'พนักงานเรียนผ่านเกม ได้ XP ได้ badge และได้ deliverables จริงกลับไปใช้',
    },
    {
      number: 3,
      title: 'วัดผล + Report',
      description: 'HR เห็น Dashboard แสดง skill improvement ของทุกคน พร้อม report ให้ board',
    },
  ];

  return (
    <section id="how-it-works" className="bg-oxford-blue/5 py-16 md:py-24 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 scroll-reveal">
          <h2 className="text-foreground text-2xl md:text-4xl font-bold mb-4">
            เริ่มใช้ได้ใน 3 ขั้นตอน
          </h2>
          <p className="text-muted-foreground text-lg">
            ไม่ต้อง setup ซับซ้อน ไม่ต้องติดตั้งอะไร
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Lines (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/3 w-1/3 border-t-2 border-dashed border-tennessee/30" />
            <div className="hidden md:block absolute top-12 left-2/3 w-1/3 border-t-2 border-dashed border-tennessee/30" />

            {steps.map((step, index) => (
              <div key={step.number} className="text-center relative">
                {/* Number Circle */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tennessee text-white flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-foreground text-xl font-bold mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="text-center mt-12 scroll-reveal scroll-reveal-delay-1">
          <Link
            to="/register"
            className="inline-block bg-tennessee text-white rounded-2xl px-10 py-4 text-lg font-bold hover:bg-tennessee/90 transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise focus:ring-offset-2"
          >
            ทดลองใช้ฟรี
          </Link>
          <p className="text-muted-foreground text-sm mt-4">
            ไม่ต้องใส่ credit card • เริ่มได้ทันที
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
