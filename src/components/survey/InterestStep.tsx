import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import type { ContinueInterest } from './types';
import { cn } from '@/lib/utils';

interface InterestStepProps {
  continueInterest: ContinueInterest | null;
  desiredTopics: string;
  onInterestChange: (interest: ContinueInterest) => void;
  onTopicsChange: (topics: string) => void;
}

const interestOptions: { value: ContinueInterest; emoji: string; label: string; color: string }[] = [
  { value: 'yes', emoji: '✅', label: 'อยากเล่นแน่นอน!', color: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' },
  { value: 'maybe', emoji: '🤔', label: 'อาจจะ ถ้ามีเวลา', color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800' },
  { value: 'no', emoji: '❌', label: 'ไม่สนใจ', color: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' },
];

const InterestStep: React.FC<InterestStepProps> = ({
  continueInterest,
  desiredTopics,
  onInterestChange,
  onTopicsChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          ขอบคุณสำหรับ Feedback! 🙏
        </h3>
      </div>

      {/* Continue Interest Question */}
      <div className="space-y-3">
        <p className="text-base font-medium text-foreground">
          คุณอยากเล่น SET 2 ต่อไหม?
        </p>

        <div className="space-y-2">
          {interestOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onInterestChange(option.value)}
              className={cn(
                'w-full rounded-xl p-4 border-2 text-left transition-all',
                'hover:shadow-sm cursor-pointer',
                continueInterest === option.value
                  ? cn(option.color, 'border-2')
                  : 'bg-card border-border hover:bg-accent/50'
              )}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base">
                {option.emoji} {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desired Topics */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          อยากให้เพิ่มเกมเรื่องอะไร? (ไม่บังคับ)
        </label>
        <Input
          value={desiredTopics}
          onChange={(e) => onTopicsChange(e.target.value)}
          placeholder="เช่น การใช้ AI สร้าง content"
          className="w-full"
          maxLength={200}
        />
      </div>
    </div>
  );
};

export default InterestStep;
