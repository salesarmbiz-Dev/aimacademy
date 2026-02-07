import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const valuePills = [
    { emoji: '🎮', text: 'เรียนด้วยการเล่น', color: 'bg-tennessee/10 text-tennessee' },
    { emoji: '🛠', text: 'ได้เครื่องมือจริง', color: 'bg-turquoise/10 text-oxford' },
    { emoji: '📊', text: 'วัดผลได้', color: 'bg-oxford/10 text-oxford' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-20 h-20 bg-gradient-to-br from-tennessee to-tennessee/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
      >
        <span className="text-white font-bold text-2xl">AIM</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-oxford mb-3"
      >
        ยินดีต้อนรับสู่ AIM Academy 🎉
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-lg text-rackley mb-8 max-w-md"
      >
        เรียนรู้ AI Prompting ผ่านการเล่นเกม — ได้ทักษะจริง ได้เครื่องมือจริง
      </motion.p>

      {/* Value Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {valuePills.map((pill, index) => (
          <motion.div
            key={pill.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className={`${pill.color} rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium`}
          >
            <span>{pill.emoji}</span>
            <span>{pill.text}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-tennessee hover:bg-tennessee/90 text-white rounded-2xl py-6 px-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
        >
          เริ่มกันเลย
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};
