import React from 'react';
import { Star, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: number;
  bugCount: number;
  stars: number;
  status: 'completed' | 'unlocked' | 'locked';
  bestScore?: number;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  bugCount,
  stars,
  status,
  bestScore,
  onClick,
}) => {
  const isClickable = status !== 'locked';

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        'relative rounded-xl p-4 border-2 transition-all duration-200 text-left',
        status === 'completed' && 'bg-green-50 border-green-200 hover:border-green-300',
        status === 'unlocked' && 'bg-card border-tennessee shadow-md hover:shadow-lg hover:scale-[1.02]',
        status === 'locked' && 'bg-muted/50 border-border/50 opacity-60 cursor-not-allowed',
      )}
    >
      {/* Status icon */}
      <div className="absolute top-2 right-2">
        {status === 'completed' && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
        {status === 'locked' && (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Level number */}
      <div className={cn(
        'text-3xl font-bold mb-2',
        status === 'completed' && 'text-green-700',
        status === 'unlocked' && 'text-tennessee',
        status === 'locked' && 'text-muted-foreground',
      )}>
        {level}
      </div>

      {/* Bug count */}
      <p className="text-sm text-muted-foreground mb-2">
        {bugCount} Bug{bugCount > 1 ? 's' : ''}
      </p>

      {/* Stars */}
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i <= stars
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>

      {/* Best score */}
      {status === 'completed' && bestScore !== undefined && (
        <p className="text-xs text-green-600 font-medium">
          Best: {bestScore}%
        </p>
      )}
    </button>
  );
};
