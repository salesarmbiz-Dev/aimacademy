import React from 'react';
import { Link } from 'react-router-dom';

const trustBadges = [
  '🔒 PDPA Compliant',
  '🎯 วัดผลได้จริง',
  '💳 ไม่ต้องใส่บัตรเครดิต',
];

const B2BFinalCTASection: React.FC = () => {
  return (
    <section 
      className="py-12 md:py-20"
      style={{
        background: 'linear-gradient(135deg, #012840 0%, #260D0B 100%)'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 text-center">
        {/* Headline */}
        <h2 className="text-[28px] md:text-4xl font-bold text-foreground">
          พร้อมยกระดับทักษะ AI ของทีมคุณ?
        </h2>
        <p className="text-lg text-muted-foreground mt-3">
          เริ่มต้นฟรี วัดผลได้จริง ไม่ต้องผูกมัด
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="w-full sm:w-auto btn-primary text-lg py-4"
          >
            ทดลองใช้ฟรี สำหรับ 5 คน
          </Link>
          <a
            href="mailto:support@aimacademy.co"
            className="w-full sm:w-auto btn-secondary py-4"
          >
            ติดต่อทีมงาน
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mt-8">
          {trustBadges.map((badge, index) => (
            <React.Fragment key={index}>
              <span className="text-[13px] text-muted-foreground">{badge}</span>
              {index < trustBadges.length - 1 && (
                <span className="hidden md:inline text-muted-foreground">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BFinalCTASection;
