import React from 'react';
import { Zap, Trophy, FlaskConical, Award } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';

const Dashboard: React.FC = () => {
  const { profile, stats } = useUser();
  const { getStats } = useProgress();
  const progressStats = getStats();

  const statCards = [
    {
      title: 'Level',
      value: stats.level,
      icon: Award,
      borderColor: 'border-turquoise',
      iconColor: 'text-turquoise',
    },
    {
      title: 'XP',
      value: `${stats.currentXp}/${stats.totalXpForNextLevel}`,
      icon: Zap,
      borderColor: 'border-tennessee',
      iconColor: 'text-tennessee',
    },
    {
      title: 'Experiments',
      value: progressStats.totalExperiments,
      icon: FlaskConical,
      borderColor: 'border-rackley',
      iconColor: 'text-rackley',
    },
    {
      title: 'Challenges',
      value: progressStats.totalChallenges,
      icon: Trophy,
      borderColor: 'border-turquoise',
      iconColor: 'text-turquoise',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          สวัสดี, {profile?.name || 'User'}!
        </h1>
        <p className="text-rackley">
          ยินดีต้อนรับกลับมา พร้อมเรียนรู้ AI วันนี้หรือยัง?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`bg-oxford border-2 ${card.borderColor} rounded-lg p-4 md:p-6 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <p className="text-rackley text-sm mb-1">{card.title}</p>
            <p className="text-white text-2xl md:text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Content */}
      <div className="bg-oxford rounded-lg p-8 text-center">
        <span className="inline-block px-4 py-2 bg-tennessee text-white text-sm font-semibold rounded-md mb-4">
          Coming Soon
        </span>
        <h2 className="text-white text-xl font-semibold mb-2">
          เนื้อหาเพิ่มเติมกำลังมา
        </h2>
        <p className="text-rackley">
          กำลังพัฒนาแดชบอร์ดพร้อมสถิติและข้อมูลการเรียนรู้ที่ครบถ้วน
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
