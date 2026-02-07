// Note: 'coming_soon' is a frontend-only status, not stored in DB
export type GameStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type GameStatusDisplay = GameStatus | 'coming_soon';

export interface GameProgress {
  game_id: string;
  best_score: number;
  attempts: number;
  total_time_seconds: number;
  xp_earned: number;
  status: GameStatus;
  first_played_at: string | null;
  last_played_at: string | null;
}

export interface GameDefinition {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  route: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  set: 1 | 2 | 3;
  isBuilt: boolean;
  unlockRequirement?: {
    gameId: string;
    minScore: number;
  };
}

export interface SetDefinition {
  number: 1 | 2 | 3;
  title: string;
  titleTh: string;
  subtitle: string;
  badgeColor: string;
  unlockMessage?: string;
}
