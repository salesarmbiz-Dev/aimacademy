import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Gamepad2, CheckCircle2, Flame, Star, TrendingUp, Download } from 'lucide-react';
import { GameSetSection } from '@/components/games/GameSetSection';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useUser } from '@/contexts/UserContext';
import { gameSets, getGamesBySet, gamesData } from '@/data/gamesData';
import { cn } from '@/lib/utils';

const GamesHub: React.FC = () => {
  const { getTotalXP, getCompletedCount, getStreak } = useGameProgress();
  const { stats } = useUser();

  const totalGames = gamesData.length;
  const completedGames = getCompletedCount();
  const totalXP = getTotalXP();
  const streak = getStreak();

  const progressStats = [
    { 
      icon: CheckCircle2, 
      label: 'เกมที่จบแล้ว', 
      value: `${completedGames}/${totalGames}`,
      color: 'text-green-500'
    },
    { 
      icon: Flame, 
      label: 'Streak', 
      value: `${streak} วัน`,
      color: 'text-tennessee'
    },
    { 
      icon: Star, 
      label: 'คะแนนรวม', 
      value: `${totalXP.toLocaleString()} XP`,
      color: 'text-accent'
    },
    { 
      icon: TrendingUp, 
      label: 'ระดับ', 
      value: stats.levelTitle,
      color: 'text-turquoise'
    },
  ];

  const heroBadges = [
    '🎮 12 เกม',
    '📊 3 ระดับ',
    '🏆 ได้ Deliverables จริง',
  ];

  return (
    <>
      <Helmet>
        <title>ศูนย์ฝึก AI Prompting | AIM Academy</title>
        <meta name="description" content="เรียนรู้ AI Prompting ผ่านเกมสนุกๆ จากพื้นฐานสู่ระดับมืออาชีพ" />
      </Helmet>

      <div className="-mx-4 md:-mx-6 lg:-mx-8 -mt-6 md:-mt-8">
        {/* Hero Banner */}
        <div 
          className="relative h-[200px] md:h-[240px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #012840 0%, #260D0B 100%)',
          }}
        >
          <div className="text-center px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              ศูนย์ฝึก AI Prompting
            </h1>
            <p className="text-base text-rackley mb-4">
              เรียนรู้ผ่านการเล่น — จากพื้นฐานสู่ระดับมืออาชีพ
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {heroBadges.map((badge, index) => (
                <span 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Summary Strip */}
        <div className="bg-card shadow-sm py-4 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {progressStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-foreground font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {gameSets.map(set => (
            <GameSetSection
              key={set.number}
              set={set}
              games={getGamesBySet(set.number)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamesHub;
