import React from 'react';
import { Users, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TeamStats } from './types';

interface StatsCardsProps {
  stats: TeamStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'สมาชิก',
      value: `${stats.totalMembers} คน`,
      icon: Users,
      color: '#05F2F2',
    },
    {
      label: 'จบหลักสูตร',
      value: `${stats.completedMembers}/${stats.totalMembers}`,
      subValue: `(${Math.round((stats.completedMembers / stats.totalMembers) * 100)}%)`,
      icon: CheckCircle2,
      color: '#22C55E',
    },
    {
      label: 'เข้าใช้สัปดาห์นี้',
      value: `${stats.activeThisWeek} คน`,
      subValue: `(${Math.round((stats.activeThisWeek / stats.totalMembers) * 100)}%)`,
      icon: Activity,
      color: '#F27405',
    },
    {
      label: 'คะแนนเฉลี่ย',
      value: `+${stats.averageImprovement}%`,
      subValue: 'Pre→Post',
      icon: TrendingUp,
      color: '#FFD700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card/80 border-[#05F2F2]/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {card.value}
            </div>
            {card.subValue && (
              <div className="text-sm text-muted-foreground mt-1">
                {card.subValue}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
