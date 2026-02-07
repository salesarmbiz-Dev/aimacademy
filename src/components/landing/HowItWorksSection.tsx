import React from 'react';
import { Eye, Blocks, FlaskConical, RefreshCw, Brain } from 'lucide-react';

const steps = [
  {
    number: 1,
    name: 'SEE',
    thai: 'เห็น Excellent Prompt และ Output ที่ดี',
    icon: Eye,
  },
  {
    number: 2,
    name: 'BREAK',
    thai: 'ระบบแยก Prompt เป็น Lego Blocks',
    icon: Blocks,
  },
  {
    number: 3,
    name: 'EXPERIMENT',
    thai: 'ลอง ลบ / สลับ / เพิ่ม Blocks',
    icon: FlaskConical,
  },
  {
    number: 4,
    name: 'REGENERATE',
    thai: 'Generate output ใหม่ เทียบกับต้นฉบับ',
    icon: RefreshCw,
  },
  {
    number: 5,
    name: 'LEARN',
    thai: 'เห็น Impact ว่า Block ไหนสำคัญแค่ไหน',
    icon: Brain,
  },
];

interface HowItWorksSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} id="how-it-works" className="bg-oxford-blue py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">วิธีการทำงาน</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">Prompt Lego Loop</h2>
          <p className="text-muted-foreground text-lg mt-2">5 ขั้นตอนง่ายๆ สู่การเป็น Prompt Master</p>
        </div>

        {/* Loop Visualization */}
        <div className="relative">
          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4 animate-fade-in">
                <div className="relative">
                  <div className="w-12 h-12 bg-tennessee rounded-full flex items-center justify-center text-oxford-blue font-bold text-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-tennessee/50"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-tennessee" />
                    <span className="text-foreground font-semibold text-lg">{step.name}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{step.thai}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Pentagon/Circle Layout */}
          <div className="hidden md:block">
            <div className="relative w-full max-w-3xl mx-auto h-[400px]">
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-foreground font-bold text-xl">Prompt Lego</span>
                <span className="block text-tennessee font-bold text-xl">Loop</span>
              </div>

              {/* Steps positioned in circle */}
              {steps.map((step, index) => {
                const angle = (index * 72 - 90) * (Math.PI / 180);
                const radius = 160;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={step.number}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <div className="flex flex-col items-center text-center w-32">
                      <div className="w-12 h-12 bg-tennessee rounded-full flex items-center justify-center text-oxford-blue font-bold text-lg shadow-lg shadow-tennessee/30">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="text-foreground font-semibold mt-2">{step.name}</span>
                      <p className="text-muted-foreground text-xs mt-1">{step.thai}</p>
                    </div>
                  </div>
                );
              })}

              {/* Connecting Circle */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  opacity="0.3"
                  className="animate-spin-slow"
                  style={{ transformOrigin: 'center', animationDuration: '30s' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
