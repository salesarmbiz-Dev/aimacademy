import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
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

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {getGreeting()}, {userName}! 👋
        </h1>
        <p className="text-rackley mt-1">พร้อมเล่นกับ Prompt วันนี้หรือยัง?</p>
      </div>
      <div className="hidden md:block text-right">
        <p className="text-rackley text-sm">{formatThaiDate()}</p>
        <p className="text-rackley text-xs mt-1">เข้าใช้งานล่าสุด: 2 ชั่วโมงที่แล้ว</p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
