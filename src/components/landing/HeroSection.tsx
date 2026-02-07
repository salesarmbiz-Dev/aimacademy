import React from 'react';
import { Gamepad2, Wrench, BarChart3, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onScrollToDemo: () => void;
  onScrollToGames: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToDemo, onScrollToGames }) => {
  return (
    <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <p className="text-tennessee text-sm font-semibold uppercase tracking-wide">
              AI Training ที่ได้มากกว่า 'ความรู้'
            </p>

            {/* Headline */}
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Training ที่สนุก<br />
              ได้เครื่องมือจริง<br />
              และวัดผลได้
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg">
              เปลี่ยน AI Training จากค่าใช้จ่ายเป็นการลงทุน — ทุกเกมสร้าง deliverables มูลค่า ฿50-500K กลับไปใช้งานจริง
            </p>

            {/* Button Group */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onScrollToDemo}
                className="btn-primary text-base px-8 py-3"
              >
                นัดสาธิตฟรี
              </button>
              <button 
                onClick={onScrollToGames}
                className="btn-secondary text-base px-8 py-3"
              >
                ดูเกมตัวอย่าง
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle2 className="w-4 h-4 text-tennessee" />
                <span>ใช้งานจริงใน 20+ องค์กร</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle2 className="w-4 h-4 text-tennessee" />
                <span>Completion rate 85%+</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle2 className="w-4 h-4 text-tennessee" />
                <span>วัดผลได้ทุกมิติ</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Composition (Desktop Only) */}
          <div className="hidden lg:block relative h-[400px]">
            {/* Card 1 - Gamified Learning */}
            <div 
              className="absolute top-0 left-0 bg-oxford-blue/80 border border-border/30 rounded-2xl p-6 backdrop-blur w-72 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-tennessee/10 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-tennessee" />
                </div>
                <span className="text-foreground font-semibold">Gamified Learning</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Completion Rate</span>
                <span className="text-tennessee font-bold">85%+</span>
              </div>
            </div>

            {/* Card 2 - Real Deliverables */}
            <div 
              className="absolute top-28 left-16 bg-oxford-blue/80 border border-border/30 rounded-2xl p-6 backdrop-blur w-72 z-10 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-tennessee/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-tennessee" />
                </div>
                <span className="text-foreground font-semibold">Real Deliverables</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Value per Game</span>
                <span className="text-tennessee font-bold">฿50-500K</span>
              </div>
            </div>

            {/* Card 3 - HR Analytics */}
            <div 
              className="absolute top-56 left-32 bg-oxford-blue/80 border border-border/30 rounded-2xl p-6 backdrop-blur w-72 z-20 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-tennessee/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-tennessee" />
                </div>
                <span className="text-foreground font-semibold">HR Analytics</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Dashboard Modules</span>
                <span className="text-tennessee font-bold">6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
