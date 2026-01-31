import React from 'react';
import { Check, X, Flame, Gift, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const STREAK_MILESTONES = [
  { days: 3, bonus: '+10% XP', icon: '🔥' },
  { days: 7, bonus: '+25% XP', icon: '⭐' },
  { days: 14, bonus: '+50% XP', icon: '🌟' },
  { days: 30, bonus: '+100% XP', icon: '💎' },
];

interface DailyStreakProps {
  streak?: number;
}

const DailyStreak: React.FC<DailyStreakProps> = ({ streak = 5 }) => {
  // Get last 7 days activity
  const today = new Date().getDay();
  const activityDays = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today - 6 + i + 7) % 7;
    const isActive = i >= 7 - Math.min(streak, 7);
    const isToday = i === 6;
    return { day: DAYS[dayIndex], isActive, isToday };
  });

  // Find milestones
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak);
  const currentMilestone = [...STREAK_MILESTONES].reverse().find(m => m.days <= streak);
  const longestStreak = Math.max(streak, 12); // Mock longest streak

  return (
    <Card className="bg-card border-tennessee/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tennessee/20 rounded-xl">
              <Flame className="w-6 h-6 text-tennessee" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Daily Streak</h3>
              <p className="text-sm text-rackley">เล่นทุกวันเพื่อ Bonus!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-tennessee">{streak}</p>
            <p className="text-xs text-rackley">วันติดต่อกัน</p>
          </div>
        </div>

        {/* Week Calendar */}
        <div className="flex gap-2 mb-6">
          {activityDays.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div 
                className={cn(
                  "w-full aspect-square rounded-lg flex items-center justify-center mb-1 transition-all",
                  day.isActive 
                    ? "bg-tennessee text-foreground" 
                    : "bg-background text-rackley",
                  day.isToday && "ring-2 ring-turquoise ring-offset-2 ring-offset-card"
                )}
              >
                {day.isActive ? (day.isToday ? '🔥' : <Check className="w-4 h-4" />) : '○'}
              </div>
              <p className="text-xs text-rackley">{day.day}</p>
            </div>
          ))}
        </div>

        {/* Current Bonus */}
        {currentMilestone && (
          <div className="p-3 bg-tennessee/10 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentMilestone.icon}</span>
              <span className="text-sm text-foreground">Active Bonus:</span>
            </div>
            <span className="text-tennessee font-semibold">{currentMilestone.bonus}</span>
          </div>
        )}

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="p-3 bg-background rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rackley" />
              <span className="text-sm text-rackley">
                อีก {nextMilestone.days - streak} วัน:
              </span>
            </div>
            <span className="text-turquoise font-semibold">{nextMilestone.bonus}</span>
          </div>
        )}

        {/* Longest Streak */}
        <div className="mt-4 pt-4 border-t border-rackley/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rackley text-sm">
            <Star className="w-4 h-4" />
            <span>Best Streak:</span>
          </div>
          <span className="text-foreground font-semibold">{longestStreak} วัน</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyStreak;
