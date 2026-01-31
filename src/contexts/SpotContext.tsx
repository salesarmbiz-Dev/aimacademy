import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface SpotSkills {
  roleDetection: number;
  contextClarity: number;
  formatMatching: number;
  toneAlignment: number;
  efficiency: number;
}

export interface SpotChallenge {
  id: string;
  category: 'social-media' | 'email' | 'ad-copy' | 'customer-service';
  promptA: string;
  promptB: string;
  correctAnswer: 'A' | 'B';
  explanation: string;
  skill: keyof SpotSkills;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SpotState {
  // Progress
  challengesCompleted: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  
  // XP
  gameXp: number;
  
  // Skills (0-100 each)
  skills: SpotSkills;
  
  // Patterns learned
  patternsDiscovered: string[];
  
  // Current session
  currentChallenge: SpotChallenge | null;
  sessionCorrect: number;
  sessionTotal: number;
}

interface SpotContextValue extends SpotState {
  submitAnswer: (challengeId: string, answer: 'A' | 'B') => { correct: boolean; xpEarned: number };
  getNextChallenge: (category?: string) => SpotChallenge | null;
  addPattern: (pattern: string) => void;
  updateSkill: (skill: keyof SpotSkills, points: number) => void;
  resetSession: () => void;
}

const defaultSkills: SpotSkills = {
  roleDetection: 0,
  contextClarity: 0,
  formatMatching: 0,
  toneAlignment: 0,
  efficiency: 0,
};

const defaultState: SpotState = {
  challengesCompleted: 0,
  correctAnswers: 0,
  currentStreak: 0,
  longestStreak: 0,
  gameXp: 0,
  skills: defaultSkills,
  patternsDiscovered: [],
  currentChallenge: null,
  sessionCorrect: 0,
  sessionTotal: 0,
};

// Mock challenges for Spot the Difference
const MOCK_CHALLENGES: SpotChallenge[] = [
  {
    id: 'spot-001',
    category: 'social-media',
    promptA: 'Write a social media post about our new product.',
    promptB: 'As a social media manager for a tech startup, write an engaging Instagram caption for our new AI-powered productivity app. Include relevant hashtags and a call-to-action.',
    correctAnswer: 'B',
    explanation: 'Prompt B ดีกว่าเพราะกำหนด Role (social media manager), Platform (Instagram), Product type (AI productivity app) และ Requirements (hashtags, CTA) อย่างชัดเจน',
    skill: 'roleDetection',
    difficulty: 'easy',
  },
  {
    id: 'spot-002',
    category: 'email',
    promptA: 'Write a professional email to apologize to a customer about a delayed shipment. Keep it brief but sincere.',
    promptB: 'Write an apology email.',
    correctAnswer: 'A',
    explanation: 'Prompt A ดีกว่าเพราะระบุ Context (delayed shipment), Tone (professional, sincere) และ Format (brief) ชัดเจน',
    skill: 'contextClarity',
    difficulty: 'easy',
  },
  {
    id: 'spot-003',
    category: 'ad-copy',
    promptA: 'Create an ad for running shoes.',
    promptB: 'Write a 30-second Facebook video ad script for Nike Air Max running shoes targeting young professionals aged 25-35. Emphasize comfort for daily commutes and weekend runs. End with "Just Do It."',
    correctAnswer: 'B',
    explanation: 'Prompt B ดีกว่าเพราะระบุ Format (30-sec video script), Platform (Facebook), Target audience (25-35 professionals), Key benefits และ Branding',
    skill: 'formatMatching',
    difficulty: 'medium',
  },
  {
    id: 'spot-004',
    category: 'customer-service',
    promptA: 'You are a friendly customer support agent for a premium subscription service. Help this customer who wants to cancel their subscription but might be retained with a special offer.',
    promptB: 'Handle a cancellation request.',
    correctAnswer: 'A',
    explanation: 'Prompt A ดีกว่าเพราะกำหนด Role, Tone (friendly), Context (premium subscription) และ Goal (retention with offer)',
    skill: 'toneAlignment',
    difficulty: 'medium',
  },
  {
    id: 'spot-005',
    category: 'social-media',
    promptA: 'Write 5 tweet variations promoting our webinar. Each should be under 280 characters, include the registration link placeholder [LINK], and create urgency. Mix educational and FOMO angles.',
    promptB: 'Write 5 different tweets about our webinar. Make them interesting and not too long. Put the link somewhere.',
    correctAnswer: 'A',
    explanation: 'Prompt A ดีกว่าเพราะระบุ Quantity (5), Constraints (280 chars), Required elements ([LINK]), Strategy (urgency, educational, FOMO) อย่างชัดเจน',
    skill: 'efficiency',
    difficulty: 'hard',
  },
];

const SpotContext = createContext<SpotContextValue | undefined>(undefined);

const STORAGE_KEY = 'aim_spot_progress';

export const SpotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGuestMode } = useAuth();
  
  const [state, setState] = useState<SpotState>(() => {
    if (typeof window === 'undefined') return defaultState;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultState, ...JSON.parse(stored) };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Persist to localStorage when state changes (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated && !isGuestMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isAuthenticated, isGuestMode]);

  const getNextChallenge = useCallback((category?: string): SpotChallenge | null => {
    let challenges = MOCK_CHALLENGES;
    if (category) {
      challenges = challenges.filter(c => c.category === category);
    }
    
    // Simple round-robin for now
    const index = state.challengesCompleted % challenges.length;
    const challenge = challenges[index];
    
    setState(prev => ({ ...prev, currentChallenge: challenge }));
    return challenge;
  }, [state.challengesCompleted]);

  const submitAnswer = useCallback((challengeId: string, answer: 'A' | 'B') => {
    const challenge = MOCK_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return { correct: false, xpEarned: 0 };

    const correct = answer === challenge.correctAnswer;
    const baseXp = correct ? 15 : 5;
    const streakBonus = correct && state.currentStreak >= 3 ? 5 : 0;
    const xpEarned = baseXp + streakBonus;

    setState(prev => {
      const newStreak = correct ? prev.currentStreak + 1 : 0;
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      
      return {
        ...prev,
        challengesCompleted: prev.challengesCompleted + 1,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        gameXp: prev.gameXp + xpEarned,
        sessionCorrect: prev.sessionCorrect + (correct ? 1 : 0),
        sessionTotal: prev.sessionTotal + 1,
        currentChallenge: null,
        skills: correct ? {
          ...prev.skills,
          [challenge.skill]: Math.min(100, prev.skills[challenge.skill] + 5),
        } : prev.skills,
      };
    });

    return { correct, xpEarned };
  }, [state.currentStreak]);

  const addPattern = useCallback((pattern: string) => {
    setState(prev => {
      if (prev.patternsDiscovered.includes(pattern)) return prev;
      return {
        ...prev,
        patternsDiscovered: [...prev.patternsDiscovered, pattern],
      };
    });
  }, []);

  const updateSkill = useCallback((skill: keyof SpotSkills, points: number) => {
    setState(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: Math.min(100, Math.max(0, prev.skills[skill] + points)),
      },
    }));
  }, []);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionCorrect: 0,
      sessionTotal: 0,
      currentChallenge: null,
    }));
  }, []);

  return (
    <SpotContext.Provider value={{
      ...state,
      submitAnswer,
      getNextChallenge,
      addPattern,
      updateSkill,
      resetSession,
    }}>
      {children}
    </SpotContext.Provider>
  );
};

export const useSpot = () => {
  const context = useContext(SpotContext);
  if (context === undefined) {
    throw new Error('useSpot must be used within a SpotProvider');
  }
  return context;
};
