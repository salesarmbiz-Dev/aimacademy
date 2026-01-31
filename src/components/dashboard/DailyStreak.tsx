import React from 'react';
import { Check, X } from 'lucide-react';

const DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

interface DayStatus {
  status: 'completed' | 'today' | 'future' | 'missed';
}

// Mock data: Last 5 days completed, today active, tomorrow future
const getMockStreak = (): DayStatus[] => {
  return [
    { status: 'completed' },
    { status: 'completed' },
    { status: 'completed' },
    { status: 'completed' },
    { status: 'completed' },
    { status: 'today' },
    { status: 'future' },
  ];
};

interface DailyStreakProps {
  streak?: number;
}

const DailyStreak: React.FC<DailyStreakProps> = ({ streak = 5 }) => {
  const days = getMockStreak();
  const daysToMilestone = 7 - streak;

  return (
    <div className="bg-card rounded-2xl p-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-lg font-semibold">Daily Streak 🔥</h2>
        <span className="text-tennessee text-2xl font-bold">{streak} วัน</span>
      </div>

      {/* Week View */}
      <div className="flex justify-between gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                day.status === 'completed'
                  ? 'bg-tennessee'
                  : day.status === 'today'
                  ? 'bg-turquoise animate-pulse'
                  : day.status === 'missed'
                  ? 'bg-root-beer border border-rackley/30'
                  : 'bg-root-beer border border-rackley/30'
              }`}
            >
              {day.status === 'completed' && <Check className="h-5 w-5 text-foreground" />}
              {day.status === 'missed' && <X className="h-4 w-4 text-rackley/50" />}
              {day.status === 'today' && <span className="w-2 h-2 bg-oxford-blue rounded-full" />}
            </div>
            <span className="text-rackley text-xs mt-2">{DAYS[index]}</span>
          </div>
        ))}
      </div>

      {/* Motivation Text */}
      <p className="text-rackley text-sm mt-4 text-center">
        {streak > 0 ? (
          <>
            ทำต่อไป! อีก {daysToMilestone} วันจะได้ Badge:{' '}
            <span className="text-turquoise">Week Warrior 🏅</span>
          </>
        ) : (
          <span className="text-tennessee">เริ่มสร้าง Streak วันนี้เลย!</span>
        )}
      </p>
    </div>
  );
};

export default DailyStreak;
