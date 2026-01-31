import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSpot } from './SpotContext';
import { useProgress } from './ProgressContext';
import type { UserProfile } from '@/types';

export interface UserStats {
  // Global stats (combined)
  totalXp: number;
  level: number;
  levelTitle: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNextLevel: number;
  
  // Per-game XP
  spotXp: number;
  legoXp: number;
  
  // Legacy compatibility
  currentXp: number;
  totalXpForNextLevel: number;
  
  // Global achievements
  totalBadges: number;
  globalStreak: number;
  
  // Activity
  experimentsCount: number;
  challengesCompleted: number;
  insightsDiscovered: number;
  
  // Rank
  globalRank: number;
  percentile: number;
}

interface UserContextValue {
  profile: UserProfile | null;
  stats: UserStats;
  badges: string[];
  loading: boolean;
  fetchUserData: () => Promise<void>;
  addXp: (amount: number, game?: 'spot' | 'lego') => void;
  unlockBadge: (badgeId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

// Level thresholds: Level N requires sum of (i * 100 + (i-1) * 50) for i from 1 to N-1
const calculateLevel = (totalXp: number): { level: number; xpForCurrent: number; xpForNext: number } => {
  let level = 1;
  let xpRequired = 0;
  let prevXpRequired = 0;
  
  while (true) {
    const xpForThisLevel = level * 100 + (level - 1) * 50;
    if (xpRequired + xpForThisLevel > totalXp) {
      return {
        level,
        xpForCurrent: totalXp - xpRequired,
        xpForNext: xpForThisLevel
      };
    }
    prevXpRequired = xpRequired;
    xpRequired += xpForThisLevel;
    level++;
    
    if (level > 100) break; // Safety cap
  }
  
  return { level: 100, xpForCurrent: 0, xpForNext: 10000 };
};

const getLevelTitle = (level: number): string => {
  if (level <= 5) return 'Beginner';
  if (level <= 10) return 'Learner';
  if (level <= 15) return 'Skilled';
  if (level <= 20) return 'Expert';
  return 'Master';
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isGuestMode } = useAuth();
  
  // Try to get spot and progress context (they might not be available yet)
  let spotXp = 0;
  let spotBadges: string[] = [];
  let spotPatterns: string[] = [];
  let legoInsights: { id: string }[] = [];
  
  try {
    const spotContext = useSpot();
    spotXp = spotContext.gameXp;
    spotBadges = spotContext.unlockedBadges;
    spotPatterns = spotContext.patternsDiscovered;
  } catch {
    // Context not available yet
  }
  
  try {
    const progressContext = useProgress();
    legoInsights = progressContext.insights;
  } catch {
    // Context not available yet
  }
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [legoXp, setLegoXp] = useState(0);
  const [legoBadges, setLegoBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate combined stats
  const totalXp = spotXp + legoXp;
  const { level, xpForCurrent, xpForNext } = calculateLevel(totalXp);
  const levelTitle = getLevelTitle(level);
  const progressToNextLevel = xpForNext > 0 ? (xpForCurrent / xpForNext) * 100 : 0;
  
  // Combine badges from all games
  const allBadges = [...new Set([...spotBadges, ...legoBadges])];
  
  // Calculate global streak (mock for now)
  const globalStreak = 5;
  
  // Mock rank data
  const globalRank = 42;
  const percentile = 85;

  const stats: UserStats = {
    // Global stats
    totalXp,
    level,
    levelTitle,
    xpForCurrentLevel: xpForCurrent,
    xpForNextLevel: xpForNext,
    progressToNextLevel,
    
    // Per-game XP
    spotXp,
    legoXp,
    
    // Legacy compatibility
    currentXp: xpForCurrent,
    totalXpForNextLevel: xpForNext,
    
    // Global achievements
    totalBadges: allBadges.length,
    globalStreak,
    
    // Activity
    experimentsCount: 23,
    challengesCompleted: 12,
    insightsDiscovered: spotPatterns.length + legoInsights.length,
    
    // Rank
    globalRank,
    percentile,
  };

  const fetchUserData = useCallback(async () => {
    if (!user && !isGuestMode) {
      setLoading(false);
      return;
    }

    // Mock data for now
    const mockProfile: UserProfile = {
      id: user?.id || 'guest',
      name: user?.user_metadata?.name || (isGuestMode ? 'Guest' : 'Demo User'),
      email: user?.email || 'guest@demo.com',
      avatar_url: null,
      created_at: new Date().toISOString(),
    };

    // Load saved Lego XP from localStorage
    const savedLegoXp = localStorage.getItem('lego_xp');
    if (savedLegoXp) {
      setLegoXp(parseInt(savedLegoXp, 10));
    }

    setProfile(mockProfile);
    setLoading(false);
  }, [user, isGuestMode]);

  useEffect(() => {
    if (isAuthenticated || isGuestMode) {
      fetchUserData();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated, isGuestMode, fetchUserData]);

  const addXp = useCallback((amount: number, game: 'spot' | 'lego' = 'lego') => {
    if (game === 'lego') {
      setLegoXp(prev => {
        const newXp = prev + amount;
        localStorage.setItem('lego_xp', String(newXp));
        return newXp;
      });
    }
    // Spot XP is handled by SpotContext
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setLegoBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      return [...prev, badgeId];
    });
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <UserContext.Provider value={{ 
      profile, 
      stats, 
      badges: allBadges, 
      loading, 
      fetchUserData, 
      addXp, 
      unlockBadge, 
      updateProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
