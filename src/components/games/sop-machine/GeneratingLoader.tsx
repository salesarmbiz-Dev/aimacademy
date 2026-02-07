import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
  '🔄 กำลังวิเคราะห์ข้อมูลองค์กร...',
  '📋 กำลังออกแบบ SOP...',
  '✨ กำลังปรับแต่งให้เหมาะกับบริบทของคุณ...',
  '✅ เกือบเสร็จแล้ว!',
];

export const GeneratingLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      {/* Spinning Gear */}
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Animated Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium text-foreground text-center"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {loadingMessages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i <= messageIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
