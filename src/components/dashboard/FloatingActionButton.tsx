import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Play, Target, Library } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: Play, label: 'เริ่ม Experiment', path: '/prompt-lego', color: 'bg-tennessee' },
    { icon: Target, label: 'ทำ Challenge', path: '/challenges', color: 'bg-turquoise' },
    { icon: Library, label: 'ดู Library', path: '/library', color: 'bg-rackley' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 animate-fade-in">
          {actions.map((action) => (
            <button
              key={action.path}
              onClick={() => {
                navigate(action.path);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 ${action.color} text-foreground rounded-xl shadow-lg whitespace-nowrap`}
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
          isOpen ? 'bg-rackley rotate-45' : 'bg-tennessee shadow-tennessee/30'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Plus className="h-6 w-6 text-foreground" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
