import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    tag: 'ทดลองฟรี',
    tagStyle: 'bg-tennessee/10 text-tennessee',
    price: '฿0',
    priceUnit: '',
    subPrice: 'สำหรับ 5 คนแรก',
    features: [
      'ทดลองใช้ 14 วัน',
      'เกมทั้งหมด',
      'Pre-test / Post-test',
      'ใบรับรองพื้นฐาน',
    ],
    cta: 'เริ่มทดลอง',
    ctaStyle: 'btn-secondary',
    link: '/register',
    highlighted: false,
  },
  {
    tag: 'แนะนำ',
    tagStyle: 'bg-tennessee text-white',
    price: '฿199',
    priceUnit: '/คน/เดือน',
    subPrice: 'ขั้นต่ำ 10 คน',
    features: [
      { text: 'ทุกอย่างใน Free +', highlight: true },
      'HR Dashboard',
      'Export Report (PDF/CSV)',
      'ใบรับรองทุกระดับ',
      'Invite Code สำหรับทีม',
      'Email Support',
    ],
    cta: 'เริ่มใช้งาน',
    ctaStyle: 'btn-primary',
    link: '/register',
    highlighted: true,
  },
  {
    tag: 'องค์กรขนาดใหญ่',
    tagStyle: 'bg-rackley/10 text-muted-foreground',
    price: 'ติดต่อเรา',
    priceUnit: '',
    subPrice: 'ปรับแต่งตามความต้องการ',
    features: [
      { text: 'ทุกอย่างใน Team +', highlight: true },
      'Custom Challenges',
      'White-label Branding',
      'API Integration (LMS)',
      'Dedicated Account Manager',
      'Priority Support',
    ],
    cta: 'ติดต่อทีมงาน',
    ctaStyle: 'btn-secondary',
    link: 'mailto:support@aimacademy.co',
    highlighted: false,
  },
];

const B2BPricingSection: React.FC = () => {
  return (
    <section className="bg-oxford-blue py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-foreground text-center">
          ราคาที่คุ้มกว่าจ้าง Trainer
        </h2>
        <p className="text-base text-muted-foreground text-center mt-3 mb-12">
          ลงทุนน้อยกว่าค่าอบรม 1 วัน แต่ได้ผลลัพธ์ที่วัดได้ตลอดทั้งปี
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col bg-oxford-blue/80 rounded-[20px] p-8 ${
                plan.highlighted
                  ? 'border-2 border-tennessee scale-100 md:scale-105 shadow-[0_0_30px_rgba(242,116,5,0.15)]'
                  : 'border border-border/30'
              }`}
            >
              {/* Tag */}
              <span className={`inline-block self-start px-4 py-1 rounded-full text-[13px] ${plan.tagStyle}`}>
                {plan.tag}
              </span>

              {/* Price */}
              <div className="mt-5 mb-5">
                <span className={`font-bold text-foreground ${plan.price === 'ติดต่อเรา' ? 'text-4xl' : 'text-5xl'}`}>
                  {plan.price}
                </span>
                {plan.priceUnit && (
                  <span className="text-base text-muted-foreground">{plan.priceUnit}</span>
                )}
                <div className="text-[15px] text-muted-foreground mt-1">{plan.subPrice}</div>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => {
                  const isObject = typeof feature === 'object';
                  const text = isObject ? feature.text : feature;
                  const highlight = isObject ? feature.highlight : false;
                  
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-tennessee flex-shrink-0 mt-0.5" />
                      <span className={highlight ? 'text-tennessee' : 'text-foreground'}>
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA Button */}
              {plan.link.startsWith('mailto:') ? (
                <a
                  href={plan.link}
                  className={`mt-8 w-full text-center py-3.5 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  to={plan.link}
                  className={`mt-8 w-full text-center py-3.5 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="max-w-[700px] mx-auto mt-8 bg-tennessee/[0.08] border border-tennessee/20 rounded-xl py-4 px-6 text-center">
          <p className="text-[15px] text-foreground">
            💡 เทียบกับค่าจ้าง Trainer 1 วัน: <span className="text-muted-foreground">30,000-80,000 บาท</span>
          </p>
          <p className="text-[15px] text-foreground mt-1">
            20 คน × AIM Academy Team 1 เดือน = <span className="text-tennessee font-semibold">3,980 บาท</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default B2BPricingSection;
