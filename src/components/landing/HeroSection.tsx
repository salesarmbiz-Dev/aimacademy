import React from 'react';
import { Gamepad2, Wrench, BarChart3, ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToNext = () => {
    const element = document.getElementById('pain-points');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="gradient-hero pt-28 pb-20 md:pt-36 md:pb-28 min-h-[90vh] flex flex-col justify-center">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Eyebrow */}
        <p className="text-rackley text-sm md:text-base font-medium mb-6 animate-fade-in">
          สำหรับ HR & ผู้บริหารที่ต้องพัฒนาทีมด้าน AI
        </p>

        {/* Headline */}
        <h1 className="text-foreground text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          AI Training ที่จบแล้ว
          <br />
          <span className="text-turquoise">ได้มากกว่า Certificate</span>
        </h1>

        {/* Subheadline */}
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
          Platform ที่ทำให้พนักงานเรียนรู้ AI จริง — สนุกจนทำจบ ได้เครื่องมือกลับไปใช้
          <br className="hidden md:block" />
          และ HR เห็นผลลัพธ์ชัดเจนทุกมิติ
        </p>

        {/* Value Pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          <div className="flex items-center gap-2 bg-tennessee/10 text-tennessee rounded-full px-4 py-2 text-sm md:text-base font-medium">
            <Gamepad2 className="w-4 h-4" />
            <span>เรียนผ่านเกม</span>
          </div>
          <div className="flex items-center gap-2 bg-turquoise/10 text-turquoise rounded-full px-4 py-2 text-sm md:text-base font-medium">
            <Wrench className="w-4 h-4" />
            <span>ได้เครื่องมือจริง</span>
          </div>
          <div className="flex items-center gap-2 bg-oxford-blue/20 text-foreground rounded-full px-4 py-2 text-sm md:text-base font-medium">
            <BarChart3 className="w-4 h-4" />
            <span>วัดผลได้ทุกคน</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNext}
          className="text-muted-foreground hover:text-foreground transition-colors animate-bounce focus:outline-none focus:ring-2 focus:ring-turquoise rounded-full p-2"
          aria-label="เลื่อนลงดูเพิ่มเติม"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
