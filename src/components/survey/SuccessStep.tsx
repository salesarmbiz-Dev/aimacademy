import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface SuccessStepProps {
  xpEarned: number;
  onClose: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ xpEarned, onClose }) => {
  const [displayXP, setDisplayXP] = useState(0);

  useEffect(() => {
    // Confetti animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#05F2F2', '#F28705', '#012840'],
      });
    }

    // XP counter animation
    const duration = 1000;
    const steps = 20;
    const increment = xpEarned / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setDisplayXP(xpEarned);
        clearInterval(timer);
      } else {
        setDisplayXP(Math.floor(current));
      }
    }, duration / steps);

    // Auto-close after 4 seconds
    const closeTimer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [xpEarned, onClose]);

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      {/* Success Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1 
        }}
      >
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-2"
      >
        <h3 className="text-xl font-bold text-foreground">
          ✅ ขอบคุณค่ะ!
        </h3>
        <p className="text-muted-foreground">
          Feedback ของคุณช่วยให้เราพัฒนา AIM Academy ได้ดีขึ้น
        </p>
      </motion.div>

      {/* XP Reward */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl px-6 py-3"
      >
        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          +{displayXP} XP
        </span>
        <span className="text-sm text-yellow-700 dark:text-yellow-300 ml-2">
          สำหรับการให้ Feedback
        </span>
      </motion.div>

      {/* Close Button */}
      <Button 
        onClick={onClose}
        variant="outline"
        className="mt-4"
      >
        กลับ Game Hub
      </Button>
    </div>
  );
};

export default SuccessStep;
