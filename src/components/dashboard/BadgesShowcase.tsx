import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
}

const mockBadges: Badge[] = [
  { id: 'first-build', name: 'First Build', description: 'สร้าง Prompt แรก', icon: '🔧', color: 'bg-amber-700', earned: true },
  { id: 'experimenter', name: 'Experimenter', description: 'ทดลอง 20 ครั้ง', icon: '🧪', color: 'bg-blue-500', earned: true },
  { id: 'minimalist', name: 'Minimalist', description: 'ลดเหลือ 3 Blocks', icon: '✨', color: 'bg-gray-400', earned: false },
  { id: 'maximizer', name: 'Maximizer', description: 'Score 95+', icon: '🚀', color: 'bg-yellow-500', earned: false },
  { id: 'lego-legend', name: 'Lego Legend', description: 'Complete ทุก Challenge', icon: '👑', color: 'bg-purple-500', earned: false },
];

const BadgesShowcase: React.FC = () => {
  const earnedCount = mockBadges.filter((b) => b.earned).length;

  return (
    <div className="bg-card rounded-2xl p-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-lg font-semibold">🏆 Badges ของคุณ</h2>
        <span className="text-rackley text-sm">
          {earnedCount}/{mockBadges.length}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
        {mockBadges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center min-w-[80px] ${
              !badge.earned ? 'opacity-50 grayscale' : ''
            }`}
          >
            <div className={`relative w-12 h-12 ${badge.color} rounded-full flex items-center justify-center text-2xl`}>
              {badge.icon}
              {!badge.earned && (
                <div className="absolute inset-0 bg-oxford-blue/60 rounded-full flex items-center justify-center">
                  <Lock className="h-4 w-4 text-rackley" />
                </div>
              )}
            </div>
            <span className="text-foreground text-xs mt-2 text-center font-medium">{badge.name}</span>
          </div>
        ))}
      </div>

      <Link
        to="/profile"
        className="block text-turquoise text-sm text-center mt-4 hover:underline"
      >
        ดู Badges ทั้งหมด
      </Link>
    </div>
  );
};

export default BadgesShowcase;
