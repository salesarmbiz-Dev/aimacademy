import React, { useEffect, useState } from 'react';
import { Star, Clock, Target, CheckCircle2, Zap, ChevronRight, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  level: number;
  score: number;
  stars: number;
  bugsFound: number;
  bugsTotal: number;
  typesCorrect: number;
  fixQualityScore: number;
  timeSeconds: number;
  xpEarned: number;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToLevelSelect: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  level,
  score,
  stars,
  bugsFound,
  bugsTotal,
  typesCorrect,
  fixQualityScore,
  timeSeconds,
  xpEarned,
  isLastLevel,
  onNextLevel,
  onReplay,
  onBackToLevelSelect,
}) => {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [showStars, setShowStars] = useState([false, false, false]);

  useEffect(() => {
    // Animate XP counter
    const duration = 1000;
    const startTime = Date.now();
    
    const animateXp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedXp(Math.floor(progress * xpEarned));
      
      if (progress < 1) {
        requestAnimationFrame(animateXp);
      }
    };
    
    requestAnimationFrame(animateXp);

    // Animate stars with stagger
    [0, 1, 2].forEach((i) => {
      if (i < stars) {
        setTimeout(() => {
          setShowStars(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 500 + i * 200);
      }
    });

    // Confetti for 3 stars
    if (stars === 3) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F27405', '#05F2F2', '#FFD700'],
        });
      }, 1000);
    }
  }, [stars, xpEarned]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Level {level} Complete!
          </h2>
          <p className="text-muted-foreground">คะแนนของคุณ</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={cn(
                'w-12 h-12 transition-all duration-500',
                showStars[i]
                  ? 'text-yellow-500 fill-yellow-500 scale-100'
                  : 'text-muted-foreground/30 scale-75'
              )}
              style={{
                transitionDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-tennessee mb-1">{score}%</p>
          <p className="text-sm text-muted-foreground">คะแนนรวม</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
            <Target className="w-5 h-5 text-tennessee" />
            <div>
              <p className="text-xs text-muted-foreground">Bugs Found</p>
              <p className="text-sm font-semibold text-foreground">{bugsFound}/{bugsTotal}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Types Correct</p>
              <p className="text-sm font-semibold text-foreground">{typesCorrect}/{bugsTotal}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Fix Quality</p>
              <p className="text-sm font-semibold text-foreground">{fixQualityScore}%</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-rackley" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{formatTime(timeSeconds)}</p>
            </div>
          </div>
        </div>

        {/* XP Earned */}
        <div className="bg-gradient-to-r from-tennessee/20 to-turquoise/20 rounded-xl p-4 text-center mb-6">
          <p className="text-3xl font-bold text-accent">+{animatedXp} XP</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!isLastLevel && (
            <Button
              onClick={onNextLevel}
              className="w-full bg-tennessee hover:bg-tennessee/90 text-white py-6 text-lg"
            >
              Level ถัดไป
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={onReplay}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              เล่นซ้ำ
            </Button>
            <Button
              onClick={onBackToLevelSelect}
              variant="ghost"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Level Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
