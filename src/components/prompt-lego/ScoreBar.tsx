import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface ScoreBarProps {
  originalScore: number;
  currentScore: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-turquoise';
  if (score >= 70) return 'text-foreground';
  if (score >= 50) return 'text-tennessee';
  return 'text-red-500';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
};

const ScoreBar: React.FC<ScoreBarProps> = ({ originalScore, currentScore }) => {
  const scoreDiff = currentScore - originalScore;
  const isImproved = scoreDiff > 0;
  const isDecreased = scoreDiff < 0;

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Original Score */}
        <div className="text-center md:text-left">
          <p className="text-rackley text-xs uppercase tracking-wide mb-1">คะแนนต้นฉบับ</p>
          <p className="text-turquoise text-3xl font-bold">{originalScore}/100</p>
          <span className="inline-block bg-turquoise/20 text-turquoise text-xs px-2 py-1 rounded mt-1">
            {getScoreLabel(originalScore)}
          </span>
        </div>

        {/* Score Change Indicator */}
        <div className="flex items-center justify-center gap-2">
          {isImproved && (
            <>
              <ArrowUp className="h-6 w-6 text-turquoise animate-bounce" />
              <span className="text-turquoise font-semibold">+{scoreDiff} points</span>
            </>
          )}
          {isDecreased && (
            <>
              <ArrowDown className="h-6 w-6 text-tennessee animate-bounce" />
              <span className="text-tennessee font-semibold">{scoreDiff} points</span>
            </>
          )}
          {!isImproved && !isDecreased && (
            <>
              <Minus className="h-6 w-6 text-rackley" />
              <span className="text-rackley">ไม่เปลี่ยนแปลง</span>
            </>
          )}
        </div>

        {/* Current Score */}
        <div className="text-center md:text-right">
          <p className="text-rackley text-xs uppercase tracking-wide mb-1">คะแนนปัจจุบัน</p>
          <p className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
            {currentScore}/100
          </p>
          <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
            currentScore >= 90 ? 'bg-turquoise/20 text-turquoise' :
            currentScore >= 70 ? 'bg-rackley/20 text-rackley' :
            currentScore >= 50 ? 'bg-tennessee/20 text-tennessee' :
            'bg-red-500/20 text-red-500'
          }`}>
            {getScoreLabel(currentScore)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;
