import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BadgeUnlockModalProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    xpReward: number;
  };
  onClose: () => void;
  remainingCount: number;
}

const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose, remainingCount }) => {
  const navigate = useNavigate();
  const [showShine, setShowShine] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowShine(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto advance after 5 seconds if there are more badges
  useEffect(() => {
    if (remainingCount > 0) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [remainingCount, onClose]);

  const handleViewBadges = () => {
    onClose();
    navigate('/profile?tab=achievements');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.5, y: -100, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.5, y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative bg-secondary border-2 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          style={{ borderColor: badge.color }}
          onClick={e => e.stopPropagation()}
        >
          {/* Sparkles */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
          >
            ✨
          </motion.div>

          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-6 h-6" style={{ color: badge.color }} />
            <h3 className="text-xl font-bold text-white">Badge Unlocked!</h3>
          </div>

          {/* Badge Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 10 }}
            className="relative mx-auto w-24 h-24 mb-6"
          >
            <div 
              className="w-full h-full rounded-2xl flex items-center justify-center text-6xl"
              style={{ 
                backgroundColor: `${badge.color}20`,
                boxShadow: `0 0 30px ${badge.color}50`
              }}
            >
              {badge.icon}
            </div>
            
            {/* Shine effect */}
            {showShine && (
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                style={{ overflow: 'hidden' }}
              />
            )}
          </motion.div>

          {/* Badge Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-2xl font-bold text-white mb-2">{badge.name}</h4>
            <p className="text-muted-foreground text-sm mb-4">{badge.description}</p>
          </motion.div>

          {/* XP Reward */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="flex items-center justify-center gap-2 text-primary text-xl font-bold mb-6"
          >
            <Zap className="w-5 h-5" />
            +{badge.xpReward} XP Reward
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-3"
          >
            <Button
              onClick={handleViewBadges}
              className="w-full bg-primary hover:bg-primary/90 btn-press"
            >
              ดู Badges ทั้งหมด
            </Button>
            
            {remainingCount > 0 && (
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                ถัดไป ({remainingCount} เหลือ)
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BadgeUnlockModal;
