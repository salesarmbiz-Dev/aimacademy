import React from 'react';

const GameSystemSection: React.FC = () => {
  const sets = [
    {
      badge: { text: 'All Employees', style: 'bg-rackley/20 text-rackley' },
      meta: '3 เกม • 30-60 นาที',
      title: 'SET 1: Prompt Engineering Fundamentals',
      description: 'สร้างพื้นฐานที่แข็งแรง — ฝึกตาให้เห็นความต่าง เรียนรู้โครงสร้าง prompt และแก้ปัญหาได้',
      games: ['🎯 Spot the Difference', '🧱 Prompt Lego', '🔧 Prompt Debugger'],
      highlight: false,
    },
    {
      badge: { text: 'High Performers', style: 'bg-tennessee/10 text-tennessee' },
      meta: '3 เกม • 45-90 นาที',
      title: 'SET 2: One-Person BU Era',
      description: 'AI ช่วยให้คนเดียวทำงานเท่าทั้ง department — Marketing, Customer Success, Research',
      games: ['📣 Solo Marketing', '🤝 One-Person CS', '🔍 AI Research Assistant'],
      highlight: false,
    },
    {
      badge: { text: 'Teams & Departments', style: 'bg-tennessee text-white' },
      meta: '6+ เกม • 60-120 นาที',
      title: 'SET 3: Value-First Games — The Differentiator',
      description: 'ทุกเกมสร้าง deliverables จริง — ไม่ใช่เรียนเพื่อรู้ แต่เรียนเพื่อได้ของกลับไปใช้งาน',
      games: ['📋 SOP Machine', '⚙️ Workflow Forge', '🗃️ Prompt Armory', '🎯 Decision Playbook', '✍️ Content Factory', '👋 AI Onboarding'],
      highlight: true,
      footer: 'ทุกเกมจาก SET 3 ได้ deliverables มูลค่า ฿50-500K กลับไปใช้งานทันที',
    },
  ];

  return (
    <section id="game-system" className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            ระบบเกมที่ออกแบบมาเพื่อองค์กร
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            3 SETs — จากพื้นฐาน สู่การสร้างมูลค่าจริง
          </h2>
        </div>

        {/* Sets */}
        <div className="space-y-2 max-w-4xl mx-auto">
          {sets.map((set, index) => (
            <React.Fragment key={index}>
              {/* Set Card */}
              <div
                className={`bg-card rounded-2xl p-6 md:p-8 border ${
                  set.highlight 
                    ? 'border-tennessee/50' 
                    : 'border-border/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${set.badge.style}`}>
                    {set.badge.text}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {set.meta}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-foreground text-xl md:text-2xl font-bold mb-3">
                  {set.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  {set.description}
                </p>

                {/* Games */}
                <div className="flex flex-wrap gap-2">
                  {set.games.map((game, gameIndex) => (
                    <span
                      key={gameIndex}
                      className="bg-oxford-blue/50 text-foreground px-4 py-2 rounded-xl text-sm"
                    >
                      {game}
                    </span>
                  ))}
                </div>

                {/* Footer Note (for SET 3) */}
                {set.footer && (
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <p className="text-tennessee font-semibold text-sm">
                      💡 {set.footer}
                    </p>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < sets.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-border/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameSystemSection;
