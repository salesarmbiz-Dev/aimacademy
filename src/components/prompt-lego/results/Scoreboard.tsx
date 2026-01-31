import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface ScoreboardProps {
  originalScore: number;
  modifiedScore: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-turquoise';
  if (score >= 70) return 'text-foreground';
  if (score >= 50) return 'text-tennessee';
  return 'text-red-500';
};

const getScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: 'bg-turquoise/20 text-turquoise' };
  if (score >= 70) return { label: 'Good', color: 'bg-rackley/20 text-rackley' };
  if (score >= 50) return { label: 'Needs Work', color: 'bg-tennessee/20 text-tennessee' };
  return { label: 'Poor', color: 'bg-red-500/20 text-red-500' };
};

const Scoreboard: React.FC<ScoreboardProps> = ({ originalScore, modifiedScore }) => {
  const [displayOriginal, setDisplayOriginal] = useState(0);
  const [displayModified, setDisplayModified] = useState(0);
  const [showChange, setShowChange] = useState(false);

  const scoreDiff = modifiedScore - originalScore;
  const originalLabel = getScoreLabel(originalScore);
  const modifiedLabel = getScoreLabel(modifiedScore);

  useEffect(() => {
    // Animate original score
    const duration = 500;
    const startTime = Date.now();

    const animateOriginal = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayOriginal(Math.round(originalScore * progress));

      if (progress < 1) {
        requestAnimationFrame(animateOriginal);
      } else {
        setTimeout(() => {
          setShowChange(true);
          animateModified();
        }, 300);
      }
    };

    const animateModified = () => {
      const startTime2 = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime2;
        const progress = Math.min(elapsed / duration, 1);
        const diff = modifiedScore - originalScore;
        setDisplayModified(Math.round(originalScore + diff * progress));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    animateOriginal();
  }, [originalScore, modifiedScore]);

  return (
    <div className="bg-gradient-to-br from-card to-root-beer border-2 border-turquoise/30 rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Original Score */}
        <div className="text-center">
          <p className="text-rackley text-xs uppercase tracking-wide mb-2">คะแนนต้นฉบับ</p>
          <div className="relative inline-block">
            <svg className="w-28 h-28 md:w-32 md:h-32 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="hsl(var(--root-beer))"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="hsl(var(--turquoise-blue))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(displayOriginal / 100) * 283} 283`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-turquoise text-3xl md:text-4xl font-bold">{displayOriginal}</span>
            </div>
          </div>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${originalLabel.color}`}>
            {originalLabel.label}
          </span>
        </div>

        {/* Change Indicator */}
        <div className={`text-center transition-all duration-300 ${showChange ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          {scoreDiff > 0 ? (
            <>
              <ArrowUp className="h-12 w-12 md:h-16 md:w-16 text-turquoise mx-auto animate-bounce" />
              <p className="text-turquoise text-2xl md:text-3xl font-bold mt-2">+{scoreDiff} Points</p>
            </>
          ) : scoreDiff < 0 ? (
            <>
              <ArrowDown className="h-12 w-12 md:h-16 md:w-16 text-tennessee mx-auto animate-bounce" />
              <p className="text-tennessee text-2xl md:text-3xl font-bold mt-2">{scoreDiff} Points</p>
            </>
          ) : (
            <>
              <Minus className="h-12 w-12 md:h-16 md:w-16 text-rackley mx-auto" />
              <p className="text-rackley text-xl mt-2">ไม่เปลี่ยนแปลง</p>
            </>
          )}
        </div>

        {/* Modified Score */}
        <div className="text-center">
          <p className="text-rackley text-xs uppercase tracking-wide mb-2">คะแนนหลังแก้ไข</p>
          <div className="relative inline-block">
            <svg className="w-28 h-28 md:w-32 md:h-32 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="hsl(var(--root-beer))"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke={
                  displayModified >= 90 ? 'hsl(var(--turquoise-blue))' :
                  displayModified >= 70 ? 'hsl(0 0% 100%)' :
                  displayModified >= 50 ? 'hsl(var(--tennessee-orange))' :
                  'hsl(0 84% 60%)'
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(displayModified / 100) * 283} 283`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl md:text-4xl font-bold ${getScoreColor(displayModified)}`}>
                {displayModified}
              </span>
            </div>
          </div>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${modifiedLabel.color}`}>
            {modifiedLabel.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
