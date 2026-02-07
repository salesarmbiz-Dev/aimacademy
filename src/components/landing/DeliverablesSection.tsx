import React from 'react';

const DeliverablesSection: React.FC = () => {
  const deliverables = [
    { game: 'SOP Machine', deliverable: 'AI-enhanced SOPs 10-20 ชิ้น', value: '฿150-300K' },
    { game: 'Workflow Forge', deliverable: 'Automated workflow blueprints', value: '฿200-400K' },
    { game: 'Prompt Armory', deliverable: 'Org-specific prompt library 50+ ชิ้น', value: '฿100-200K' },
    { game: 'Decision Playbook', deliverable: 'AI decision frameworks', value: '฿150-250K' },
    { game: 'Content Factory', deliverable: 'Content production system', value: '฿100-200K' },
    { game: 'AI Onboarding Builder', deliverable: 'New employee onboarding system', value: '฿80-150K' },
  ];

  return (
    <section id="deliverables" className="bg-oxford-blue py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            สิ่งที่องค์กรได้กลับไป
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            Consultant-Quality Deliverables ในราคา Training
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-card rounded-2xl border border-border/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-oxford-blue/80">
                <th className="text-foreground font-semibold text-sm uppercase tracking-wide text-left px-6 py-4">
                  เกม
                </th>
                <th className="text-foreground font-semibold text-sm uppercase tracking-wide text-left px-6 py-4">
                  Deliverable
                </th>
                <th className="text-foreground font-semibold text-sm uppercase tracking-wide text-right px-6 py-4">
                  มูลค่าเทียบเท่า Consultant
                </th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-border/20 last:border-0 hover:bg-tennessee/5 transition-colors`}
                >
                  <td className="text-foreground px-6 py-4 font-medium">
                    {item.game}
                  </td>
                  <td className="text-muted-foreground px-6 py-4">
                    {item.deliverable}
                  </td>
                  <td className="text-tennessee font-bold px-6 py-4 text-right">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {deliverables.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 border border-border/30"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-foreground font-semibold">{item.game}</h4>
                <span className="text-tennessee font-bold text-sm">{item.value}</span>
              </div>
              <p className="text-muted-foreground text-sm">{item.deliverable}</p>
            </div>
          ))}
        </div>

        {/* Total Value */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            รวมมูลค่า Deliverables ทั้งหมด:{' '}
            <span className="text-tennessee font-bold text-xl">฿780K - ฿1.5M+</span>{' '}
            ต่อองค์กร
          </p>
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
