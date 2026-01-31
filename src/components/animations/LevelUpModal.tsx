import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
  data: {
    oldLevel: number;
    newLevel: number;
    newTitle: string;
    unlockedItems: string[];
  };
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-close after 10 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

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
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        
        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 50,
                rotate: 0
              }}
              animate={{ 
                y: -50,
                rotate: 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity
              }}
            >
              {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative bg-secondary border-2 border-accent rounded-3xl p-10 max-w-md w-full text-center shadow-2xl shadow-accent/20"
          onClick={e => e.stopPropagation()}
        >
          {/* Top sparkles */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4 text-4xl">
            <motion.span
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              🎉
            </motion.span>
            <motion.span
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              ✨
            </motion.span>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="text-4xl font-bold text-accent mb-6"
          >
            LEVEL UP!
          </motion.h2>

          {/* Level numbers */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span className="text-muted-foreground text-4xl font-bold">{data.oldLevel}</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-white text-2xl"
              >
                →
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-primary text-6xl font-bold"
              >
                {data.newLevel}
              </motion.span>
            </motion.div>
          )}

          {/* New title */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <p className="text-muted-foreground text-sm">New Title</p>
              <p className="text-accent text-xl font-semibold flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                {data.newTitle}
              </p>
            </motion.div>
          )}

          {/* Unlocked items */}
          {showContent && data.unlockedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-background rounded-xl p-4 mb-6"
            >
              <p className="text-white font-semibold flex items-center justify-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-primary" />
                Unlocked:
              </p>
              <ul className="text-muted-foreground text-sm space-y-1">
                {data.unlockedItems.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg btn-press"
            >
              🎉 ยินดีด้วย!
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpModal;
