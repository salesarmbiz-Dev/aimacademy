import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '฿0',
    period: '/เดือน',
    features: [
      { text: '5 Experiments ต่อวัน', included: true },
      { text: 'Basic Blocks', included: true },
      { text: '2 Challenge Modes', included: true },
      { text: 'Full Block Library', included: false },
      { text: 'Insights History', included: false },
    ],
    buttonText: 'เริ่มใช้ฟรี',
    buttonStyle: 'border border-rackley text-rackley hover:bg-rackley/20',
    cardStyle: 'border-rackley',
    headerBg: 'bg-rackley/20',
    nameColor: 'text-foreground',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '฿350',
    period: '/เดือน',
    features: [
      { text: 'Unlimited Experiments', included: true },
      { text: 'Full Block Library', included: true },
      { text: 'All Challenge Modes', included: true },
      { text: 'Insights History', included: true },
      { text: 'Priority Support', included: true },
    ],
    buttonText: 'สมัคร Pro',
    buttonStyle: 'bg-turquoise text-oxford-blue font-semibold hover:bg-turquoise/90',
    cardStyle: 'border-turquoise border-2',
    headerBg: 'bg-turquoise/20',
    nameColor: 'text-turquoise',
    highlighted: true,
    badge: 'แนะนำ',
  },
  {
    name: 'Team',
    price: '฿690',
    period: '/user/เดือน',
    features: [
      { text: 'ทุกอย่างใน Pro', included: true },
      { text: 'Shared Experiments', included: true },
      { text: 'Team Analytics Dashboard', included: true },
      { text: 'Admin Controls', included: true },
      { text: 'Dedicated Support', included: true },
    ],
    buttonText: 'ติดต่อทีมขาย',
    buttonStyle: 'border border-tennessee text-tennessee hover:bg-tennessee/20',
    cardStyle: 'border-tennessee',
    headerBg: 'bg-tennessee/20',
    nameColor: 'text-tennessee',
    highlighted: false,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="bg-gradient-to-b from-root-beer to-oxford-blue py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold">Pricing</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">
            เลือกแพลนที่เหมาะกับคุณ
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-oxford-blue ${plan.cardStyle} rounded-2xl overflow-hidden transition-all duration-300 hover:scale-102 ${
                plan.highlighted ? 'md:scale-105 shadow-xl shadow-turquoise/20' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-tennessee text-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} p-6 text-center`}>
                <h3 className={`${plan.nameColor} text-2xl font-bold`}>{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-foreground text-4xl font-bold">{plan.price}</span>
                  <span className="text-rackley">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-turquoise flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-rackley flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-rackley line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-lg mt-6 transition-all ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
