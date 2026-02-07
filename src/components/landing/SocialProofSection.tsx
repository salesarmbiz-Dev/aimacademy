import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SocialProofSection: React.FC = () => {
  const stat1 = useCountUp({ end: 85, suffix: '%+' });
  const stat2 = useCountUp({ end: 500, prefix: '฿50-', suffix: 'K' });
  const stat3 = useCountUp({ end: 6 });
  const stat4 = useCountUp({ end: 3, suffix: ' SETs' });

  const stats = [
    {
      ref: stat1.ref,
      displayValue: stat1.displayValue,
      label: 'Completion Rate',
      sublabel: 'vs 30% training ปกติ',
    },
    {
      ref: stat2.ref,
      displayValue: stat2.displayValue,
      label: 'Deliverable Value',
      sublabel: 'ต่อเกม',
    },
    {
      ref: stat3.ref,
      displayValue: stat3.displayValue,
      label: 'Analytics Modules',
      sublabel: 'วัดผลครบทุกมิติ',
    },
    {
      ref: stat4.ref,
      displayValue: stat4.displayValue,
      label: 'Game System',
      sublabel: '9+ เกม progressive',
    },
  ];

  return (
    <section id="social-proof" className="bg-root-beer py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              ref={stat.ref}
              className={`text-center scroll-reveal scroll-reveal-delay-${index + 1}`}
            >
              <p className="text-tennessee text-3xl md:text-4xl font-bold mb-2">
                {stat.displayValue}
              </p>
              <p className="text-foreground font-semibold mb-1">
                {stat.label}
              </p>
              <p className="text-muted-foreground text-sm">
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
