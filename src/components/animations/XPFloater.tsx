import React from 'react';
import { Zap } from 'lucide-react';

interface XPFloaterProps {
  amount: number;
  x: number;
  y: number;
}

const XPFloater: React.FC<XPFloaterProps> = ({ amount, x, y }) => {
  return (
    <div
      className="fixed pointer-events-none z-[9999] animate-xp-float"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="flex items-center gap-2 bg-primary text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg shadow-primary/50">
        <Zap className="w-5 h-5" />
        <span>+{amount} XP</span>
      </div>
    </div>
  );
};

export default XPFloater;
