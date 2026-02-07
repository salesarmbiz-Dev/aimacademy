import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingsStepProps {
  ratingFun: number;
  ratingDifficulty: number;
  ratingUsefulness: number;
  onRatingChange: (type: 'fun' | 'difficulty' | 'usefulness', value: number) => void;
}

interface RatingRowProps {
  label: string;
  emoji: string;
  helper: string;
  value: number;
  onChange: (value: number) => void;
  showDifficultyLabels?: boolean;
}

const RatingRow: React.FC<RatingRowProps> = ({
  label,
  emoji,
  helper,
  value,
  onChange,
  showDifficultyLabels,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span>{emoji}</span>
            <span className="font-medium text-foreground">{label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{helper}</p>
        </div>
        
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1"
              whileTap={{ scale: 0.9 }}
              animate={star <= value ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
              aria-label={`${star} stars`}
            >
              <Star
                className={cn(
                  'w-7 h-7 md:w-8 md:h-8 transition-colors duration-200',
                  star <= value 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground/30'
                )}
              />
            </motion.button>
          ))}
        </div>
      </div>
      
      {showDifficultyLabels && (
        <div className="flex justify-end gap-4 text-[10px] text-muted-foreground pr-1">
          <span>ง่ายเกินไป</span>
          <span>พอดี</span>
          <span>ยากเกินไป</span>
        </div>
      )}
    </div>
  );
};

const RatingsStep: React.FC<RatingsStepProps> = ({
  ratingFun,
  ratingDifficulty,
  ratingUsefulness,
  onRatingChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground text-center">
        ให้คะแนนประสบการณ์ของคุณ
      </h3>

      <div className="space-y-5">
        <RatingRow
          emoji="🎮"
          label="ความสนุก"
          helper="เกมทำให้อยากเล่นต่อไหม?"
          value={ratingFun}
          onChange={(v) => onRatingChange('fun', v)}
        />

        <RatingRow
          emoji="📊"
          label="ความยากง่าย"
          helper="ระดับความท้าทายเหมาะสมไหม?"
          value={ratingDifficulty}
          onChange={(v) => onRatingChange('difficulty', v)}
          showDifficultyLabels
        />

        <RatingRow
          emoji="💼"
          label="ความมีประโยชน์"
          helper="นำไปใช้ในงานจริงได้ไหม?"
          value={ratingUsefulness}
          onChange={(v) => onRatingChange('usefulness', v)}
        />
      </div>
    </div>
  );
};

export default RatingsStep;
