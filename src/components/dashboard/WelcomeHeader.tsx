import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeHeaderProps {
  userName: string;
  isGuest?: boolean;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'สวัสดีตอนเช้า';
  if (hour >= 12 && hour < 17) return 'สวัสดีตอนบ่าย';
  if (hour >= 17 && hour < 21) return 'สวัสดีตอนเย็น';
  return 'สวัสดีตอนดึก';
};

const formatThaiDate = (): string => {
  const now = new Date();
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const thaiYear = now.getFullYear() + 543;
  return `วัน${days[now.getDay()]}ที่ ${now.getDate()} ${months[now.getMonth()]} ${thaiYear}`;
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, isGuest = false }) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-rackley mt-1">พร้อมเรียนรู้ AI วันนี้หรือยัง?</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-rackley text-sm">{formatThaiDate()}</p>
          <p className="text-rackley text-xs mt-1">เข้าใช้งานล่าสุด: 2 ชั่วโมงที่แล้ว</p>
        </div>
      </div>

      {/* Guest Mode Warning */}
      {isGuest && (
        <div className="mt-4 p-4 bg-tennessee/10 border border-tennessee/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-tennessee flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-tennessee font-medium text-sm">คุณกำลังใช้งานในโหมด Guest</p>
              <p className="text-rackley text-xs mt-1">Progress และ XP จะไม่ถูกบันทึก</p>
            </div>
            <Link 
              to="/register"
              className="px-3 py-1.5 bg-tennessee text-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              สมัครฟรี
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeHeader;
