import React from 'react';
import { Award, Zap, FlaskConical, Trophy, Lightbulb } from 'lucide-react';

interface StatsCardsProps {
  level: number;
  currentXp: number;
  totalXpForNextLevel: number;
  experimentsCount: number;
  challengesCompleted: number;
  insightsDiscovered: number;
}

const getLevelTitle = (level: number): string => {
  if (level <= 5) return 'Prompt Apprentice';
  if (level <= 10) return 'Prompt Builder';
  if (level <= 20) return 'Prompt Engineer';
  if (level <= 50) return 'Prompt Master';
  return 'Lego Legend';
};

const StatsCards: React.FC<StatsCardsProps> = ({
  level,
  currentXp,
  totalXpForNextLevel,
  experimentsCount,
  challengesCompleted,
  insightsDiscovered,
}) => {
  const xpPercentage = (currentXp / totalXpForNextLevel) * 100;
  const xpToNext = totalXpForNextLevel - currentXp;
  const totalChallenges = 20; // Mock total

  const cards = [
    {
      icon: Award,
      label: 'Level',
      value: level.toString(),
      sublabel: getLevelTitle(level),
      borderColor: 'border-l-turquoise',
      iconColor: 'text-turquoise',
      sublabelColor: 'text-turquoise',
    },
    {
      icon: Zap,
      label: 'Experience',
      value: `${currentXp}/${totalXpForNextLevel}`,
      sublabel: `${xpToNext} XP to next level`,
      borderColor: 'border-l-tennessee',
      iconColor: 'text-tennessee',
      sublabelColor: 'text-rackley',
      showProgress: true,
      progress: xpPercentage,
    },
    {
      icon: FlaskConical,
      label: 'Experiments',
      value: experimentsCount.toString(),
      sublabel: '+5 วันนี้',
      borderColor: 'border-l-turquoise',
      iconColor: 'text-turquoise',
      sublabelColor: 'text-turquoise',
    },
    {
      icon: Trophy,
      label: 'Challenges',
      value: challengesCompleted.toString(),
      sublabel: `/${totalChallenges} completed`,
      borderColor: 'border-l-tennessee',
      iconColor: 'text-tennessee',
      sublabelColor: 'text-rackley',
    },
    {
      icon: Lightbulb,
      label: 'Insights',
      value: insightsDiscovered.toString(),
      sublabel: 'discoveries',
      borderColor: 'border-l-turquoise',
      iconColor: 'text-turquoise',
      sublabelColor: 'text-rackley',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`bg-card rounded-xl p-5 border-l-4 ${card.borderColor} hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 animate-fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-rackley text-xs uppercase tracking-wide">{card.label}</span>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </div>
          <p className="text-foreground text-2xl md:text-3xl font-bold">{card.value}</p>
          {card.showProgress && (
            <div className="h-1.5 bg-root-beer rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-tennessee rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          )}
          <p className={`${card.sublabelColor} text-sm mt-1`}>{card.sublabel}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
