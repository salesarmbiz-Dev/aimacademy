import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToHowItWorks: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToHowItWorks }) => {
  return (
    <section className="min-h-screen gradient-hero flex flex-col items-center justify-center relative px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-block px-4 py-2 bg-tennessee/20 border border-tennessee text-tennessee text-sm font-semibold rounded-full mb-6">
          🎮 AI Learning by Gamification
        </div>

        {/* Main Headline */}
        <h1 className="mt-6">
          <span className="block text-turquoise font-bold text-3xl md:text-5xl">Prompt Lego</span>
          <span className="block text-foreground font-bold text-2xl md:text-4xl mt-2">ถอด Prompt ออกเป็นชิ้นๆ</span>
          <span className="block text-foreground font-medium text-lg md:text-2xl mt-2">แล้วประกอบใหม่ให้มีประสิทธิภาพสูงสุด</span>
        </h1>

        {/* Subheadline */}
        <p className="text-rackley text-lg mt-6">
          เลิก 'เดา' แล้วเริ่ม 'เล่น' กับโครงสร้างของ AI
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            to="/register"
            className="flex items-center gap-2 px-8 py-4 bg-tennessee text-foreground font-semibold rounded-lg text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            เริ่มเล่นฟรี
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button
            onClick={onScrollToHowItWorks}
            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-turquoise text-turquoise font-semibold rounded-lg text-lg hover:bg-turquoise/10 transition-all"
          >
            <PlayCircle className="h-5 w-5" />
            ดูวิธีการทำงาน
          </button>
        </div>

        {/* Hero Visual - Lego Blocks */}
        <div className="mt-16 flex flex-col items-center">
          <div className="relative">
            {/* Block 1 - ROLE */}
            <div className="lego-block bg-turquoise text-oxford-blue px-8 py-4 rounded-lg font-bold shadow-lg animate-float-slow">
              <div className="flex gap-2 absolute -top-2 left-4">
                <div className="w-3 h-3 bg-turquoise rounded-full border-2 border-oxford-blue/30"></div>
                <div className="w-3 h-3 bg-turquoise rounded-full border-2 border-oxford-blue/30"></div>
              </div>
              ROLE
            </div>
            {/* Block 2 - TASK */}
            <div className="lego-block bg-turquoise/70 text-oxford-blue px-8 py-4 rounded-lg font-bold shadow-lg -mt-1 ml-4 animate-float-medium">
              <div className="flex gap-2 absolute -top-2 left-4">
                <div className="w-3 h-3 bg-turquoise/70 rounded-full border-2 border-oxford-blue/30"></div>
                <div className="w-3 h-3 bg-turquoise/70 rounded-full border-2 border-oxford-blue/30"></div>
              </div>
              TASK
            </div>
            {/* Block 3 - TARGET */}
            <div className="lego-block bg-tennessee text-foreground px-8 py-4 rounded-lg font-bold shadow-lg -mt-1 ml-8 animate-float-fast">
              <div className="flex gap-2 absolute -top-2 left-4">
                <div className="w-3 h-3 bg-tennessee rounded-full border-2 border-foreground/30"></div>
                <div className="w-3 h-3 bg-tennessee rounded-full border-2 border-foreground/30"></div>
              </div>
              TARGET
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-rackley" />
        <span className="text-rackley text-sm">เลื่อนลงเพื่อดูเพิ่มเติม</span>
      </div>
    </section>
  );
};

export default HeroSection;
