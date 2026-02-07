import React from 'react';

const badges = [
  { icon: '🔧', name: 'First Build', description: 'สร้าง Prompt แรก', color: 'bg-amber-700' },
  { icon: '✨', name: 'Minimalist', description: 'ลดเหลือ 3 Blocks แต่ได้ Score 80+', color: 'bg-gray-400' },
  { icon: '👑', name: 'Lego Legend', description: 'Complete ทุก Challenge', color: 'bg-yellow-500' },
];

const xpRewards = [
  { action: 'Experiment conducted', xp: '+15 XP' },
  { action: 'Insight discovered', xp: '+30 XP' },
  { action: 'Challenge completed', xp: '+100 XP' },
  { action: 'Perfect score (95+)', xp: '+50 XP bonus' },
];

const insights = [
  'ROLE คือ Block ที่สำคัญที่สุด ลบไม่ได้',
  'TONE เปลี่ยน = น้ำเสียงเปลี่ยนทั้งหมด',
  'EXAMPLE ช่วยให้ได้หลาย options',
];

const GamificationPreview: React.FC = () => {
  return (
    <section className="bg-oxford-blue py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">Gamification System</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold mt-2">
            เปลี่ยนการเรียนให้เป็นการเสพติด
          </h2>
          <p className="text-muted-foreground text-lg mt-2">XP, Badges, และ Insights ที่สะสมได้</p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Badges Column */}
          <div className="bg-root-beer/30 rounded-2xl p-6">
            <h3 className="text-foreground font-bold text-xl mb-6">🏆 Badges</h3>
            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${badge.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{badge.name}</p>
                    <p className="text-muted-foreground text-sm">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP System Column */}
          <div className="bg-root-beer/30 rounded-2xl p-6">
            <h3 className="text-foreground font-bold text-xl mb-6">⚡ XP Rewards</h3>
            <div className="space-y-3 mb-6">
              {xpRewards.map((reward) => (
                <div key={reward.action} className="flex justify-between items-center">
                  <span className="text-foreground text-sm">{reward.action}</span>
                  <span className="text-tennessee font-semibold">{reward.xp}</span>
                </div>
              ))}
            </div>
            
            {/* Level Progress */}
            <div className="bg-oxford-blue rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-tennessee font-semibold">Level 5</span>
                <span className="text-muted-foreground text-sm">2500/3000 XP</span>
              </div>
              <div className="h-2 bg-root-beer rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tennessee rounded-full transition-all duration-1000"
                  style={{ width: '83%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Insights Column */}
          <div className="bg-root-beer/30 rounded-2xl p-6">
            <h3 className="text-foreground font-bold text-xl mb-6">💡 Insights Collection</h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className="bg-root-beer border-l-4 border-tennessee p-4 rounded-r-lg"
                >
                  <p className="text-foreground text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationPreview;
