import React from 'react';
import { X } from 'lucide-react';

interface InstructionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const instructions = [
    { icon: '👀', text: 'ดู Prompt ต้นฉบับ และ Score เริ่มต้น' },
    { icon: '🧱', text: 'ลอง ลบ / เพิ่ม / สลับที่ Blocks' },
    { icon: '📊', text: 'สังเกต Score ที่เปลี่ยนแปลง' },
    { icon: '✨', text: 'กด Generate เพื่อดูผลลัพธ์' },
    { icon: '💡', text: 'เรียนรู้ว่า Block ไหนสำคัญแค่ไหน' },
  ];

  return (
    <div className="bg-card border border-turquoise rounded-xl p-5 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-turquoise text-lg font-bold">🎮 วิธีเล่น Prompt Lego</h3>
        <button onClick={onClose} className="text-rackley hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ol className="space-y-3">
        {instructions.map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-foreground">
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionsPanel;
