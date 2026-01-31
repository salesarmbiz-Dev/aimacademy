import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XPReward {
  label: string;
  xp: number;
}

interface XPCelebrationProps {
  rewards: XPReward[];
  currentXp: number;
  totalXpForNextLevel: number;
  currentLevel: number;
}

const XPCelebration: React.FC<XPCelebrationProps> = ({
  rewards,
  currentXp,
  totalXpForNextLevel,
  currentLevel,
}) => {
  const [visibleRewards, setVisibleRewards] = useState<number>(0);
  const [showTotal, setShowTotal] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  const totalXp = rewards.reduce((sum, r) => sum + r.xp, 0);
  const newXp = currentXp + totalXp;
  const progressPercent = Math.min((newXp / totalXpForNextLevel) * 100, 100);

  useEffect(() => {
    // Stagger reward appearance
    rewards.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRewards(index + 1);
      }, (index + 1) * 200);
    });

    // Show total after all rewards
    setTimeout(() => {
      setShowTotal(true);
    }, rewards.length * 200 + 300);

    // Animate progress bar
    setTimeout(() => {
      setProgressWidth(progressPercent);
    }, rewards.length * 200 + 600);
  }, [rewards.length, progressPercent]);

  return (
    <div className="bg-gradient-to-r from-tennessee to-turquoise rounded-2xl p-6 mt-8 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-foreground" />
        <h3 className="text-foreground text-2xl font-bold">🎉 การทดลองสำเร็จ!</h3>
        <Sparkles className="h-6 w-6 text-foreground" />
      </div>

      {/* XP Breakdown */}
      <div className="bg-oxford-blue/30 rounded-xl p-4 mb-4">
        <div className="space-y-2">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className={`flex items-center justify-between text-foreground transition-all duration-300 ${
                index < visibleRewards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-sm">{reward.label}</span>
              <span className="font-semibold">+{reward.xp} XP</span>
            </div>
          ))}
        </div>

        {showTotal && (
          <>
            <div className="border-t border-foreground/20 mt-3 pt-3">
              <div className="flex items-center justify-between text-foreground">
                <span className="font-semibold">รวม</span>
                <span className="text-3xl font-bold">+{totalXp} XP</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress to Next Level */}
      <div className="bg-oxford-blue/30 rounded-xl p-4">
        <div className="flex items-center justify-between text-foreground text-sm mb-2">
          <span>Level {currentLevel}</span>
          <span>Level {currentLevel + 1}</span>
        </div>
        <div className="h-3 bg-oxford-blue rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <p className="text-foreground/80 text-xs mt-2">
          {newXp} / {totalXpForNextLevel} XP
        </p>
      </div>
    </div>
  );
};

export default XPCelebration;
