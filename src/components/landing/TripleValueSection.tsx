import React from 'react';
import { Gamepad2, Wrench, BarChart3 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TripleValueSection: React.FC = () => {
  const headerRef = useScrollReveal();
  const value1Ref = useScrollReveal();
  const value2Ref = useScrollReveal();
  const value3Ref = useScrollReveal();

  return (
    <section id="triple-value" className="bg-oxford-blue py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 scroll-reveal">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-3">
            หลักการ 3 ประสาน
          </p>
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
            Learn by Playing × Build by Learning × Prove by Using
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            ไม่ใช่แค่สอน แต่สร้างผลลัพธ์ที่จับต้องได้ — ทุกขั้นตอนวัดผลได้จริง
          </p>
        </div>

        {/* Value Blocks */}
        <div className="space-y-16 md:space-y-24">
          {/* VALUE 1: Learn by Playing */}
          <div ref={value1Ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center scroll-reveal">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-tennessee/20 flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-tennessee" />
                </div>
                <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">VALUE 1</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
                เรียนด้วยการเล่น
                <br />
                สนุกจนทำจบ
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                เปลี่ยนการเรียน AI จาก lecture ที่น่าเบื่อเป็นเกมแข่งขัน —
                ฝึกเขียน prompt ฝึกหา bug ฝึกสร้างเครื่องมือ ผ่าน game mechanics
                ที่ออกแบบจาก Learning Science ให้จำได้จริง ใช้เป็นจริง
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🎯 Spot the Difference</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🧱 Prompt Lego</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🔧 Prompt Debugger</span>
              </div>
            </div>

            {/* Visual Mockup */}
            <div className="bg-oxford-blue/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-white/60 text-sm mb-4">🔧 Prompt Debugger — Level 3</div>
              <div className="bg-root-beer/50 rounded-xl p-4 mb-4 font-mono text-sm">
                <p className="text-white/80">ช่วยเขียน content สำหรับ</p>
                <p className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded inline-block my-1">social media ให้ดีๆ</p>
                <p className="text-white/80">โดยเน้นเรื่อง...</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-red-500/20 text-red-300 rounded-lg px-3 py-1.5 text-xs font-medium">🐛 Vagueness</span>
                <span className="bg-white/10 text-white/60 rounded-lg px-3 py-1.5 text-xs">Missing Context</span>
                <span className="bg-white/10 text-white/60 rounded-lg px-3 py-1.5 text-xs">Wrong Scope</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-tennessee text-2xl font-bold">85</span>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-tennessee rounded-full" />
                  </div>
                </div>
                <span className="text-yellow-400">⭐⭐⭐</span>
              </div>
            </div>
          </div>

          {/* VALUE 2: Build by Learning */}
          <div ref={value2Ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center scroll-reveal scroll-reveal-delay-1">
            {/* Visual Mockup - First on desktop */}
            <div className="md:order-1 bg-oxford-blue/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm font-bold">📋 SOP: Employee Onboarding</span>
                <span className="text-white/50 text-xs">บริษัท AI Solutions จำกัด</span>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-turquoise text-xs font-semibold mb-1">ขั้นตอนที่ 1</p>
                  <p className="text-white/70 text-sm">เตรียมเอกสารและ account — HR + IT</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-turquoise text-xs font-semibold mb-1">ขั้นตอนที่ 2</p>
                  <p className="text-white/70 text-sm">ปฐมนิเทศ Day 1 — Manager</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-turquoise text-xs font-semibold mb-1">ขั้นตอนที่ 3</p>
                  <p className="text-white/70 text-sm">Training Plan สัปดาห์ 1-4 — Buddy</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-white/50 text-xs">Quality Score</span>
                <span className="text-turquoise font-bold">92/100</span>
              </div>
            </div>

            {/* Text - Second on desktop */}
            <div className="md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-turquoise/20 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-turquoise" />
                </div>
                <span className="text-turquoise text-sm font-semibold uppercase tracking-wide">VALUE 2</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
                ได้เครื่องมือจริง
                <br />
                ไม่ใช่แค่ความรู้
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                ทุกเกมจบแล้วได้ deliverables ที่ใช้งานได้จริง —
                SOP, Prompt Library, Workflow, Content Template —
                ไม่ต้องจ้าง consultant แยก เพราะพนักงานสร้างเองผ่านการเรียน
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">📋 SOP Machine</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🔧 Prompt Armory</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🏭 Content Factory</span>
              </div>
            </div>
          </div>

          {/* VALUE 3: Prove by Using */}
          <div ref={value3Ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center scroll-reveal scroll-reveal-delay-2">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-tennessee/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-tennessee" />
                </div>
                <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">VALUE 3</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
                HR วัดผลได้
                <br />
                ทุกมิติ ทุกคน
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                ไม่ต้อง "เชื่อ" ว่า training มีประโยชน์ — Dashboard แสดงให้เห็นชัดว่า
                ใครเรียนจบ ใครเก่งขึ้น ทีมไหน active ทีมไหนต้อง follow up —
                พร้อม data ที่เอาไป report board ได้ทันที
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">📊 Skill Assessment</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">📈 Usage Analytics</span>
                <span className="bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm">🔍 Gap Analysis</span>
              </div>
            </div>

            {/* Visual Mockup - Dashboard */}
            <div className="bg-oxford-blue/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm font-bold">📊 HR Dashboard</span>
                <span className="text-white/50 text-xs">บริษัท AI Solutions จำกัด</span>
              </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-tennessee text-xl font-bold">24/30</p>
                  <p className="text-white/50 text-xs">Active Users</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-green-400 text-xl font-bold">85%</p>
                  <p className="text-white/50 text-xs">Completion</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-turquoise text-xl font-bold">+31%</p>
                  <p className="text-white/50 text-xs">Skill Δ</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-white text-xl font-bold">156</p>
                  <p className="text-white/50 text-xs">Assets</p>
                </div>
              </div>
              {/* Skill Bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs w-20">Prompt สร้าง</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-tennessee rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs w-20">Bug ตรวจจับ</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-turquoise rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs w-20">SOP สร้าง</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-green-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripleValueSection;
