import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="gradient-hero py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold">Scientific Gamification</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">
            รู้ลำดับความสำคัญ เพื่อการปรับแต่งที่แม่นยำ
          </h2>
        </div>

        {/* Pyramid Visual */}
        <div className="max-w-4xl mx-auto">
          {/* Tier 1 - Critical */}
          <div className="relative mb-4">
            <div className="bg-gradient-to-r from-turquoise to-turquoise/70 rounded-t-xl p-6 mx-auto max-w-xs text-center shadow-lg shadow-turquoise/20">
              <span className="text-oxford-blue font-bold text-sm">Tier 1: Critical</span>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">ROLE</span>
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">TASK</span>
              </div>
            </div>
            <p className="text-foreground text-sm text-center mt-2 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:max-w-[200px] md:text-left">
              <span className="text-turquoise font-semibold">Must Have</span> - ลบไม่ได้ กำหนดทิศทางและสิ่งที่ต้องทำ
            </p>
          </div>

          {/* Tier 2 - High Priority */}
          <div className="relative mb-4">
            <div className="bg-rackley/50 p-6 mx-auto max-w-md text-center">
              <span className="text-foreground font-bold text-sm">Tier 2: High Priority</span>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">CONTEXT</span>
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">TARGET</span>
              </div>
            </div>
            <p className="text-foreground text-sm text-center mt-2 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:max-w-[200px] md:text-right">
              <span className="text-rackley font-semibold">Should Have</span> - ทำให้ผลลัพธ์ตรงกลุ่มเป้าหมายและประเด็น
            </p>
          </div>

          {/* Tier 3 - Medium Priority */}
          <div className="relative">
            <div className="bg-tennessee/30 border border-tennessee rounded-b-xl p-6 mx-auto max-w-xl text-center">
              <span className="text-foreground font-bold text-sm">Tier 3: Medium Priority</span>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">TONE</span>
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">FORMAT</span>
                <span className="bg-oxford-blue text-foreground px-4 py-2 rounded-full text-sm font-medium">EXAMPLE</span>
              </div>
            </div>
            <p className="text-foreground text-sm text-center mt-2 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:max-w-[200px] md:text-left">
              <span className="text-tennessee font-semibold">Nice to Have</span> - ปรับน้ำเสียงและรูปแบบให้สวยงาม
            </p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-oxford-blue border border-rackley rounded-xl p-6 text-center hover:scale-102 transition-transform">
            <p className="text-rackley text-sm">ROLE ลบแล้ว</p>
            <p className="text-tennessee text-3xl font-bold mt-2">-34 Points</p>
            <span className="inline-block bg-tennessee/20 text-tennessee text-xs px-3 py-1 rounded-full mt-2">สำคัญที่สุด</span>
          </div>
          <div className="bg-oxford-blue border border-rackley rounded-xl p-6 text-center hover:scale-102 transition-transform">
            <p className="text-rackley text-sm">TARGET ลบแล้ว</p>
            <p className="text-tennessee text-3xl font-bold mt-2">-28 Points</p>
          </div>
          <div className="bg-oxford-blue border border-rackley rounded-xl p-6 text-center hover:scale-102 transition-transform">
            <p className="text-rackley text-sm">FORMAT ลบแล้ว</p>
            <p className="text-rackley text-3xl font-bold mt-2">-8 Points</p>
            <span className="inline-block bg-rackley/20 text-rackley text-xs px-3 py-1 rounded-full mt-2">optional</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
