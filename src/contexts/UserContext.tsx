import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { UserState, UserProfile, UserStats } from '@/types';

interface UserContextValue extends UserState {
  fetchUserData: () => Promise<void>;
  addXp: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const defaultStats: UserStats = {
  level: 1,
  currentXp: 0,
  totalXpForNextLevel: 100,
  experimentsCount: 0,
  challengesCompleted: 0,
  insightsDiscovered: 0,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [state, setState] = useState<UserState>({
    profile: null,
    stats: defaultStats,
    badges: [],
    loading: true,
  });

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Mock data for now - will be replaced with Supabase queries
    const mockProfile: UserProfile = {
      id: user.id,
      name: user.user_metadata?.name || 'Demo User',
      email: user.email,
      avatar_url: null,
      created_at: new Date().toISOString(),
    };

    setState({
      profile: mockProfile,
      stats: defaultStats,
      badges: [],
      loading: false,
    });
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setState({
        profile: null,
        stats: defaultStats,
        badges: [],
        loading: false,
      });
    }
  }, [isAuthenticated, fetchUserData]);

  const addXp = useCallback((amount: number) => {
    setState(prev => {
      let newXp = prev.stats.currentXp + amount;
      let newLevel = prev.stats.level;
      let xpForNext = prev.stats.totalXpForNextLevel;

      // Check for level up
      while (newXp >= xpForNext) {
        newXp -= xpForNext;
        newLevel++;
        xpForNext = Math.floor(xpForNext * 1.5);
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          currentXp: newXp,
          level: newLevel,
          totalXpForNextLevel: xpForNext,
        },
      };
    });
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...data } : null,
    }));
  }, []);

  return (
    <UserContext.Provider value={{ ...state, fetchUserData, addXp, unlockBadge, updateProfile }}>
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
