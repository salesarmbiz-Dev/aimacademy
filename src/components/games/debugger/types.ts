import type { BugType } from '@/data/debuggerLevels';

export interface LevelProgress {
  level: number;
  score: number;
  stars: number;
  completed: boolean;
  bugsFound: number;
  typesCorrect: number;
  fixQualityScore: number;
  timeSeconds: number;
  xpEarned: number;
}

export interface SelectedBug {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  identifiedType: BugType | null;
  isCorrect: boolean | null;
}

export interface GameState {
  currentStep: 'read' | 'identify' | 'fix' | 'result';
  selectedBugs: SelectedBug[];
  userFixes: Record<string, string>;
  wrongAttempts: Record<string, number>;
  timeElapsed: number;
  hintsUsed: number;
}
