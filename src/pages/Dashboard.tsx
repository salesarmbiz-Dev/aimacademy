import React from 'react';
import { useUser } from '@/contexts/UserContext';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import DailyStreak from '@/components/dashboard/DailyStreak';
import ProgressChart from '@/components/dashboard/ProgressChart';
import InsightsPreview from '@/components/dashboard/InsightsPreview';
import BadgesShowcase from '@/components/dashboard/BadgesShowcase';
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';

const Dashboard: React.FC = () => {
  const { profile, stats, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="mb-8">
            <div className="h-8 bg-rackley/20 rounded w-64 animate-shimmer" />
            <div className="h-4 bg-rackley/20 rounded w-48 mt-2 animate-shimmer" />
          </div>
          {/* Skeleton Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-rackley/20 rounded-xl animate-shimmer" />
            ))}
          </div>
          {/* Skeleton Content */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 h-96 bg-rackley/20 rounded-2xl animate-shimmer" />
            <div className="md:col-span-2 h-96 bg-rackley/20 rounded-2xl animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader userName={profile.name} />

        {/* Stats Overview Cards */}
        <StatsCards
          level={stats.level}
          currentXp={stats.currentXp}
          totalXpForNextLevel={stats.totalXpForNextLevel}
          experimentsCount={stats.experimentsCount}
          challengesCompleted={stats.challengesCompleted}
          insightsDiscovered={stats.insightsDiscovered}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Column (60%) */}
          <div className="md:col-span-3">
            <RecentActivity />
            <DailyStreak streak={5} />
          </div>

          {/* Right Column (40%) */}
          <div className="md:col-span-2">
            <ProgressChart />
            <InsightsPreview count={stats.insightsDiscovered || 12} />
            <BadgesShowcase />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;
