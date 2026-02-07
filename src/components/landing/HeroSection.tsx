import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Gamepad2, ChevronDown, Eye, Blocks, ArrowRight, Star, Users, CheckCircle, Brain, Lightbulb, LogIn } from 'lucide-react';
import GuestModeModal from '@/components/modals/GuestModeModal';

interface HeroSectionProps {
  onScrollToHowItWorks: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToHowItWorks }) => {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  return (
    <section className="min-h-screen gradient-hero flex flex-col items-center justify-center relative px-4 pt-20">
      <div className="text-center max-w-5xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-block px-4 py-2 bg-tennessee/20 border border-tennessee text-tennessee text-sm font-semibold rounded-full mb-6">
          🎮 AI Learning by Gamification
        </div>

        {/* Logo & Main Headline */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="w-10 h-10 md:w-14 md:h-14 text-tennessee" />
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-tennessee" />
        </div>
        <h1 className="mt-4">
          <span className="block text-foreground font-bold text-4xl md:text-6xl">AIM Academy</span>
          <span className="block text-foreground font-bold text-xl md:text-3xl mt-3">เรียนรู้ AI Prompting แบบ Gamification</span>
          <span className="block text-muted-foreground font-medium text-base md:text-xl mt-3">
            ฝึกทักษะ AI ผ่านเกมสนุกๆ - ไม่ต้องเขียนโค้ด ไม่ต้องมีพื้นฐาน
          </span>
        </h1>
      </div>

      {/* Game Showcase Section */}
      <div className="mt-16 w-full max-w-5xl mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-foreground mb-8">
          🎮 เลือกเกมที่ใช่สำหรับคุณ
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Spot the Difference Card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-5 md:p-8 hover:border-turquoise/40 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            {/* Icon Container */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-turquoise/15 rounded-xl flex items-center justify-center">
                <Eye className="w-10 h-10 text-turquoise" />
              </div>
              <span className="px-3.5 py-1.5 bg-tennessee text-white text-xs font-semibold rounded-full">
                แนะนำสำหรับมือใหม่
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl md:text-[28px] font-bold text-foreground mb-2">🎯 Spot the Difference</h3>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg font-medium text-tennessee mb-3">จับผิด 2 Prompts - อันไหนดีกว่า?</p>
            
            {/* Description */}
            <p className="text-sm md:text-[15px] font-normal text-muted-foreground leading-relaxed mb-4">
              ฝึกตาให้แม่น ดู Prompt แล้วเลือกอันที่ดีกว่า ไม่ต้องเขียนเอง แค่ดูและเลือก
            </p>
            
            {/* Difficulty */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px] font-medium text-tennessee">Beginner Friendly</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            
            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Role Detection', 'Context Clarity', 'Tone Matching'].map((skill) => (
                <span 
                  key={skill} 
                  className="px-3 py-1 bg-rackley/20 border border-rackley/30 text-rackley text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            {/* Button */}
            <button
              onClick={() => setIsGuestModalOpen(true)}
              className="w-full py-3 bg-turquoise text-oxford-blue font-semibold text-base rounded-lg hover:bg-turquoise/90 hover:scale-[1.02] transition-all shadow-md"
            >
              ลองเล่น
            </button>
          </div>

          {/* Prompt Lego Card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl p-5 md:p-8 hover:border-tennessee/40 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            {/* Icon Container */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-tennessee/15 rounded-xl flex items-center justify-center">
                <Blocks className="w-10 h-10 text-tennessee" />
              </div>
              <span className="px-3.5 py-1.5 bg-tennessee text-white text-xs font-semibold rounded-full">
                Intermediate
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl md:text-[28px] font-bold text-foreground mb-2">🧱 Prompt Lego</h3>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg font-medium text-tennessee mb-3">ประกอบ Prompt เหมือนต่อ LEGO</p>
            
            {/* Description */}
            <p className="text-sm md:text-[15px] font-normal text-muted-foreground leading-relaxed mb-4">
              ลงมือสร้าง Prompt ด้วยตัวเอง ลองเพิ่ม ลบ สลับ Blocks แล้วดูผลลัพธ์เปลี่ยน
            </p>
            
            {/* Difficulty */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px] font-medium text-tennessee">Intermediate</span>
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
              {[...Array(2)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-rackley" />
              ))}
            </div>
            
            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Prompt Building', 'Experimentation', 'Optimization'].map((skill) => (
                <span 
                  key={skill} 
                  className="px-3 py-1 bg-tennessee/10 border border-tennessee/30 text-tennessee text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            {/* Button */}
            <Link
              to="/login"
              className="block w-full py-3 btn-primary text-center rounded-lg"
            >
              เริ่มเล่น
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Buttons Section - Moved below Game Cards */}
      <div className="mt-12 w-full max-w-2xl mx-auto px-4">
        <div className="bg-gradient-to-r from-oxford-blue/80 to-root-beer/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/30">
          <p className="text-center text-lg md:text-xl font-medium text-foreground mb-6">
            พร้อมเริ่มเรียนรู้แล้วหรือยัง?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsGuestModalOpen(true)}
              className="w-full sm:w-auto btn-primary gap-2 py-4 text-lg"
            >
              <Gamepad2 className="h-5 w-5" />
              ลองเล่นฟรี
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto btn-secondary gap-2 py-4 text-lg"
            >
              <LogIn className="h-5 w-5" />
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Path Section */}
      <div className="mt-20 w-full max-w-4xl mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-foreground mb-10">
          🚀 เส้นทางการเรียนรู้
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Step 1 */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-turquoise" />
            </div>
            <p className="font-bold text-foreground">Spot the Difference</p>
            <p className="text-muted-foreground text-sm">ฝึกตา 👀</p>
          </div>
          
          {/* Arrow */}
          <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
          <ChevronDown className="w-8 h-8 text-muted-foreground md:hidden" />
          
          {/* Step 2 */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tennessee/20 flex items-center justify-center">
              <Blocks className="w-8 h-8 text-tennessee" />
            </div>
            <p className="font-bold text-foreground">Prompt Lego</p>
            <p className="text-muted-foreground text-sm">ฝึกมือ 🤲</p>
          </div>
          
          {/* Arrow */}
          <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
          <ChevronDown className="w-8 h-8 text-muted-foreground md:hidden" />
          
          {/* Step 3 */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-turquoise to-tennessee flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-oxford-blue" />
            </div>
            <p className="font-bold text-foreground">AI Master</p>
            <p className="text-muted-foreground text-sm">เก่ง AI 🏆</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-tennessee" />
              <span className="text-3xl md:text-4xl font-bold text-foreground">10,000+</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">ผู้เรียน</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-tennessee" />
              <span className="text-3xl md:text-4xl font-bold text-foreground">50,000+</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Challenges Completed</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-tennessee" />
              <span className="text-3xl md:text-4xl font-bold text-foreground">98%</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">อยากแนะนำเพื่อน</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-20 w-full max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-foreground mb-10">
          ⚡ ง่ายแค่ 3 ขั้นตอน
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-turquoise/20 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-turquoise" />
            </div>
            <h3 className="font-bold text-foreground mb-2">1. เลือกเกม</h3>
            <p className="text-muted-foreground text-sm">เริ่มจาก Spot the Difference ถ้าเป็นมือใหม่</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-tennessee/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-tennessee" />
            </div>
            <h3 className="font-bold text-foreground mb-2">2. เล่นและเรียนรู้</h3>
            <p className="text-muted-foreground text-sm">ทุกข้อมี feedback ทันที พร้อมอธิบายเหตุผล</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-turquoise/20 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-turquoise" />
            </div>
            <h3 className="font-bold text-foreground mb-2">3. สะสม Insights</h3>
            <p className="text-muted-foreground text-sm">เก็บ Pattern ที่เรียนรู้ไว้ใช้ตลอดไป</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">เลื่อนลงเพื่อดูเพิ่มเติม</span>
      </div>

      {/* Guest Mode Modal */}
      <GuestModeModal 
        isOpen={isGuestModalOpen} 
        onClose={() => setIsGuestModalOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;
