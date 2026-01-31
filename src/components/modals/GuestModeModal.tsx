import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Gamepad2, UserPlus, AlertTriangle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface GuestModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuestModeModal: React.FC<GuestModeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { startGuestMode } = useAuth();

  const handleGuestPlay = () => {
    startGuestMode();
    onClose();
    navigate('/spot?mode=guest');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-turquoise/50 rounded-2xl p-0 max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 text-center border-b border-rackley/20">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-rackley hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-turquoise" />
          </div>
          <h2 className="text-xl font-bold text-foreground">🎮 ลองเล่นก่อน Login</h2>
          <p className="text-rackley text-sm mt-2">
            เล่น Spot the Difference ได้ 5 ข้อ ไม่ต้องสมัคร!
          </p>
        </div>

        {/* Warning */}
        <div className="mx-6 mt-6 p-4 bg-tennessee/10 border border-tennessee/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-tennessee flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-tennessee font-medium text-sm">Progress จะไม่ถูกบันทึก</p>
              <p className="text-rackley text-xs mt-1">สร้าง Account เพื่อเก็บ XP และ Insights</p>
            </div>
          </div>
        </div>

        {/* Game Preview */}
        <div className="mx-6 mt-4 p-4 bg-oxford-blue rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg">
              <Eye className="w-6 h-6 text-turquoise" />
            </div>
            <div>
              <p className="font-semibold text-foreground">🎯 Spot the Difference</p>
              <p className="text-rackley text-sm">เกมจับผิด 2 Prompts</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleGuestPlay}
            className="w-full py-3.5 bg-turquoise text-oxford-blue font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 btn-press"
          >
            <Gamepad2 className="w-5 h-5" />
            เริ่มเลย (Guest)
          </button>
          <button
            onClick={handleRegister}
            className="w-full py-3.5 bg-tennessee/20 text-tennessee font-semibold rounded-xl hover:bg-tennessee hover:text-foreground transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            สมัครฟรี แล้วเล่น
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestModeModal;
