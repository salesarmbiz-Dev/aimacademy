import React from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onContactClick: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onContactClick }) => {
  const plans = [
    {
      name: 'Starter',
      price: '฿150-200K',
      period: 'ต่อองค์กร',
      features: [
        'SET 1 (3 เกมพื้นฐาน)',
        'Basic HR Dashboard',
        'สูงสุด 30 คน',
        'Certificate',
      ],
      buttonText: 'ปรึกษาเรา',
      buttonStyle: 'btn-secondary',
      cardStyle: 'border-border/30',
      featured: false,
    },
    {
      name: 'Professional',
      price: '฿400-500K',
      period: 'ต่อองค์กร',
      features: [
        'SET 1-2 (6 เกม)',
        '2 Value-First Games',
        'Full HR Dashboard',
        'สูงสุด 100 คน',
        'AI Asset Library',
        'Dedicated Support',
      ],
      buttonText: 'นัดสาธิต',
      buttonStyle: 'btn-primary',
      cardStyle: 'border-2 border-tennessee',
      featured: true,
      badge: 'แนะนำ',
    },
    {
      name: 'Enterprise',
      price: '฿800K-1.5M',
      period: 'ต่อองค์กร',
      features: [
        'ทุก SET (9+ เกม)',
        'Custom Games',
        'Full Dashboard + API',
        'ไม่จำกัดจำนวนคน',
        'AI Asset Library + Guardrails',
        'Dedicated Success Manager',
      ],
      buttonText: 'ติดต่อทีมขาย',
      buttonStyle: 'btn-secondary',
      cardStyle: 'border-border/30',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="bg-oxford-blue py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            แพ็กเกจ
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            เลือกแผนที่เหมาะกับองค์กรของคุณ
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl p-8 border ${plan.cardStyle} flex flex-col relative`}
            >
              {/* Featured Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-tennessee text-white text-xs font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-foreground text-xl font-bold mb-4">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-tennessee text-3xl md:text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-tennessee flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={onContactClick}
                className={`w-full py-3 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
