import React, { useEffect } from 'react';
import { Trophy, Star, Clock, Target, Award, Home, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import type { LevelProgress } from './types';

interface GameSummaryProps {
  levelProgress: Map<number, LevelProgress>;
  totalLevels: number;
  onBackToHub: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  levelProgress,
  totalLevels,
  onBackToHub,
}) => {
  const completedLevels = Array.from(levelProgress.values()).filter(p => p.completed);
  const totalXP = completedLevels.reduce((sum, p) => sum + p.xpEarned, 0);
  const avgScore = completedLevels.length > 0
    ? Math.round(completedLevels.reduce((sum, p) => sum + p.score, 0) / completedLevels.length)
    : 0;
  const totalStars = completedLevels.reduce((sum, p) => sum + p.stars, 0);
  const totalTime = completedLevels.reduce((sum, p) => sum + p.timeSeconds, 0);
  
  const isAllCompleted = completedLevels.length >= totalLevels;
  const isMaster = isAllCompleted && avgScore >= 70;

  useEffect(() => {
    if (isMaster) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F27405', '#05F2F2', '#FFD700', '#22C55E'],
        });
      }, 500);
    }
  }, [isMaster]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-tennessee mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isAllCompleted ? '🎉 จบ Prompt Debugger!' : '📊 สรุปผล'}
          </h1>
          {isMaster && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-tennessee to-turquoise text-white px-4 py-2 rounded-full mt-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">🐛 Prompt Debugger Master</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Levels จบ</p>
            <p className="text-2xl font-bold text-foreground">{completedLevels.length}/{totalLevels}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">คะแนนเฉลี่ย</p>
            <p className="text-2xl font-bold text-tennessee">{avgScore}%</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">ดาวรวม</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-foreground">{totalStars}/{totalLevels * 3}</span>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">เวลารวม</p>
            <p className="text-2xl font-bold text-foreground">{formatTime(totalTime)}</p>
          </div>
        </div>

        {/* Level Stars Overview */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3 text-center">Stars per Level</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalLevels }).map((_, i) => {
              const progress = levelProgress.get(i + 1);
              const stars = progress?.stars || 0;
              
              return (
                <div
                  key={i}
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold',
                    progress?.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted/50 text-muted-foreground'
                  )}
                >
                  {progress?.completed ? (
                    <div className="flex">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            'w-3 h-3',
                            s <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    i + 1
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total XP */}
        <div className="bg-gradient-to-r from-tennessee/20 to-turquoise/20 rounded-xl p-6 text-center mb-8">
          <p className="text-muted-foreground text-sm mb-1">XP ที่ได้รับ</p>
          <p className="text-4xl font-bold text-accent">⭐ +{totalXP} XP</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onBackToHub}
            className="w-full bg-tennessee hover:bg-tennessee/90 text-white py-6 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            กลับ Game Hub
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Share functionality placeholder
              navigator.clipboard?.writeText(`ฉันเล่น Prompt Debugger ได้ ${avgScore}% และ ${totalStars} ดาว! 🐛⭐`);
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            แชร์ผลคะแนน
          </Button>
        </div>
      </div>
    </div>
  );
};
