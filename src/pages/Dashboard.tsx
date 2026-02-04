import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSpot } from '@/contexts/SpotContext';
import { useProgress } from '@/contexts/ProgressContext';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import DailyStreak from '@/components/dashboard/DailyStreak';
import ProgressChart from '@/components/dashboard/ProgressChart';
import InsightsPreview from '@/components/dashboard/InsightsPreview';
import BadgesShowcase from '@/components/dashboard/BadgesShowcase';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
import GameProgressCards from '@/components/dashboard/GameProgressCards';
import RecommendedNext from '@/components/dashboard/RecommendedNext';
import CertificatesPreview from '@/components/dashboard/CertificatesPreview';
import AssessmentPreview from '@/components/dashboard/AssessmentPreview';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Trophy, Lightbulb, Flame, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, stats, loading } = useUser();
  const { isGuestMode } = useAuth();
  const spotState = useSpot();
  const { insights } = useProgress();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="mb-8">
            <div className="h-8 bg-rackley/20 rounded w-64 animate-pulse" />
            <div className="h-4 bg-rackley/20 rounded w-48 mt-2 animate-pulse" />
          </div>
          {/* Skeleton Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-rackley/20 rounded-xl animate-pulse" />
            ))}
          </div>
          {/* Skeleton Content */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 h-96 bg-rackley/20 rounded-2xl animate-pulse" />
            <div className="md:col-span-2 h-96 bg-rackley/20 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate total XP from both games
  const totalInsights = insights.length + spotState.patternsDiscovered.length;
  const spotAccuracy = spotState.challengesCompleted > 0 
    ? Math.round((spotState.correctAnswers / spotState.challengesCompleted) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader 
          userName={isGuestMode ? 'Guest' : (profile?.name || 'User')} 
          isGuest={isGuestMode}
        />

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <Card className="bg-card border-turquoise/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-turquoise" />
                <span className="text-lg font-bold text-foreground">Lv.{stats.level}</span>
              </div>
              <p className="text-xs text-rackley">{stats.levelTitle}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-tennessee/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-tennessee" />
                <span className="text-lg font-bold text-foreground">{stats.totalXp.toLocaleString()}</span>
              </div>
              <p className="text-xs text-rackley">Total XP</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-turquoise/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-turquoise" />
                <span className="text-lg font-bold text-foreground">{totalInsights}</span>
              </div>
              <p className="text-xs text-rackley">Insights</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-tennessee/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-tennessee" />
                <span className="text-lg font-bold text-foreground">{spotState.currentStreak}</span>
              </div>
              <p className="text-xs text-rackley">Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-turquoise/30 col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-turquoise" />
                <span className="text-lg font-bold text-foreground">Top {100 - stats.percentile}%</span>
              </div>
              <p className="text-xs text-rackley">Rank #{stats.globalRank}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Next */}
        <RecommendedNext 
          spotCompleted={spotState.challengesCompleted}
          legoCompleted={stats.challengesCompleted}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Game Progress Cards */}
        <GameProgressCards 
          spotStats={{
            completed: spotState.challengesCompleted,
            accuracy: spotAccuracy,
            streak: spotState.currentStreak,
            xp: spotState.gameXp,
          }}
          legoStats={{
            experiments: stats.experimentsCount,
            challenges: stats.challengesCompleted,
            xp: stats.legoXp,
          }}
        />

        {/* Stats Cards - Detailed */}
        <StatsCards
          level={stats.level}
          currentXp={stats.xpForCurrentLevel}
          totalXpForNextLevel={stats.xpForNextLevel}
          experimentsCount={stats.experimentsCount}
          challengesCompleted={stats.challengesCompleted + spotState.challengesCompleted}
          insightsDiscovered={totalInsights}
        />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Column (60%) */}
          <div className="md:col-span-3 space-y-6">
            <RecentActivity />
            <DailyStreak streak={spotState.currentStreak} />
          </div>

          {/* Right Column (40%) */}
          <div className="md:col-span-2 space-y-6">
            <AssessmentPreview />
            <ProgressChart />
            <CertificatesPreview />
            <InsightsPreview count={totalInsights} />
            {!isGuestMode && <BadgesShowcase />}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;
