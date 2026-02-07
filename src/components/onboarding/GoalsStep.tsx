import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Target, PenTool, FileCheck, Search, Building, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { OnboardingStepProps, LEARNING_GOALS } from './types';

const GOAL_ICONS: Record<string, React.ElementType> = {
  'prompt-writing': Target,
  'content-creation': PenTool,
  'sop-documents': FileCheck,
  'ai-review': Search,
  'ai-organization': Building,
  'ai-governance': Shield,
};

export const GoalsStep: React.FC<OnboardingStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const isValid = data.selectedGoals.length >= 1 && data.selectedGoals.length <= 3;

  const toggleGoal = (goalId: string) => {
    const currentGoals = data.selectedGoals;
    
    if (currentGoals.includes(goalId)) {
      onUpdate({ selectedGoals: currentGoals.filter(g => g !== goalId) });
    } else {
      if (currentGoals.length >= 3) {
        toast.error('เลือกได้สูงสุด 3 หัวข้อ');
        return;
      }
      onUpdate({ selectedGoals: [...currentGoals, goalId] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-oxford mb-2">คุณอยากเก่ง AI ด้านไหน?</h2>
        <p className="text-rackley">เลือก 1-3 หัวข้อที่สนใจ</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-tennessee/10 text-tennessee px-3 py-1 rounded-full text-sm font-medium">
          เลือกแล้ว {data.selectedGoals.length}/3
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEARNING_GOALS.map((goal, index) => {
          const Icon = GOAL_ICONS[goal.id] || Target;
          const isSelected = data.selectedGoals.includes(goal.id);
          
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                'p-5 rounded-2xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-tennessee bg-tennessee/5 scale-[1.02] shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-2 rounded-xl',
                  isSelected ? 'bg-tennessee/10' : 'bg-gray-100'
                )}>
                  <span className="text-2xl">{goal.emoji}</span>
                </div>
                <div>
                  <div className="font-semibold text-oxford">{goal.title}</div>
                  <div className="text-sm text-rackley mt-1">{goal.description}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between mt-8 pb-8"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-rackley hover:text-oxford"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-tennessee hover:bg-tennessee/90 text-white rounded-xl px-8"
        >
          ถัดไป
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};
