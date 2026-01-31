import React, { useEffect, useState } from 'react';
import { Trophy, RotateCcw, ArrowRight, Lightbulb, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChallengeResult as ChallengeResultType, Challenge } from './types';

interface ChallengeResultProps {
  isOpen: boolean;
  onClose: () => void;
  result: ChallengeResultType | null;
  challenge: Challenge;
  attemptsRemaining: number;
  bestAttempt?: number;
  onRetry: () => void;
  onNext: () => void;
  onBack: () => void;
  onHint?: () => void;
}

export const ChallengeResult: React.FC<ChallengeResultProps> = ({
  isOpen,
  onClose,
  result,
  challenge,
  attemptsRemaining,
  bestAttempt,
  onRetry,
  onNext,
  onBack,
  onHint,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
      if (result?.passed) {
        // Animate XP count
        const target = result.xpEarned;
        const duration = 1000;
        const steps = 30;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setDisplayXp(target);
            clearInterval(timer);
          } else {
            setDisplayXp(Math.floor(current));
          }
        }, duration / steps);
        return () => clearInterval(timer);
      }
    } else {
      setShowContent(false);
      setDisplayXp(0);
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const renderStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'h-8 w-8 transition-all duration-500',
          i < count ? 'text-yellow-400 fill-yellow-400' : 'text-rackley/30'
        )}
        style={{ transitionDelay: `${i * 200}ms` }}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-rootbeer/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={cn(
          'relative bg-oxford border-2 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-300',
          result.passed ? 'border-turquoise' : 'border-tennessee',
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-rackley hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          {result.passed ? (
            <>
              {/* Success state */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-turquoise/20 mb-4">
                  <Trophy className="h-10 w-10 text-turquoise" />
                </div>
                <h2 className="text-turquoise text-3xl font-bold mb-2">Challenge Complete!</h2>
                
                {/* Stars */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {renderStars(result.stars)}
                </div>
              </div>

              {/* Score display */}
              <div className="text-center mb-6">
                <span className="text-white text-5xl font-bold">{result.score}</span>
                <span className="text-rackley text-2xl">/100</span>
              </div>

              {/* Performance breakdown */}
              <div className="bg-rootbeer rounded-lg p-4 mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-rackley">Score:</span>
                  <span className="text-turquoise">{result.score}/100 ✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-rackley">Blocks used:</span>
                  <span className="text-turquoise">{result.blocksUsed} ✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-rackley">Time:</span>
                  <span className="text-turquoise">{Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')} ✓</span>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-tennessee/10 border border-tennessee rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-3">🎁 รางวัลที่ได้รับ:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-rackley">Challenge completed</span>
                    <span className="text-tennessee">+{challenge.rewards.base} XP</span>
                  </div>
                  {result.bonuses.map((bonus, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-rackley">{bonus.label}</span>
                      <span className="text-tennessee">+{bonus.xp} XP</span>
                    </div>
                  ))}
                  {result.badge && (
                    <div className="flex items-center justify-between pt-2 border-t border-rackley/20">
                      <span className="text-turquoise">🏅 Badge: {result.badge}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-rackley/20 text-center">
                  <span className="text-tennessee text-2xl font-bold">+{displayXp} XP</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onNext}
                  className="flex-1 bg-tennessee text-white hover:bg-tennessee/90 font-semibold"
                >
                  ทำ Challenge ถัดไป
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 border-rackley text-rackley hover:bg-rootbeer"
                >
                  กลับหน้า Challenge
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Failure state */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tennessee/20 mb-4">
                  <span className="text-4xl">😅</span>
                </div>
                <h2 className="text-tennessee text-2xl font-bold mb-2">ยังไม่ผ่าน...</h2>
              </div>

              {/* Feedback */}
              <div className="text-center mb-6">
                <p className="text-white">
                  Score: <span className="text-tennessee font-bold">{result.score}/100</span>
                </p>
                <p className="text-rackley text-sm mt-1">
                  ขาดอีก {challenge.targetScore - result.score} points
                </p>
              </div>

              {/* Tip */}
              <div className="bg-turquoise/10 border border-turquoise/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-turquoise flex-shrink-0 mt-0.5" />
                  <p className="text-rackley text-sm">
                    💡 Tip: {challenge.hints[0]}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="text-center text-sm text-rackley mb-6">
                <p>Attempts: {attemptsRemaining}/{challenge.maxAttempts} remaining</p>
                {bestAttempt && <p>Best attempt: {bestAttempt}/100</p>}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                {attemptsRemaining > 0 ? (
                  <>
                    <Button
                      onClick={onRetry}
                      className="w-full bg-tennessee text-white hover:bg-tennessee/90 font-semibold"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      ลองอีกครั้ง
                    </Button>
                    {onHint && (
                      <Button
                        onClick={onHint}
                        variant="outline"
                        className="w-full border-turquoise text-turquoise hover:bg-turquoise/10"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        ขอ Hint (-10 XP)
                      </Button>
                    )}
                    <Button
                      onClick={onBack}
                      variant="ghost"
                      className="w-full text-rackley hover:text-white"
                    >
                      ข้าม Challenge นี้
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-tennessee mb-4">หมดโอกาสแล้ว 😢</p>
                    <Button
                      onClick={onBack}
                      className="w-full bg-oxford border border-rackley text-white hover:bg-rootbeer"
                    >
                      กลับหน้า Challenge
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
