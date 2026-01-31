import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, UserPlus, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface GuestLimitModalProps {
  isOpen: boolean;
  correctCount: number;
  totalCount: number;
  onClose: () => void;
}

const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  correctCount,
  totalCount,
  onClose,
}) => {
  const navigate = useNavigate();
  const { startGuestMode } = useAuth();

  const handleRestart = () => {
    startGuestMode();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-turquoise/50 rounded-2xl p-0 max-w-md mx-auto">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-turquoise" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">
            🎉 คุณเล่นครบ {totalCount} ข้อแล้ว!
          </h2>
          
          <p className="text-turquoise font-semibold text-lg mb-4">
            ทำถูก {correctCount}/{totalCount} ข้อ
          </p>

          <div className="bg-oxford-blue rounded-xl p-4 mb-6 text-left">
            <p className="text-foreground font-semibold mb-2">สร้าง Account ฟรีเพื่อ:</p>
            <ul className="space-y-2 text-rackley text-sm">
              <li className="flex items-center gap-2">
                <span className="text-turquoise">✓</span> เล่นไม่จำกัด
              </li>
              <li className="flex items-center gap-2">
                <span className="text-turquoise">✓</span> บันทึก Progress & XP
              </li>
              <li className="flex items-center gap-2">
                <span className="text-turquoise">✓</span> แข่งขันบน Leaderboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-turquoise">✓</span> เข้าถึง Prompt Lego
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-tennessee text-foreground hover:bg-tennessee/90"
              onClick={() => navigate('/register')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              สร้าง Account ฟรี
            </Button>
            <Button
              variant="outline"
              className="w-full border-rackley text-rackley hover:bg-rackley/10"
              onClick={handleRestart}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              เล่นใหม่จากต้น
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLimitModal;
