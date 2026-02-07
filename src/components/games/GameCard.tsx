import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Puzzle, 
  Bug, 
  Megaphone, 
  Headphones, 
  Search, 
  FileText, 
  GitBranch, 
  Library, 
  Scale, 
  Factory, 
  UserPlus,
  Lock,
  Clock,
  Trophy,
  Star,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameDefinition, GameProgress, GameStatus } from './types';

interface GameCardProps {
  game: GameDefinition;
  progress?: GameProgress;
  status: GameStatus;
  isUnlocked: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Puzzle,
  Bug,
  Megaphone,
  HeadphonesIcon: Headphones,
  Search,
  FileText,
  GitBranch,
  Library,
  Scale,
  Factory,
  UserPlus,
};

const difficultyStars: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const difficultyLabels: Record<string, string> = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

export const GameCard: React.FC<GameCardProps> = ({ game, progress, status, isUnlocked }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[game.icon] || Puzzle;
  
  const isPlayable = isUnlocked && game.isBuilt;
  const isComingSoon = !game.isBuilt;
  const isLocked = !isUnlocked && !isComingSoon;
  
  const hasPlayed = progress && progress.attempts > 0;
  const progressPercent = progress?.best_score || 0;

  const handleClick = () => {
    if (isPlayable) {
      navigate(game.route);
    }
  };

  // COMING SOON State
  if (isComingSoon) {
    return (
      <div className="relative bg-muted/50 rounded-2xl border-2 border-dashed border-border/50 p-5 opacity-75">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 bg-muted rounded-xl flex items-center justify-center grayscale">
            <IconComponent className="w-8 h-8 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 text-lg">🔜</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold text-lg leading-tight">{game.name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{game.descriptionTh}</p>
            <p className="text-muted-foreground/60 text-sm italic mt-3">Coming Soon</p>
          </div>
        </div>
      </div>
    );
  }

  // LOCKED State
  if (isLocked) {
    return (
      <div className="relative bg-muted/30 rounded-2xl border border-border/50 p-5 opacity-75 cursor-not-allowed">
        <div className="absolute top-4 right-4 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center grayscale">
            <IconComponent className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold text-lg leading-tight">{game.name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{game.descriptionTh}</p>
            {game.unlockRequirement && (
              <p className="text-rackley text-sm italic mt-3">
                ปลดล็อกเมื่อจบ {game.unlockRequirement.gameId === 'spot' ? 'Spot the Difference' : 'Prompt Lego'} {game.unlockRequirement.minScore}%+
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PLAYABLE State
  return (
    <div 
      onClick={handleClick}
      className={cn(
        "relative bg-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 cursor-pointer border-l-4 border-tennessee group hover-lift",
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-tennessee/20 to-turquoise/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <IconComponent className="w-8 h-8 text-tennessee" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-foreground font-semibold text-lg leading-tight">{game.name}</h3>
            {/* Difficulty */}
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < difficultyStars[game.difficulty] 
                      ? "text-tennessee fill-tennessee" 
                      : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{game.descriptionTh}</p>

          {/* Meta badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs bg-oxford/10 text-rackley rounded-full px-2 py-1">
              <Clock className="w-3 h-3" />
              {game.duration}
            </span>
            <span className="text-xs text-muted-foreground">
              {difficultyLabels[game.difficulty]}
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Stats */}
      {hasPlayed && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-tennessee" />
              <span className="text-sm text-foreground font-medium">Best: {progressPercent}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">{progress?.xp_earned || 0} XP</span>
            </div>
          </div>
          <div className="w-full h-2 bg-oxford/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-tennessee to-turquoise rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button 
        className={cn(
          "w-full mt-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
          hasPlayed 
            ? "bg-tennessee/90 text-white hover:bg-tennessee"
            : "bg-tennessee text-white hover:bg-tennessee/90"
        )}
      >
        {hasPlayed ? 'เล่นอีกครั้ง' : 'เล่นเลย'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
