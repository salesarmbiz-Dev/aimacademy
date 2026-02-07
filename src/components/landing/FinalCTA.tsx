import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section className="bg-oxford-blue py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--border)/0.05)_0%,_transparent_70%)]"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="text-foreground text-2xl md:text-3xl font-bold">
          อย่าเพิ่งเขียน Prompt...
        </h2>
        <h2 className="text-tennessee text-2xl md:text-3xl font-bold mt-2">
          ให้เริ่ม 'ประกอบ' มันขึ้นมา
        </h2>
        <p className="text-muted-foreground text-lg mt-4">
          Prompt Lego: มาตรฐานใหม่ของการเรียนรู้ AI
        </p>

        {/* CTA Button */}
        <Link
          to="/register"
          className="btn-primary gap-2 text-xl px-12 py-5 mt-10"
        >
          เริ่มเล่นฟรีวันนี้
          <ArrowRight className="h-6 w-6" />
        </Link>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-8 text-muted-foreground text-sm">
          <span>✓ ไม่ต้องใช้บัตรเครดิต</span>
          <span className="hidden md:inline">•</span>
          <span>✓ เริ่มใช้ได้ทันที</span>
          <span className="hidden md:inline">•</span>
          <span>✓ ยกเลิกได้ตลอดเวลา</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
