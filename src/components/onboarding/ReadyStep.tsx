import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { OnboardingData, AI_EXPERIENCE_LEVELS } from './types';
import confetti from 'canvas-confetti';

interface ReadyStepProps {
  data: OnboardingData;
  onComplete: () => void;
}

const GAME_RECOMMENDATIONS: Record<number, { game: string; path: string; title: string; description: string }> = {
  1: { 
    game: 'spot', 
    path: '/spot', 
    title: '🔍 Spot the Difference',
    description: 'เกมง่ายๆ ที่ฝึกตาให้เห็นความต่าง'
  },
  2: { 
    game: 'spot', 
    path: '/spot', 
    title: '🔍 Spot the Difference',
    description: 'เกมง่ายๆ ที่ฝึกตาให้เห็นความต่าง'
  },
  3: { 
    game: 'prompt-lego', 
    path: '/prompt-lego', 
    title: '🧩 Prompt Lego',
    description: 'ต่อ prompt ทีละ block จะเข้าใจโครงสร้างได้ทันที'
  },
  4: { 
    game: 'debugger', 
    path: '/games/debugger', 
    title: '🐛 Prompt Debugger',
    description: 'หา bug ใน prompt ที่พัง'
  },
  5: { 
    game: 'debugger', 
    path: '/games/debugger', 
    title: '🐛 Prompt Debugger',
    description: 'หา bug ใน prompt ที่พัง'
  },
};

export const ReadyStep: React.FC<ReadyStepProps> = ({ data, onComplete }) => {
  const navigate = useNavigate();
  const [xpCount, setXpCount] = useState(0);
  const recommendation = GAME_RECOMMENDATIONS[data.aiExperienceLevel] || GAME_RECOMMENDATIONS[3];
  
  const experienceLevel = AI_EXPERIENCE_LEVELS.find(l => l.level === data.aiExperienceLevel);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F27405', '#05F2F2', '#012840'],
    });

    // XP count up animation
    const duration = 1000;
    const steps = 20;
    const increment = 50 / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= 50) {
        setXpCount(50);
        clearInterval(timer);
      } else {
        setXpCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const handlePlayGame = () => {
    onComplete();
    navigate(recommendation.path);
  };

  const handleGoToGames = () => {
    onComplete();
    navigate('/games');
  };

  return (
    <div className="max-w-xl mx-auto px-4 text-center">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="w-24 h-24 mx-auto bg-gradient-to-br from-tennessee to-tennessee/80 rounded-full flex items-center justify-center mb-6 shadow-lg"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-oxford mb-2"
      >
        พร้อมแล้ว! 🚀
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-rackley mb-6"
      >
        ยินดีต้อนรับสู่ศูนย์ฝึก AI ของคุณ
      </motion.p>

      {/* Personalized Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-oxford/5 rounded-2xl p-4 mb-6"
      >
        <p className="text-sm text-rackley">
          {data.aiExperienceLevel <= 2 && 'เราแนะนำเริ่มจาก Spot the Difference — เกมง่ายๆ ที่ฝึกตาให้เห็นความต่าง'}
          {data.aiExperienceLevel === 3 && 'ลอง Prompt Lego — ต่อ prompt ทีละ block จะเข้าใจโครงสร้างได้ทันที'}
          {data.aiExperienceLevel >= 4 && 'ท้าทายตัวเองกับ Prompt Debugger — หา bug ใน prompt ที่พัง'}
        </p>
      </motion.div>

      {/* Recommended Game Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl border-2 border-tennessee/20 p-6 mb-6 shadow-lg"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Gamepad2 className="h-6 w-6 text-tennessee" />
          <span className="font-bold text-oxford">{recommendation.title}</span>
        </div>
        <p className="text-sm text-rackley mb-4">{recommendation.description}</p>
        <Button
          onClick={handlePlayGame}
          size="lg"
          className="w-full bg-tennessee hover:bg-tennessee/90 text-white rounded-2xl py-6 text-lg font-bold"
        >
          เล่นเกมแรก
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      {/* Alternative Option */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={handleGoToGames}
        className="text-sm text-rackley underline hover:text-oxford transition-colors mb-6 block mx-auto"
      >
        หรือ เลือกเกมเอง
      </motion.button>

      {/* XP Reward */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full"
      >
        <span className="text-2xl">⭐</span>
        <span className="font-bold text-tennessee">+{xpCount} XP</span>
        <span className="text-sm text-rackley">สำหรับการเริ่มต้น!</span>
      </motion.div>
    </div>
  );
};
