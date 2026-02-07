import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

const SocialProofSection: React.FC = () => {
  const stat1 = useCountUp({ end: 85, suffix: '%+' });
  const stat2 = useCountUp({ end: 9, suffix: '+' });
  const stat3 = useCountUp({ end: 6 });
  const stat4 = useCountUp({ end: 100, suffix: '%' });

  const stats = [
    {
      ref: stat1.ref,
      displayValue: stat1.displayValue,
      label: 'Completion Rate',
      sublabel: 'vs 15-30% training ปกติ',
    },
    {
      ref: stat2.ref,
      displayValue: stat2.displayValue,
      label: 'เกมฝึกทักษะ',
      sublabel: '3 SETs progressive',
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
      label: 'Deliverables จริง',
      sublabel: 'ทุกเกมสร้างเครื่องมือ',
    },
  ];

  return (
    <section id="social-proof" className="bg-oxford-blue py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
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
              <p className="text-white font-semibold mb-1">{stat.label}</p>
              <p className="text-white/50 text-sm">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
