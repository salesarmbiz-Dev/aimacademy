import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface CrossPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  triggerReason?: 'challenges' | 'patterns' | 'category' | 'random';
}

const CrossPromoModal: React.FC<CrossPromoModalProps> = ({
  isOpen,
  onClose,
  onDontShowAgain,
  triggerReason = 'random',
}) => {
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      onDontShowAgain();
    }
    onClose();
  };

  const handleTryLego = () => {
    handleClose();
    navigate('/prompt-lego');
  };

  const getIntroText = () => {
    switch (triggerReason) {
      case 'challenges':
        return 'คุณทำได้ดีมาก! 10 ข้อแล้ว 🎉';
      case 'patterns':
        return 'คุณค้นพบ 5 Patterns แล้ว! 💡';
      case 'category':
        return 'ยินดีด้วย! ทำครบหมวดแล้ว! 🏆';
      default:
        return 'คุณเริ่มเข้าใจ Prompt ดีขึ้นแล้ว!';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative bg-secondary border-2 border-tennessee/50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-rackley hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Puzzle className="w-6 h-6 text-tennessee" />
              <Sparkles className="w-5 h-5 text-turquoise animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              🧱 พร้อมลองสร้างเองยัง?
            </h3>
            <p className="text-rackley text-sm">
              {getIntroText()}
            </p>
          </div>

          {/* Description */}
          <p className="text-foreground text-center mb-4">
            คุณเริ่มเข้าใจแล้วว่า Prompt ที่ดีต้องมีอะไร
            <br />
            ลองประกอบ Prompt ด้วยตัวเองใน Prompt Lego!
          </p>

          {/* Features */}
          <div className="bg-oxford-blue rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🧱</span>
              <div>
                <p className="text-foreground font-semibold">Prompt Lego</p>
                <p className="text-rackley text-sm">ประกอบ Prompt เหมือนต่อ LEGO</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-rackley">
              <li className="flex items-center gap-2">
                <span className="text-turquoise">•</span>
                ลองเพิ่ม/ลบ Blocks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-turquoise">•</span>
                ดู Impact ต่อ Output
              </li>
              <li className="flex items-center gap-2">
                <span className="text-turquoise">•</span>
                ใช้ความรู้จาก Spot the Difference
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleTryLego}
              className="w-full bg-tennessee text-foreground hover:bg-tennessee/90"
            >
              <Puzzle className="w-4 h-4 mr-2" />
              ลอง Prompt Lego
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-rackley text-rackley hover:bg-rackley/10"
            >
              เล่น Spot ต่อ
            </Button>
          </div>

          {/* Don't show again */}
          <div className="flex items-center gap-2 mt-4 justify-center">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label htmlFor="dontShowAgain" className="text-rackley text-sm cursor-pointer">
              ไม่ต้องแสดงอีก
            </label>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CrossPromoModal;
