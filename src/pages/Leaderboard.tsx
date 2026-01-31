import React, { useState, useMemo } from 'react';
import { Medal, Search, Target, Clock, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import LeaderboardPodium from '@/components/leaderboard/LeaderboardPodium';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import TierInfoPanel from '@/components/leaderboard/TierInfoPanel';
import { 
  MOCK_GLOBAL_LEADERBOARD, 
  MOCK_CHALLENGE_LEADERBOARD, 
  TIER_SYSTEM,
  getTier,
  type LeaderboardTab,
  type LeaderboardUser,
  type ChallengeLeaderboardUser
} from '@/components/leaderboard/types';

const Leaderboard: React.FC = () => {
  const { stats } = useUser();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);

  // Mock current user data
  const currentUserRank = 42;
  const currentUserXp = stats.currentXp + (stats.level - 1) * 100;
  const currentUserTier = getTier(currentUserXp);

  // Weekly reset countdown (mock)
  const weeklyResetTime = "2 วัน 14:32:05";

  const tabs: { id: LeaderboardTab; label: string; count: string }[] = [
    { id: 'global', label: '🌍 Global', count: '1.2k' },
    { id: 'weekly', label: '📅 Weekly', count: '890' },
    { id: 'minimize', label: '✨ Minimize', count: '456' },
    { id: 'maximize', label: '📈 Maximize', count: '234' },
    { id: 'fix', label: '🔧 Fix', count: '345' },
    { id: 'build', label: '🏗️ Build', count: '189' }
  ];

  const isChallenge = ['minimize', 'maximize', 'fix', 'build'].includes(activeTab);

  const leaderboardData = useMemo(() => {
    let data: (LeaderboardUser | ChallengeLeaderboardUser)[];
    
    if (activeTab === 'global' || activeTab === 'weekly') {
      data = [...MOCK_GLOBAL_LEADERBOARD];
      if (activeTab === 'weekly') {
        data = (data as LeaderboardUser[]).sort((a, b) => b.weeklyXp - a.weeklyXp);
        data = data.map((user, index) => ({ ...user, rank: index + 1 }));
      }
    } else {
      data = MOCK_CHALLENGE_LEADERBOARD[activeTab] || [];
    }

    if (searchQuery) {
      data = data.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (tierFilter !== 'all') {
      data = data.filter(user => user.tier === tierFilter);
    }

    return data;
  }, [activeTab, searchQuery, tierFilter]);

  const top3Users = leaderboardData.slice(0, 3);

  const handleShowMyRank = () => {
    setHighlightedUserId('current-user');
    setTimeout(() => {
      const element = document.querySelector('[data-user-id="current-user"]');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const valueKey = activeTab === 'weekly' ? 'weeklyXp' : isChallenge ? 'bestScore' : 'totalXp';
  const valueLabel = isChallenge ? '' : 'XP';

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Medal className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground text-lg mt-1">แข่งขันกับผู้เล่นทั่วโลก</p>
          </div>

          {/* User's Rank Card */}
          <Card className="bg-secondary border-2 border-accent">
            <CardContent className="p-4 flex items-center gap-6">
              <div>
                <p className="text-muted-foreground text-xs uppercase">อันดับของคุณ</p>
                <p className="text-accent text-3xl font-bold">#{currentUserRank}</p>
              </div>
              <div className="w-px h-12 bg-muted-foreground/30" />
              <div>
                <p className="text-primary font-semibold">{currentUserXp.toLocaleString()} XP</p>
                <Badge 
                  style={{ 
                    backgroundColor: `${TIER_SYSTEM[currentUserTier].color}20`,
                    color: TIER_SYSTEM[currentUserTier].color
                  }}
                >
                  {TIER_SYSTEM[currentUserTier].icon} {TIER_SYSTEM[currentUserTier].name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        {top3Users.length >= 3 && (
          <LeaderboardPodium 
            users={top3Users}
            valueKey={valueKey as 'totalXp' | 'weeklyXp' | 'bestScore'}
            valueLabel={valueLabel}
          />
        )}

        {/* Tabs */}
        <div className="bg-secondary rounded-xl p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent text-secondary'
                    : 'text-muted-foreground hover:text-white hover:bg-muted-foreground/20'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Reset Timer */}
        {activeTab === 'weekly' && (
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm">รีเซ็ตใน: {weeklyResetTime}</span>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-secondary border-muted-foreground/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาผู้เล่น..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-muted-foreground/50 text-white"
                />
              </div>

              {/* Tier Filter */}
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-40 bg-background border-muted-foreground/50 text-white">
                  <SelectValue placeholder="ทุก Tier" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-muted-foreground/30">
                  <SelectItem value="all">ทุก Tier</SelectItem>
                  <SelectItem value="legend">👑 Legend</SelectItem>
                  <SelectItem value="master">💎 Master</SelectItem>
                  <SelectItem value="expert">🔷 Expert</SelectItem>
                  <SelectItem value="skilled">🔶 Skilled</SelectItem>
                  <SelectItem value="beginner">🔹 Beginner</SelectItem>
                </SelectContent>
              </Select>

              {/* Show My Rank */}
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
                onClick={handleShowMyRank}
              >
                <Target className="w-4 h-4 mr-2" />
                ไปยังอันดับของฉัน
              </Button>

              {/* Refresh */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <LeaderboardTable 
          users={leaderboardData}
          tab={activeTab}
          currentUserId="current-user"
          highlightedUserId={highlightedUserId || undefined}
        />

        {/* Pagination info */}
        <div className="mt-4 text-center text-muted-foreground text-sm">
          แสดง 1-{Math.min(50, leaderboardData.length)} จาก {leaderboardData.length} ผู้เล่น
        </div>

        {/* Last updated */}
        <div className="mt-2 text-center text-muted-foreground text-xs">
          อัปเดตล่าสุด: 30 วินาทีที่แล้ว
        </div>

        {/* Tier Info Panel */}
        <TierInfoPanel />
      </div>
    </div>
  );
};

export default Leaderboard;
