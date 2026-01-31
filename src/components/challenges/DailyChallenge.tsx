import React, { useState, useEffect } from 'react';
import { Star, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyChallengeProps {
  onPlay: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ onPlay }) => {
  const [timeRemaining, setTimeRemaining] = useState('14:32:05');

  useEffect(() => {
    // Mock countdown timer
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-oxford to-turquoise/10 border-2 border-turquoise rounded-2xl p-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-turquoise/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-turquoise" />
            <h3 className="text-turquoise text-xl font-bold">Daily Challenge</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-tennessee">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{timeRemaining}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-tennessee/20 text-tennessee flex items-center gap-1">
              <Zap className="h-3 w-3" />
              2x XP!
            </span>
          </div>
        </div>

        {/* Challenge info */}
        <div className="mb-4">
          <p className="text-white font-medium">Today: Minimize Challenge</p>
          <p className="text-rackley text-sm mt-1">
            ลด Prompt 'Product Launch Email' ให้เหลือ 3 Blocks
          </p>
        </div>

        {/* Reward */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-tennessee font-semibold">+200 XP (2x bonus)</span>
          <Button
            onClick={onPlay}
            className="bg-tennessee text-white hover:bg-tennessee/90 font-semibold px-6"
          >
            เล่น Daily Challenge
          </Button>
        </div>
      </div>
    </div>
  );
};
