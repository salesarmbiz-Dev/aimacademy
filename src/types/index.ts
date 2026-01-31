export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface UserStats {
  level: number;
  currentXp: number;
  totalXpForNextLevel: number;
  experimentsCount: number;
  challengesCompleted: number;
  insightsDiscovered: number;
}

export interface UserState {
  profile: UserProfile | null;
  stats: UserStats;
  badges: string[];
  loading: boolean;
}

export interface Experiment {
  id: string;
  prompt: string;
  result: string;
  timestamp: string;
}

export interface ChallengeRecord {
  id: string;
  type: 'minimize' | 'maximize' | 'fix' | 'build';
  completed_at: string;
  score: number;
}

export interface Insight {
  id: string;
  content: string;
  discovered_at: string;
}

export interface ProgressState {
  experiments: Experiment[];
  challenges: {
    minimize: ChallengeRecord[];
    maximize: ChallengeRecord[];
    fix: ChallengeRecord[];
    build: ChallengeRecord[];
  };
  insights: Insight[];
  lastActivity: string | null;
}
