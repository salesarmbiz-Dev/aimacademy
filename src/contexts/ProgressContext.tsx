import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ProgressState, Experiment, ChallengeRecord, Insight } from '@/types';

interface ProgressContextValue extends ProgressState {
  saveExperiment: (data: Omit<Experiment, 'id'>) => void;
  completeChallenge: (type: ChallengeRecord['type'], data: Omit<ChallengeRecord, 'id' | 'type'>) => void;
  addInsight: (insight: Omit<Insight, 'id'>) => void;
  getStats: () => { totalExperiments: number; totalChallenges: number; totalInsights: number };
}

const STORAGE_KEY = 'promptlego_progress';

const defaultState: ProgressState = {
  experiments: [],
  challenges: {
    minimize: [],
    maximize: [],
    fix: [],
    build: [],
  },
  insights: [],
  lastActivity: null,
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const saveExperiment = useCallback((data: Omit<Experiment, 'id'>) => {
    const experiment: Experiment = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    setState(prev => ({
      ...prev,
      experiments: [...prev.experiments, experiment],
      lastActivity: new Date().toISOString(),
    }));
  }, []);

  const completeChallenge = useCallback((
    type: ChallengeRecord['type'],
    data: Omit<ChallengeRecord, 'id' | 'type'>
  ) => {
    const challenge: ChallengeRecord = {
      ...data,
      id: crypto.randomUUID(),
      type,
    };
    
    setState(prev => ({
      ...prev,
      challenges: {
        ...prev.challenges,
        [type]: [...prev.challenges[type], challenge],
      },
      lastActivity: new Date().toISOString(),
    }));
  }, []);

  const addInsight = useCallback((data: Omit<Insight, 'id'>) => {
    const insight: Insight = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    setState(prev => {
      // Check for duplicates
      const exists = prev.insights.some(i => i.content === insight.content);
      if (exists) return prev;
      
      return {
        ...prev,
        insights: [...prev.insights, insight],
        lastActivity: new Date().toISOString(),
      };
    });
  }, []);

  const getStats = useCallback(() => {
    const totalChallenges = 
      state.challenges.minimize.length +
      state.challenges.maximize.length +
      state.challenges.fix.length +
      state.challenges.build.length;
    
    return {
      totalExperiments: state.experiments.length,
      totalChallenges,
      totalInsights: state.insights.length,
    };
  }, [state]);

  return (
    <ProgressContext.Provider value={{ ...state, saveExperiment, completeChallenge, addInsight, getStats }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
