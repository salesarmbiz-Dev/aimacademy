import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type TabId = 'games' | 'deliverables' | 'dashboard';

const PlatformPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('games');
  const headerRef = useScrollReveal();
  const contentRef = useScrollReveal();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'games', label: '🎮 เกม' },
    { id: 'deliverables', label: '📋 Deliverables' },
    { id: 'dashboard', label: '📊 Dashboard' },
  ];

  return (
    <section id="platform-preview" className="bg-background py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10 scroll-reveal">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-3">
            ภาพจริงจาก Platform
          </p>
          <h2 className="text-foreground text-2xl md:text-4xl font-bold mb-4">
            ดูว่าพนักงานจะเจออะไร
          </h2>
          <p className="text-muted-foreground text-lg">
            ตัวอย่างหน้าจอจริงจาก AIM Academy — ไม่ใช่ mockup
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-turquoise ${
                activeTab === tab.id
                  ? 'bg-oxford-blue text-white'
                  : 'bg-oxford-blue/10 text-oxford-blue hover:bg-oxford-blue/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="scroll-reveal">
          <div className="bg-oxford-blue rounded-2xl p-6 md:p-8 min-h-[400px] transition-opacity duration-200">
            {activeTab === 'games' && <GamesPreview />}
            {activeTab === 'deliverables' && <DeliverablesPreview />}
            {activeTab === 'dashboard' && <DashboardPreview />}
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          ☝️ นี่คือตัวอย่าง — Platform จริงมีเกมและฟีเจอร์มากกว่านี้
        </p>
      </div>
    </section>
  );
};

const GamesPreview: React.FC = () => (
  <div className="animate-fade-in">
    <div className="text-white text-lg font-bold mb-6">🎮 ศูนย์ฝึก AI</div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Game Card 1 - Completed */}
      <div className="bg-white/10 rounded-xl p-5">
        <div className="text-3xl mb-3">🎯</div>
        <h4 className="text-white font-bold mb-2">Spot the Difference</h4>
        <p className="text-green-400 text-sm mb-3">✅ จบแล้ว — 85 คะแนน</p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-green-400 rounded-full" />
        </div>
      </div>

      {/* Game Card 2 - In Progress */}
      <div className="bg-white/10 rounded-xl p-5">
        <div className="text-3xl mb-3">🧱</div>
        <h4 className="text-white font-bold mb-2">Prompt Lego</h4>
        <p className="text-tennessee text-sm mb-3">🔄 กำลังเล่น — 60%</p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[60%] h-full bg-tennessee rounded-full" />
        </div>
      </div>

      {/* Game Card 3 - Locked */}
      <div className="bg-white/5 rounded-xl p-5 opacity-60">
        <div className="text-3xl mb-3 grayscale">🔧</div>
        <h4 className="text-white/60 font-bold mb-2">Prompt Debugger</h4>
        <p className="text-white/40 text-sm mb-3">🔒 ต้องผ่าน SET 1 ก่อน</p>
        <div className="w-full h-2 bg-white/10 rounded-full" />
      </div>
    </div>
  </div>
);

const DeliverablesPreview: React.FC = () => (
  <div className="animate-fade-in">
    <div className="text-white text-lg font-bold mb-6">📚 คลังความรู้ของฉัน</div>
    <div className="space-y-3">
      {/* Asset Row 1 */}
      <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">📝</span>
          <div>
            <h4 className="text-white font-medium">Content Calendar Prompt</h4>
            <p className="text-white/50 text-sm">จาก Prompt Lego</p>
          </div>
        </div>
        <div className="text-tennessee font-bold">Score 88</div>
      </div>

      {/* Asset Row 2 */}
      <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">📋</span>
          <div>
            <h4 className="text-white font-medium">SOP: Employee Onboarding</h4>
            <p className="text-white/50 text-sm">จาก SOP Machine</p>
          </div>
        </div>
        <div className="text-turquoise font-bold">Score 92</div>
      </div>

      {/* Asset Row 3 */}
      <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔍</span>
          <div>
            <h4 className="text-white font-medium">Pattern: Context Setting</h4>
            <p className="text-white/50 text-sm">จาก Spot the Diff</p>
          </div>
        </div>
        <div className="text-white/70 font-bold">Score 78</div>
      </div>
    </div>
  </div>
);

const DashboardPreview: React.FC = () => (
  <div className="animate-fade-in">
    <div className="flex items-center justify-between mb-6">
      <span className="text-white text-lg font-bold">📊 HR Dashboard</span>
      <span className="text-white/50 text-sm">บริษัท AI Solutions จำกัด</span>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/10 rounded-xl p-4 text-center">
        <p className="text-tennessee text-2xl font-bold">24/30</p>
        <p className="text-white/50 text-sm">Active Users</p>
      </div>
      <div className="bg-white/10 rounded-xl p-4 text-center">
        <p className="text-green-400 text-2xl font-bold">85%</p>
        <p className="text-white/50 text-sm">Completion</p>
      </div>
      <div className="bg-white/10 rounded-xl p-4 text-center">
        <p className="text-turquoise text-2xl font-bold">+31%</p>
        <p className="text-white/50 text-sm">Skill Δ</p>
      </div>
      <div className="bg-white/10 rounded-xl p-4 text-center">
        <p className="text-white text-2xl font-bold">156</p>
        <p className="text-white/50 text-sm">Assets Created</p>
      </div>
    </div>

    {/* Mini Table */}
    <div className="bg-white/5 rounded-xl overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-3 text-white/50 text-xs font-medium border-b border-white/10">
        <span>ชื่อ</span>
        <span>Progress</span>
        <span>Skill Δ</span>
        <span>Status</span>
      </div>
      <div className="grid grid-cols-4 gap-4 p-3 text-white text-sm border-b border-white/5">
        <span>สมชาย</span>
        <span>100%</span>
        <span className="text-green-400">+45%</span>
        <span className="text-green-400">🟢 Active</span>
      </div>
      <div className="grid grid-cols-4 gap-4 p-3 text-white text-sm border-b border-white/5">
        <span>สมหญิง</span>
        <span>80%</span>
        <span className="text-turquoise">+28%</span>
        <span className="text-green-400">🟢 Active</span>
      </div>
      <div className="grid grid-cols-4 gap-4 p-3 text-white text-sm">
        <span>สมศักดิ์</span>
        <span>45%</span>
        <span className="text-yellow-400">+12%</span>
        <span className="text-yellow-400">🟡 At Risk</span>
      </div>
    </div>
  </div>
);

export default PlatformPreviewSection;
