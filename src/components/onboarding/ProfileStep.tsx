import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { OnboardingStepProps, JOB_TITLES, DEPARTMENTS, AI_EXPERIENCE_LEVELS } from './types';

export const ProfileStep: React.FC<OnboardingStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const isValid = data.displayName.trim().length >= 2 && 
                  data.jobTitle && 
                  data.aiExperienceLevel > 0;

  const handleJobTitleSelect = (title: string) => {
    onUpdate({ jobTitle: title });
    if (title !== 'อื่นๆ') {
      onUpdate({ jobTitleOther: undefined });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-oxford mb-2">บอกเราเกี่ยวกับตัวคุณ</h2>
        <p className="text-rackley">เพื่อปรับประสบการณ์ให้เหมาะกับคุณ</p>
      </motion.div>

      <div className="space-y-6">
        {/* Display Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="displayName" className="text-oxford font-medium">
            ชื่อที่ใช้แสดง <span className="text-tennessee">*</span>
          </Label>
          <Input
            id="displayName"
            value={data.displayName}
            onChange={(e) => onUpdate({ displayName: e.target.value })}
            placeholder="ชื่อเล่น หรือชื่อจริง"
            className="mt-2 h-12 rounded-xl border-rackley/30 focus:border-turquoise"
          />
        </motion.div>

        {/* Job Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="text-oxford font-medium">
            ตำแหน่งงาน <span className="text-tennessee">*</span>
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {JOB_TITLES.map((title) => (
              <button
                key={title}
                onClick={() => handleJobTitleSelect(title)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm transition-all duration-200',
                  data.jobTitle === title
                    ? 'bg-tennessee/10 border-2 border-tennessee text-oxford font-medium'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {title}
              </button>
            ))}
          </div>
          {data.jobTitle === 'อื่นๆ' && (
            <Input
              value={data.jobTitleOther || ''}
              onChange={(e) => onUpdate({ jobTitleOther: e.target.value })}
              placeholder="ระบุตำแหน่งของคุณ"
              className="mt-2 h-10 rounded-xl"
            />
          )}
        </motion.div>

        {/* Department - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="text-oxford font-medium">
            แผนก <span className="text-rackley text-sm">(ไม่บังคับ)</span>
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => onUpdate({ department: data.department === dept ? undefined : dept })}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm transition-all duration-200',
                  data.department === dept
                    ? 'bg-tennessee/10 border-2 border-tennessee text-oxford font-medium'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Experience Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="text-oxford font-medium">
            ระดับประสบการณ์ AI <span className="text-tennessee">*</span>
          </Label>
          <div className="space-y-2 mt-3">
            {AI_EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.level}
                onClick={() => onUpdate({ aiExperienceLevel: level.level })}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3',
                  data.aiExperienceLevel === level.level
                    ? 'border-tennessee bg-tennessee/5'
                    : `${level.color} hover:shadow-sm`
                )}
              >
                <span className="text-2xl">{level.emoji}</span>
                <div>
                  <div className="font-medium text-oxford">{level.label}</div>
                  <div className="text-sm text-rackley">{level.description}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
