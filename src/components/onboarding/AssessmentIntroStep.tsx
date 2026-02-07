import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, FileQuestion, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps } from './types';

export const AssessmentIntroStep: React.FC<OnboardingStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const handleStartAssessment = () => {
    onUpdate({ preAssessmentSkipped: false });
    // Navigate to assessment with return URL
    window.location.href = '/assessment?type=pre&return=/onboarding?step=5';
  };

  const handleSkip = () => {
    onUpdate({ preAssessmentSkipped: true });
    onNext();
  };

  const infoItems = [
    { icon: Clock, text: 'ใช้เวลาประมาณ 5 นาที' },
    { icon: FileQuestion, text: '10 ข้อ — เลือกตอบ' },
    { icon: BarChart3, text: 'ดูผลทันที' },
    { icon: CheckCircle, text: 'ไม่มีถูกผิดตายตัว — แค่วัดจุดเริ่มต้น' },
  ];

  return (
    <div className="max-w-xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-oxford mb-2">มาวัดระดับกันก่อน! 📊</h2>
        <p className="text-rackley">แบบทดสอบสั้นๆ 10 ข้อ เพื่อดูว่าคุณอยู่ระดับไหน</p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-oxford/5 rounded-2xl p-6 mb-6"
      >
        <div className="space-y-3">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <item.icon className="h-5 w-5 text-tennessee" />
              <span className="text-oxford">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-tennessee/10 to-turquoise/10 rounded-2xl p-6 mb-8"
      >
        <p className="text-sm text-rackley mb-4 text-center">เส้นทางการเรียนรู้ของคุณ</p>
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-tennessee/10 flex items-center justify-center text-2xl">
              📊
            </div>
            <span className="text-xs text-rackley mt-1">Pre-Test</span>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7 }}
            className="w-8 md:w-12 h-0.5 bg-tennessee/30"
          />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-tennessee/10 flex items-center justify-center text-2xl">
              🎮
            </div>
            <span className="text-xs text-rackley mt-1">เล่นเกม</span>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9 }}
            className="w-8 md:w-12 h-0.5 bg-tennessee/30"
          />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-turquoise/10 flex items-center justify-center text-2xl">
              📈
            </div>
            <span className="text-xs text-rackley mt-1">Post-Test</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button
          onClick={handleStartAssessment}
          size="lg"
          className="w-full bg-tennessee hover:bg-tennessee/90 text-white rounded-2xl py-6 text-lg font-bold"
        >
          เริ่มทำแบบทดสอบ
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <button
          onClick={handleSkip}
          className="w-full text-sm text-rackley underline hover:text-oxford transition-colors"
        >
          ข้ามไปก่อน
        </button>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 pb-8"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-rackley hover:text-oxford"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
      </motion.div>
    </div>
  );
};
