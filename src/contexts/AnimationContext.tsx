import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import XPFloater from '@/components/animations/XPFloater';
import LevelUpModal from '@/components/animations/LevelUpModal';
import BadgeUnlockModal from '@/components/animations/BadgeUnlockModal';
import { useUser } from '@/contexts/UserContext';

interface XPAnimation {
  id: string;
  amount: number;
  x?: number;
  y?: number;
}

interface LevelUpData {
  oldLevel: number;
  newLevel: number;
  newTitle: string;
  unlockedItems: string[];
}

interface BadgeUnlockData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
}

interface AnimationContextValue {
  triggerXP: (amount: number, position?: { x: number; y: number }) => void;
  triggerLevelUp: (data: LevelUpData) => void;
  triggerBadgeUnlock: (badge: BadgeUnlockData) => void;
  triggerConfetti: (options?: { count?: number; spread?: number }) => void;
  triggerSuccessConfetti: () => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xpAnimations, setXPAnimations] = useState<XPAnimation[]>([]);
  const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null);
  const [badgeQueue, setBadgeQueue] = useState<BadgeUnlockData[]>([]);

  const triggerXP = useCallback((amount: number, position?: { x: number; y: number }) => {
    const id = `xp-${Date.now()}-${Math.random()}`;
    const animation: XPAnimation = {
      id,
      amount,
      x: position?.x ?? window.innerWidth / 2,
      y: position?.y ?? window.innerHeight / 2
    };
    
    setXPAnimations(prev => [...prev, animation]);
    
    // Remove after animation completes
    setTimeout(() => {
      setXPAnimations(prev => prev.filter(a => a.id !== id));
    }, 1500);
  }, []);

  const triggerLevelUp = useCallback((data: LevelUpData) => {
    setLevelUpData(data);
    // Trigger confetti for level up
    triggerSuccessConfetti();
  }, []);

  const triggerBadgeUnlock = useCallback((badge: BadgeUnlockData) => {
    setBadgeQueue(prev => [...prev, badge]);
  }, []);

  const dismissBadge = useCallback(() => {
    setBadgeQueue(prev => prev.slice(1));
  }, []);

  const triggerConfetti = useCallback((options?: { count?: number; spread?: number }) => {
    confetti({
      particleCount: options?.count || 100,
      spread: options?.spread || 70,
      origin: { y: 0.6 },
      colors: ['#F27405', '#05F2F2', '#FFD700', '#A855F7', '#10B981']
    });
  }, []);

  const triggerSuccessConfetti = useCallback(() => {
    // Fire multiple bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#F27405', '#05F2F2', '#FFD700', '#A855F7']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <AnimationContext.Provider value={{
      triggerXP,
      triggerLevelUp,
      triggerBadgeUnlock,
      triggerConfetti,
      triggerSuccessConfetti
    }}>
      {children}
      
      {/* XP Floaters */}
      {xpAnimations.map(animation => (
        <XPFloater
          key={animation.id}
          amount={animation.amount}
          x={animation.x!}
          y={animation.y!}
        />
      ))}
      
      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          data={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}
      
      {/* Badge Unlock Modal (shows first in queue) */}
      {badgeQueue.length > 0 && (
        <BadgeUnlockModal
          badge={badgeQueue[0]}
          onClose={dismissBadge}
          remainingCount={badgeQueue.length - 1}
        />
      )}
    </AnimationContext.Provider>
  );
};

export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimations must be used within AnimationProvider');
  }
  return context;
};
