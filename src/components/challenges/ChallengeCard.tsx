import React from 'react';
import { Minimize2, TrendingUp, Wrench, Hammer, Play, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChallengeMode, ChallengeDifficulty, ChallengeProgress } from './types';
import { DIFFICULTY_COLORS, MODE_COLORS } from './types';

interface ChallengeCardProps {
  mode: ChallengeMode;
  title: string;
  subtitle: string;
  description: string;
  goal: string;
  difficulty: ChallengeDifficulty;
  progress: ChallengeProgress;
  totalChallenges: number;
  isLocked?: boolean;
  unlockCondition?: string;
  onPlay: () => void;
}

const MODE_ICONS: Record<ChallengeMode, React.ElementType> = {
  minimize: Minimize2,
  maximize: TrendingUp,
  fix: Wrench,
  build: Hammer,
};

const MODE_TITLES: Record<ChallengeMode, string> = {
  minimize: 'Minimize',
  maximize: 'Maximize',
  fix: 'Fix',
  build: 'Build',
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  mode,
  subtitle,
  description,
  goal,
  difficulty,
  progress,
  totalChallenges,
  isLocked = false,
  unlockCondition,
  onPlay,
}) => {
  const Icon = MODE_ICONS[mode];
  const modeColor = MODE_COLORS[mode];
  const difficultyColor = DIFFICULTY_COLORS[difficulty];
  
  const completedCount = progress.completed.length;
  const progressPercent = (completedCount / totalChallenges) * 100;
  const bestScore = Object.values(progress.scores).length > 0 
    ? Math.max(...Object.values(progress.scores)) 
    : null;

  const colorClasses = {
    turquoise: {
      border: 'border-turquoise',
      text: 'text-turquoise',
      bg: 'bg-turquoise',
      bgLight: 'bg-turquoise/20',
      hover: 'hover:border-turquoise/80 hover:shadow-turquoise/20',
    },
    tennessee: {
      border: 'border-tennessee',
      text: 'text-tennessee',
      bg: 'bg-tennessee',
      bgLight: 'bg-tennessee/20',
      hover: 'hover:border-tennessee/80 hover:shadow-tennessee/20',
    },
  }[modeColor];

  return (
    <div
      className={cn(
        'relative bg-oxford border-2 rounded-[20px] p-7 transition-all duration-300',
        colorClasses.border,
        !isLocked && `${colorClasses.hover} hover:-translate-y-1 hover:shadow-xl cursor-pointer`,
        isLocked && 'opacity-60'
      )}
    >
      {/* Background decoration */}
      <div 
        className={cn(
          'absolute inset-0 rounded-[18px] opacity-5',
          modeColor === 'turquoise' ? 'bg-gradient-to-br from-turquoise to-transparent' : 'bg-gradient-to-br from-tennessee to-transparent'
        )} 
      />

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-rootbeer/80 rounded-[18px] flex flex-col items-center justify-center z-10">
          <Lock className="h-16 w-16 text-rackley mb-4" />
          <p className="text-rackley text-sm text-center px-4">{unlockCondition}</p>
        </div>
      )}

      <div className="relative z-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Icon className={cn('h-12 w-12', colorClasses.text)} />
          <span className={cn('px-3 py-1 rounded-full text-xs font-medium', difficultyColor.text, difficultyColor.bg)}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn('text-2xl font-bold mb-1', colorClasses.text)}>
          {MODE_TITLES[mode]}
        </h3>
        <p className="text-white text-sm font-medium mb-2">{subtitle}</p>
        <p className="text-rackley text-sm">{description}</p>

        {/* Goal box */}
        <div className="bg-rootbeer rounded-lg p-3 mt-4">
          <p className="text-white text-sm">🎯 {goal}</p>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-rackley mb-2">
            <span>Progress</span>
            <span>{completedCount}/{totalChallenges} challenges</span>
          </div>
          <Progress 
            value={progressPercent} 
            className={cn('h-2 bg-rootbeer', `[&>div]:${colorClasses.bg}`)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <span className={cn('text-sm', colorClasses.text)}>
            🏆 Best: {bestScore ? `${bestScore}/100` : '--'}
          </span>
          <Button
            onClick={onPlay}
            disabled={isLocked}
            className={cn(
              'font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-transform',
              !isLocked && 'hover:scale-105',
              modeColor === 'turquoise' 
                ? 'bg-turquoise text-oxford hover:bg-turquoise/90' 
                : 'bg-tennessee text-white hover:bg-tennessee/90'
            )}
          >
            <Play className="h-4 w-4" />
            เริ่มเล่น
          </Button>
        </div>
      </div>
    </div>
  );
};
