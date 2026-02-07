import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, Medal, ClipboardCheck } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Gamepad2,
      text: 'ศูนย์ฝึก AI',
      path: '/games',
      primary: true,
      style: 'bg-gradient-to-r from-tennessee to-tennessee/80 text-foreground hover:shadow-lg hover:shadow-tennessee/30',
    },
    {
      icon: ClipboardCheck,
      text: 'ประเมินทักษะ',
      path: '/assessment',
      primary: false,
      style: 'bg-card border-2 border-turquoise text-turquoise hover:bg-turquoise/10',
    },
    {
      icon: Trophy,
      text: 'Challenges',
      path: '/challenges',
      primary: false,
      style: 'bg-card border-2 border-rackley text-foreground hover:bg-rackley/10',
    },
    {
      icon: Medal,
      text: 'Leaderboard',
      path: '/leaderboard',
      primary: false,
      style: 'bg-card border-2 border-rackley text-foreground hover:bg-rackley/10',
    },
  ];

  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      {actions.map((action, index) => (
        <button
          key={action.path}
          onClick={() => navigate(action.path)}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 hover:scale-102 min-w-[180px] md:min-w-0 ${action.style} animate-fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <action.icon className="h-5 w-5" />
          {action.text}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
