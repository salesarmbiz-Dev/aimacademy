import React from 'react';
import { cn } from '@/lib/utils';

interface QualityScoreProps {
  score: number;
  breakdown: {
    completeness: number;
    clarity: number;
    measurability: number;
    practicality: number;
  };
}

export const QualityScore: React.FC<QualityScoreProps> = ({ score, breakdown }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 80) return '#16a34a';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">คุณภาพ SOP</h3>

      {/* Score Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke={getStrokeColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor(score))}>
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <ScoreItem
          label="✅ ครบถ้วน"
          description="มี sections ครบไหม"
          score={breakdown.completeness}
        />
        <ScoreItem
          label="✅ ชัดเจน"
          description="ขั้นตอนเจาะจงไหม"
          score={breakdown.clarity}
        />
        <ScoreItem
          label="✅ วัดผลได้"
          description="มี timeline + responsible ไหม"
          score={breakdown.measurability}
        />
        <ScoreItem
          label="✅ ใช้งานจริง"
          description="เชื่อมกับ tools จริงไหม"
          score={breakdown.practicality}
        />
      </div>

      {/* Tips */}
      {score < 90 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 เพิ่มรายละเอียดในแต่ละขั้นตอนเพื่อเพิ่มคะแนน
          </p>
        </div>
      )}
    </div>
  );
};

interface ScoreItemProps {
  label: string;
  description: string;
  score: number;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, description, score }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-sm font-bold text-foreground">{score}/10</span>
    </div>
  );
};
