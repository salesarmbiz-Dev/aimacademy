import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { getNpsCategory, getNpsFollowupQuestion } from './types';
import { cn } from '@/lib/utils';

interface NPSStepProps {
  npsScore: number | null;
  npsFollowup: string;
  onNpsChange: (score: number) => void;
  onFollowupChange: (text: string) => void;
  showCongrats: boolean;
}

const NPSStep: React.FC<NPSStepProps> = ({
  npsScore,
  npsFollowup,
  onNpsChange,
  onFollowupChange,
  showCongrats,
}) => {
  const npsButtons = Array.from({ length: 11 }, (_, i) => i);

  const getButtonClass = (score: number, selected: number | null) => {
    const isSelected = score === selected;
    const category = getNpsCategory(score);
    
    let baseClass = 'w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base transition-all duration-200 flex-shrink-0';
    
    if (isSelected) {
      const colorClass = 
        category === 'detractor' ? 'bg-destructive text-destructive-foreground' :
        category === 'passive' ? 'bg-yellow-500 text-white' :
        'bg-green-500 text-white';
      return cn(baseClass, colorClass, 'scale-110 shadow-lg');
    }
    
    return cn(baseClass, 'bg-muted text-muted-foreground border border-border hover:bg-accent hover:scale-105');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {showCongrats && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">
            🎉 ยินดีด้วย! คุณจบ SET 1 แล้ว
          </h2>
        </div>
      )}
      
      <p className="text-base text-muted-foreground text-center">
        เราอยากรู้ความคิดเห็นของคุณ
      </p>

      {/* NPS Question */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          คุณจะแนะนำ AIM Academy ให้เพื่อนร่วมงานมากแค่ไหน?
        </h3>

        {/* NPS Scale */}
        <div className="flex justify-center">
          <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
            {npsButtons.map(score => (
              <motion.button
                key={score}
                type="button"
                onClick={() => onNpsChange(score)}
                className={getButtonClass(score, npsScore)}
                whileTap={{ scale: 0.95 }}
                aria-label={`Score ${score}`}
              >
                {score}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between px-2">
          <span className="text-xs text-muted-foreground">ไม่แนะนำเลย</span>
          <span className="text-xs text-muted-foreground">แนะนำอย่างยิ่ง</span>
        </div>
      </div>

      {/* Conditional Follow-up */}
      <AnimatePresence>
        {npsScore !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              {getNpsFollowupQuestion(npsScore)}
            </label>
            <Textarea
              value={npsFollowup}
              onChange={(e) => onFollowupChange(e.target.value)}
              placeholder="แบ่งปันความคิดเห็นของคุณ (ไม่บังคับ)..."
              className="min-h-[60px] resize-none"
              maxLength={300}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NPSStep;
