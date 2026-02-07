import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, RefreshCw, ArrowLeft, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportViewProps {
  qualityScore: number;
  sectionsCount: number;
  stepsCount: number;
  xpEarned: number;
  onDownloadPDF: () => void;
  onSaveToLibrary: () => void;
  onCreateAnother: () => void;
  onBackToHub: () => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  qualityScore,
  sectionsCount,
  stepsCount,
  xpEarned,
  onDownloadPDF,
  onSaveToLibrary,
  onCreateAnother,
  onBackToHub,
}) => {
  const confettiTriggered = useRef(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    // Animate score
    const scoreDuration = 1500;
    const scoreStart = performance.now();
    const animateScore = (currentTime: number) => {
      const elapsed = currentTime - scoreStart;
      const progress = Math.min(elapsed / scoreDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(easeOut * qualityScore));
      if (progress < 1) requestAnimationFrame(animateScore);
    };
    requestAnimationFrame(animateScore);

    // Animate XP
    const xpDuration = 1000;
    const xpStart = performance.now();
    const animateXP = (currentTime: number) => {
      const elapsed = currentTime - xpStart;
      const progress = Math.min(elapsed / xpDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedXP(Math.floor(easeOut * xpEarned));
      if (progress < 1) requestAnimationFrame(animateXP);
    };
    requestAnimationFrame(animateXP);
  }, [qualityScore, xpEarned]);

  useEffect(() => {
    if (!confettiTriggered.current) {
      confettiTriggered.current = true;
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
          colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'],
          particleCount: Math.floor(particleCount),
        });
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
          colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'],
          particleCount: Math.floor(particleCount),
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <FileCheck className="w-8 h-8 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          🎉 SOP สำเร็จ!
        </h1>
        <p className="text-muted-foreground mb-6">
          SOP ของคุณถูกบันทึกเรียบร้อยแล้ว
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-3xl font-bold text-primary">{animatedScore}</p>
            <p className="text-sm text-muted-foreground">Quality Score</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-3xl font-bold text-foreground">{sectionsCount}</p>
            <p className="text-sm text-muted-foreground">Sections</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-3xl font-bold text-foreground">{stepsCount}</p>
            <p className="text-sm text-muted-foreground">ขั้นตอน</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-lg font-bold text-primary">฿150-300K</p>
            <p className="text-sm text-muted-foreground">มูลค่าเทียบเท่า</p>
          </div>
        </div>

        {/* XP Earned */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6">
          <p className="text-2xl font-bold text-primary">
            ⭐ +{animatedXP} XP
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onDownloadPDF}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลด PDF
          </Button>

          <Button
            onClick={onSaveToLibrary}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            บันทึกเข้า Asset Library
          </Button>

          <Button
            onClick={onCreateAnother}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            สร้าง SOP อีกชิ้น
          </Button>

          <button
            onClick={onBackToHub}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ Game Hub
          </button>
        </div>
      </div>
    </div>
  );
};
