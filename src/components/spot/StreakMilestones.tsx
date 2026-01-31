import React from 'react';
import { Flame, Check, Lock, Zap, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSpot } from '@/contexts/SpotContext';

interface Milestone {
  streak: number;
  bonus: string;
  bonusPercent: number;
  special?: string;
}

const MILESTONES: Milestone[] = [
  { streak: 3, bonus: '+10%', bonusPercent: 10 },
  { streak: 5, bonus: '+25%', bonusPercent: 25 },
  { streak: 7, bonus: '+50%', bonusPercent: 50 },
  { streak: 10, bonus: '+75%', bonusPercent: 75 },
  { streak: 15, bonus: '+100%', bonusPercent: 100 },
  { streak: 20, bonus: '+150%', bonusPercent: 150, special: 'Special Badge' },
  { streak: 25, bonus: '+200%', bonusPercent: 200, special: 'Legendary Badge' },
];

const StreakMilestones: React.FC = () => {
  const { currentStreak, longestStreak, claimedMilestones = [] } = useSpot();

  const getCurrentBonus = () => {
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (currentStreak >= MILESTONES[i].streak) {
        return MILESTONES[i];
      }
    }
    return null;
  };

  const getNextMilestone = () => {
    for (const milestone of MILESTONES) {
      if (currentStreak < milestone.streak) {
        return milestone;
      }
    }
    return null;
  };

  const currentBonus = getCurrentBonus();
  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone 
    ? Math.min(100, (currentStreak / nextMilestone.streak) * 100)
    : 100;

  return (
    <Card className="bg-card border-rackley/30">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            🔥 STREAK MILESTONES
          </h3>
          {currentBonus && (
            <Badge className="bg-tennessee/20 text-tennessee border-0">
              Active: {currentBonus.bonus} XP
            </Badge>
          )}
        </div>

        {/* Current Streak Display */}
        <div className="bg-oxford-blue rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-tennessee" />
              <span className="text-foreground text-lg font-bold">Current Streak: {currentStreak}</span>
            </div>
            <span className="text-rackley text-sm">Best: {longestStreak} 🏆</span>
          </div>
          
          {nextMilestone && (
            <>
              <Progress value={progressToNext} className="h-2 bg-rackley/30 mb-2" />
              <p className="text-rackley text-xs">
                {nextMilestone.streak - currentStreak} more to {nextMilestone.bonus} bonus
              </p>
            </>
          )}
        </div>

        {/* Milestones List */}
        <div className="space-y-2">
          {MILESTONES.map((milestone) => {
            const isReached = currentStreak >= milestone.streak;
            const isActive = currentStreak >= milestone.streak && 
              (MILESTONES.findIndex(m => m.streak > currentStreak) === -1 || 
               MILESTONES.find(m => m.streak > currentStreak)?.streak !== milestone.streak);

            return (
              <div
                key={milestone.streak}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-tennessee/20 border border-tennessee/50' 
                    : isReached 
                    ? 'bg-accent/10 border border-accent/30'
                    : 'bg-rackley/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isReached ? (
                    <Check className="w-5 h-5 text-accent" />
                  ) : (
                    <Lock className="w-5 h-5 text-rackley" />
                  )}
                  <div>
                    <span className={`font-medium ${isReached ? 'text-foreground' : 'text-rackley'}`}>
                      {milestone.streak} streak
                    </span>
                    {milestone.special && (
                      <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-0 text-xs">
                        {milestone.special}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${isReached ? 'text-tennessee' : 'text-rackley'}`} />
                  <span className={`font-semibold ${isReached ? 'text-tennessee' : 'text-rackley'}`}>
                    {milestone.bonus} XP
                  </span>
                  {isActive && (
                    <Badge className="bg-tennessee text-foreground border-0 text-xs animate-pulse">
                      ACTIVE
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak Shield (Premium feature placeholder) */}
        <div className="mt-4 p-3 bg-rackley/10 rounded-lg border border-dashed border-rackley/30">
          <div className="flex items-center gap-2 text-rackley">
            <Shield className="w-5 h-5" />
            <span className="text-sm">🛡️ Streak Shield - ปกป้อง streak จาก 1 คำตอบผิด</span>
            <Badge className="bg-rackley/20 text-rackley border-0 text-xs ml-auto">
              Coming Soon
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakMilestones;
