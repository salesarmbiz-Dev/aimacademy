import React from 'react';

const SocialProofSection: React.FC = () => {
  const stats = [
    {
      number: '85%+',
      label: 'Completion Rate',
      sublabel: 'vs 30% training ปกติ',
    },
    {
      number: '฿50-500K',
      label: 'Deliverable Value',
      sublabel: 'ต่อเกม',
    },
    {
      number: '6',
      label: 'Analytics Modules',
      sublabel: 'วัดผลครบทุกมิติ',
    },
    {
      number: '3 SETs',
      label: 'Game System',
      sublabel: '9+ เกม progressive',
    },
  ];

  return (
    <section id="social-proof" className="bg-root-beer py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-tennessee text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
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
