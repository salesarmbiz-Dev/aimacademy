import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { quickFeedbackChips } from './types';
import { cn } from '@/lib/utils';

interface FeedbackStepProps {
  openFeedback: string;
  onFeedbackChange: (text: string) => void;
}

const FeedbackStep: React.FC<FeedbackStepProps> = ({
  openFeedback,
  onFeedbackChange,
}) => {
  const handleChipClick = (chip: string) => {
    const currentText = openFeedback.trim();
    if (currentText.includes(chip)) return; // Don't add duplicate
    
    const newText = currentText 
      ? `${currentText}, ${chip}` 
      : chip;
    onFeedbackChange(newText);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground text-center">
        บอกเราเพิ่มเติม
      </h3>

      <div className="space-y-2">
        <label className="text-base font-medium text-foreground">
          สิ่งที่อยากให้ปรับปรุง หรือ feedback อื่นๆ
        </label>
        <div className="relative">
          <Textarea
            value={openFeedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="เช่น อยากให้มีเกมเรื่อง... / ชอบตรงที่... / ปรับปรุงเรื่อง..."
            className="min-h-[120px] resize-none pr-16"
            maxLength={500}
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {openFeedback.length}/500
          </span>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">หรือเลือกจากนี้:</p>
        <div className="flex flex-wrap gap-2">
          {quickFeedbackChips.map((chip) => {
            const isActive = openFeedback.includes(chip);
            return (
              <motion.button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent/50'
                )}
                whileTap={{ scale: 0.95 }}
              >
                {chip}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackStep;
