import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const DashboardPreviewSection: React.FC = () => {
  const headerRef = useScrollReveal();
  const mockupRef = useScrollReveal();
  const modulesRef = useScrollReveal();

  const stats = [
    { number: '24/30', label: 'Active Users' },
    { number: '72', label: 'Avg Score' },
    { number: '156', label: 'Assets Created' },
    { number: '85%', label: 'Completion' },
  ];

  const skills = [
    { name: 'Role Setting', percentage: 78 },
    { name: 'Context', percentage: 65 },
    { name: 'Task', percentage: 82 },
    { name: 'Format', percentage: 71 },
    { name: 'Constraint', percentage: 45 },
  ];

  const modules = [
    '📊 Skill Assessment',
    '📈 Usage Analytics',
    '⭐ Quality Scoring',
    '🗺️ Competency Map',
    '🔍 Gap Analysis',
    '🛡️ Compliance Report',
  ];

  return (
    <section id="dashboard" className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 scroll-reveal">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            สำหรับ HR & L&D
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            Dashboard ที่ทำให้ Training วัดผลได้จริง
          </h2>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-4xl mx-auto">
          <div 
            ref={mockupRef} 
            className="bg-card rounded-2xl border border-border/30 overflow-hidden shadow-2xl scroll-reveal scroll-reveal-delay-1 animate-float-gentle"
          >
            {/* Top Bar */}
            <div className="bg-oxford-blue/80 px-6 py-4 flex justify-between items-center border-b border-border/30">
              <span className="text-foreground font-semibold">บริษัท AI Solutions จำกัด</span>
              <span className="text-muted-foreground text-sm">30 วันล่าสุด ▾</span>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-oxford-blue/50 rounded-xl p-4">
                    <p className="text-tennessee text-2xl font-bold">{stat.number}</p>
                    <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="bg-oxford-blue/30 rounded-xl p-6">
                <h4 className="text-foreground font-semibold mb-4">Skill Progress by Team</h4>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-28 flex-shrink-0">
                        {skill.name}
                      </span>
                      <div className="flex-1 h-3 bg-oxford-blue/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tennessee rounded-full transition-all duration-500"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <span className="text-foreground text-sm font-medium w-12 text-right">
                        {skill.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Module Pills */}
          <div ref={modulesRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 scroll-reveal scroll-reveal-delay-2">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-card border border-border/30 rounded-xl px-4 py-3 text-center text-sm text-foreground hover-scale cursor-default"
              >
                {module}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
