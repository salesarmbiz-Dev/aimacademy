import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Challenge } from './types';
import { MODE_COLORS } from './types';

interface ChallengeHeaderProps {
  challenge: Challenge;
  currentScore: number;
  attempts: number;
  timeRemaining: number | null;
  onBack: () => void;
}

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  challenge,
  currentScore,
  attempts,
  timeRemaining,
  onBack,
}) => {
  const [displayTime, setDisplayTime] = useState<string>('');
  const modeColor = MODE_COLORS[challenge.mode];

  useEffect(() => {
    if (timeRemaining === null) {
      setDisplayTime('');
      return;
    }

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [timeRemaining]);

  const timeWarning = timeRemaining !== null && timeRemaining < 60;
  const timeCritical = timeRemaining !== null && timeRemaining < 30;

  const borderColorClass = modeColor === 'turquoise' ? 'border-turquoise' : 'border-tennessee';
  const badgeBgClass = modeColor === 'turquoise' ? 'bg-turquoise/20 text-turquoise' : 'bg-tennessee/20 text-tennessee';

  return (
    <div className={cn('bg-oxford border-b-2 px-6 py-4 sticky top-0 z-20', borderColorClass)}>
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rackley hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">กลับ</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase', badgeBgClass)}>
              {challenge.mode}
            </span>
            <h1 className="text-white font-semibold">
              Challenge: {challenge.title}
            </h1>
          </div>
        </div>

        {/* Center - Timer */}
        {challenge.timeLimit && displayTime && (
          <div className={cn(
            'flex items-center gap-2 font-mono',
            timeCritical ? 'text-red-500 animate-pulse' : timeWarning ? 'text-tennessee animate-pulse' : 'text-white'
          )}>
            <Clock className="h-5 w-5" />
            <span className="text-2xl font-bold">{displayTime}</span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-turquoise" />
            <span className="text-rackley text-sm">เป้าหมาย:</span>
            <span className="text-turquoise font-semibold">{challenge.targetScore}+</span>
          </div>
          
          <div className="text-rackley text-sm">
            ปัจจุบัน: <span className="text-white font-semibold">{currentScore}</span>
          </div>
          
          <div className="text-rackley text-sm">
            ครั้งที่: <span className="text-white">{attempts}/{challenge.maxAttempts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
