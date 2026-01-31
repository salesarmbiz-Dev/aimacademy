import React from 'react';
import { Zap, FlaskConical, Trophy, Lightbulb, Flame, Target, TrendingUp, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';

const ProfileStats: React.FC = () => {
  const { stats } = useUser();

  // Mock extended stats for demo
  const mockStats = {
    totalXp: 2565,
    weeklyXp: 450,
    totalExperiments: 23,
    recentExperiments: 8,
    challengesCompleted: 9,
    totalChallenges: 40,
    insightsCount: 5,
    currentStreak: 12,
    longestStreak: 18,
    accuracy: 78,
    skills: {
      blockUnderstanding: 85,
      promptBuilding: 72,
      minimization: 90,
      optimization: 65,
      problemFixing: 78
    },
    weekActivity: [3, 5, 2, 6, 4, 1, 7]
  };

  const StatCard = ({ 
    icon: Icon, 
    iconColor, 
    value, 
    label, 
    trend, 
    trendValue,
    children 
  }: {
    icon: React.ElementType;
    iconColor: string;
    value: string | number;
    label: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    children?: React.ReactNode;
  }) => (
    <Card className="bg-secondary border-muted-foreground/30 hover:border-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-accent' : 'text-primary'}`}>
              {trend === 'up' && <ArrowUp className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-muted-foreground text-sm mt-1">{label}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Zap}
          iconColor="#F27405"
          value={mockStats.totalXp.toLocaleString()}
          label="Total XP Earned"
          trend="up"
          trendValue={`+${mockStats.weeklyXp} this week`}
        >
          <div className="mt-4 flex gap-1">
            {mockStats.weekActivity.map((activity, i) => (
              <div
                key={i}
                className="flex-1 bg-background rounded-sm"
                style={{ height: `${Math.max(activity * 8, 8)}px` }}
              >
                <div 
                  className="w-full h-full rounded-sm bg-primary/80"
                  style={{ opacity: activity / 7 }}
                />
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard
          icon={FlaskConical}
          iconColor="#05F2F2"
          value={mockStats.totalExperiments}
          label="Experiments Completed"
          trend="up"
          trendValue={`+${mockStats.recentExperiments} this week`}
        />

        <StatCard
          icon={Trophy}
          iconColor="#F27405"
          value={`${mockStats.challengesCompleted}/${mockStats.totalChallenges}`}
          label="Challenges Completed"
        >
          <div className="mt-3">
            <Progress 
              value={(mockStats.challengesCompleted / mockStats.totalChallenges) * 100} 
              className="h-2 bg-background"
            />
            <p className="text-muted-foreground text-xs mt-2">
              M: 3/10 | X: 1/10 | F: 5/10 | B: 0/10
            </p>
          </div>
        </StatCard>

        <StatCard
          icon={Lightbulb}
          iconColor="#05F2F2"
          value={mockStats.insightsCount}
          label="Insights Discovered"
        >
          <button className="mt-3 text-accent text-sm hover:underline">
            View all →
          </button>
        </StatCard>

        <StatCard
          icon={Flame}
          iconColor="#F27405"
          value={mockStats.currentStreak}
          label="Day Streak"
        >
          <div className="mt-3">
            <p className="text-muted-foreground text-xs">
              Longest: {mockStats.longestStreak} days
            </p>
            <div className="mt-2 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < 5 ? 'bg-primary' : 'bg-background'
                  }`}
                />
              ))}
            </div>
          </div>
        </StatCard>

        <StatCard
          icon={Target}
          iconColor="#05F2F2"
          value={`${mockStats.accuracy}%`}
          label="Challenge Success Rate"
        >
          <div className="mt-3 relative w-16 h-16 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--background))"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#05F2F2"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${mockStats.accuracy * 1.76} 176`}
              />
            </svg>
          </div>
        </StatCard>
      </div>

      {/* Skill Breakdown */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skill Breakdown
          </h3>
          
          <div className="mt-6 space-y-4">
            {Object.entries(mockStats.skills).map(([skill, value]) => {
              const labels: Record<string, string> = {
                blockUnderstanding: 'Block Understanding',
                promptBuilding: 'Prompt Building',
                minimization: 'Minimization',
                optimization: 'Optimization',
                problemFixing: 'Problem Fixing'
              };
              
              return (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{labels[skill]}</span>
                    <span className="text-accent">{value}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            📅 Activity This Week
          </h3>
          
          <div className="mt-4 flex gap-2">
            {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((day, i) => {
              const activity = mockStats.weekActivity[i];
              let bgColor = 'bg-background';
              if (activity >= 6) bgColor = 'bg-accent';
              else if (activity >= 3) bgColor = 'bg-accent/50';
              else if (activity >= 1) bgColor = 'bg-muted-foreground/50';
              
              return (
                <div key={day} className="flex-1 text-center">
                  <div className={`w-full aspect-square rounded-md ${bgColor}`} />
                  <p className="text-muted-foreground text-xs mt-1">{day}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-background" />
              <div className="w-3 h-3 rounded-sm bg-muted-foreground/50" />
              <div className="w-3 h-3 rounded-sm bg-accent/50" />
              <div className="w-3 h-3 rounded-sm bg-accent" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
