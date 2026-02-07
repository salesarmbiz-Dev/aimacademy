import React from 'react';
import { GameCard } from './GameCard';
import { useGameProgress } from '@/hooks/useGameProgress';
import type { GameDefinition, SetDefinition } from './types';
import { cn } from '@/lib/utils';

interface GameSetSectionProps {
  set: SetDefinition;
  games: GameDefinition[];
}

export const GameSetSection: React.FC<GameSetSectionProps> = ({ set, games }) => {
  const { progress, getGameStatus, isGameUnlocked, getCompletedCount } = useGameProgress();
  
  const completedInSet = games.filter(game => {
    const gameProgress = progress.get(game.id);
    return gameProgress?.status === 'completed';
  }).length;

  const progressPercent = games.length > 0 ? (completedInSet / games.length) * 100 : 0;

  return (
    <section className="mb-12 md:mb-16">
      {/* SET Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("px-3 py-1 rounded-lg text-sm font-bold", set.badgeColor)}>
            SET {set.number}
          </span>
          <h2 className="text-2xl font-bold text-oxford">{set.title}</h2>
        </div>
        <p className="text-base text-rackley mb-3">{set.subtitle}</p>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-xs h-2 bg-oxford/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-tennessee to-turquoise rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm text-rackley">
            {completedInSet}/{games.length} เกมจบแล้ว
          </span>
        </div>

        {/* Lock message for SET 2 and 3 */}
        {set.unlockMessage && (
          <p className="text-sm text-rackley/80 mt-2 italic">{set.unlockMessage}</p>
        )}
      </div>

      {/* Game Cards Grid */}
      <div className={cn(
        "grid gap-4",
        set.number === 3 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {games.map(game => {
          const gameProgress = progress.get(game.id);
          const status = getGameStatus(game.id);
          const unlocked = isGameUnlocked(game.id, game.unlockRequirement);

          return (
            <GameCard
              key={game.id}
              game={game}
              progress={gameProgress}
              status={status}
              isUnlocked={unlocked}
            />
          );
        })}
      </div>
    </section>
  );
};
