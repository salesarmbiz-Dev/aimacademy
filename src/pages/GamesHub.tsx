import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Flame, Star, TrendingUp, MessageSquarePlus } from 'lucide-react';
import { GameSetSection } from '@/components/games/GameSetSection';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useUser } from '@/contexts/UserContext';
import { useSurvey } from '@/hooks/useSurvey';
import { gameSets, getGamesBySet, gamesData } from '@/data/gamesData';
import PostGameSurvey from '@/components/survey/PostGameSurvey';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GamesHub: React.FC = () => {
  const { getTotalXP, getCompletedCount, getStreak, progress } = useGameProgress();
  const { stats } = useUser();
  const { checkSet1Eligibility, hasSubmitted } = useSurvey();
  
  const [showSurvey, setShowSurvey] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  const totalGames = gamesData.length;
  const completedGames = getCompletedCount();
  const totalXP = getTotalXP();
  const streak = getStreak();

  // Check if user is eligible for SET 1 survey
  useEffect(() => {
    const checkSurveyEligibility = async () => {
      const isEligible = await checkSet1Eligibility();
      if (isEligible) {
        // Show survey with a slight delay
        setTimeout(() => setShowSurvey(true), 2000);
      }
      
      // Check if SET 1 is complete (for showing feedback button)
      const submitted = await hasSubmitted('set1_complete');
      // Show feedback button if SET 1 is complete (regardless of survey submission)
      const set1Games = ['spot', 'lego', 'debugger'];
      const set1Complete = set1Games.every(gameId => {
        const p = progress.get(gameId);
        return p && p.status === 'completed' && (p.best_score || 0) >= 70;
      });
      setShowFeedbackButton(set1Complete && submitted);
    };

    if (progress.size > 0) {
      checkSurveyEligibility();
    }
  }, [progress, checkSet1Eligibility, hasSubmitted]);

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
            background: 'linear-gradient(135deg, hsl(var(--oxford)) 0%, hsl(var(--charcoal)) 100%)',
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
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
              
              {/* Feedback Button */}
              {showFeedbackButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSurvey(true)}
                  className="gap-2"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  ให้ Feedback
                </Button>
              )}
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

      {/* Post-Game Survey Modal */}
      <PostGameSurvey
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        triggerContext="set1_complete"
      />
    </>
  );
};

export default GamesHub;
