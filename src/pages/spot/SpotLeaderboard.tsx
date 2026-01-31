import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Target, Flame, TrendingUp, TrendingDown, 
  Minus, Crown, Medal, Search, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useSpot } from '@/contexts/SpotContext';
import { 
  MOCK_SPOT_LEADERBOARD, 
  sortSpotLeaderboard, 
  getUserPercentile,
  getImprovementTip,
  type SpotLeaderboardSortBy,
  type SpotLeaderboardPeriod 
} from '@/data/spotLeaderboard';

const SpotLeaderboard: React.FC = () => {
  const { correctAnswers, challengesCompleted, longestStreak, gameXp } = useSpot();
  const [sortBy, setSortBy] = useState<SpotLeaderboardSortBy>('accuracy');
  const [period, setPeriod] = useState<SpotLeaderboardPeriod>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate user stats
  const userAccuracy = challengesCompleted > 0 
    ? Math.round((correctAnswers / challengesCompleted) * 100 * 10) / 10
    : 0;
  const userRank = 42; // Mock rank
  const userPercentile = getUserPercentile(userRank, MOCK_SPOT_LEADERBOARD.length + 50);
  const improvementTip = getImprovementTip(userAccuracy, longestStreak, userRank);

  // Sort and filter leaderboard
  const leaderboard = useMemo(() => {
    let data = sortSpotLeaderboard(MOCK_SPOT_LEADERBOARD, sortBy);
    
    if (searchQuery) {
      data = data.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return data;
  }, [sortBy, searchQuery]);

  const top3 = leaderboard.slice(0, 3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-rackley" />;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/spot" 
            className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-rackley" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tennessee/20 rounded-xl">
              <Trophy className="w-8 h-8 text-tennessee" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                🏆 Spot Leaderboard
              </h1>
              <p className="text-rackley text-sm">อันดับผู้เล่น Spot the Difference</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={period} onValueChange={(v) => setPeriod(v as SpotLeaderboardPeriod)}>
                <SelectTrigger className="w-full sm:w-40 bg-oxford-blue border-rackley/50 text-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-rackley/30">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 flex-1">
                {(['accuracy', 'xp', 'streak'] as SpotLeaderboardSortBy[]).map((sort) => (
                  <Button
                    key={sort}
                    variant={sortBy === sort ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(sort)}
                    className={sortBy === sort 
                      ? 'bg-turquoise text-oxford-blue' 
                      : 'border-rackley text-rackley hover:bg-rackley/10'
                    }
                  >
                    {sort === 'accuracy' && <Target className="w-4 h-4 mr-1" />}
                    {sort === 'xp' && <Trophy className="w-4 h-4 mr-1" />}
                    {sort === 'streak' && <Flame className="w-4 h-4 mr-1" />}
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <Card className="bg-gradient-to-b from-secondary to-background border-rackley/30 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground text-center mb-6">🏆 TOP 3</h2>
              <div className="flex justify-center items-end gap-4 md:gap-8">
                {[top3[1], top3[0], top3[2]].map((user, index) => {
                  const isFirst = index === 1;
                  const heights = ['100px', '140px', '80px'];
                  const medals = ['🥈', '🥇', '🥉'];
                  const borderColors = ['#C0C0C0', '#FFD700', '#CD7F32'];

                  return (
                    <div key={user.id} className="flex flex-col items-center">
                      {isFirst && (
                        <div className="mb-2 animate-bounce">
                          <span className="text-3xl">👑</span>
                        </div>
                      )}
                      <div 
                        className="relative -mb-6 z-10 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4"
                        style={{ 
                          borderColor: borderColors[index],
                          boxShadow: isFirst ? '0 0 20px rgba(255, 215, 0, 0.4)' : undefined
                        }}
                      >
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div 
                        className="flex flex-col items-center justify-start pt-10 px-4 rounded-t-xl text-center"
                        style={{ 
                          width: isFirst ? '120px' : '100px',
                          height: heights[index],
                          background: `linear-gradient(180deg, ${borderColors[index]} 0%, #012840 100%)`
                        }}
                      >
                        <span className="text-2xl mb-1">{medals[index]}</span>
                        <p className="text-oxford-blue font-bold text-sm truncate max-w-full">
                          {user.name}
                        </p>
                        <p className="text-oxford-blue/80 text-xs">
                          {sortBy === 'accuracy' && `${user.accuracy}%`}
                          {sortBy === 'xp' && `${user.totalXp.toLocaleString()} XP`}
                          {sortBy === 'streak' && `🔥 ${user.bestStreak}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-4 bg-secondary rounded-b-xl mx-auto max-w-md" />
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rackley" />
              <Input
                placeholder="ค้นหาผู้เล่น..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-oxford-blue border-rackley/50 text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rackley/30">
                    <th className="p-4 text-left text-rackley text-sm font-medium">#</th>
                    <th className="p-4 text-left text-rackley text-sm font-medium">Player</th>
                    <th className="p-4 text-center text-rackley text-sm font-medium">Accuracy</th>
                    <th className="p-4 text-center text-rackley text-sm font-medium">XP</th>
                    <th className="p-4 text-center text-rackley text-sm font-medium">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(3).map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-rackley/20 hover:bg-oxford-blue/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">{user.rank}</span>
                          {getRankChangeIcon(user.rankChange)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-foreground font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-turquoise font-semibold">{user.accuracy}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-tennessee font-semibold">{user.totalXp.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-foreground">🔥 {user.bestStreak}</span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Separator for user's rank if not in view */}
                  <tr className="border-b border-rackley/20">
                    <td colSpan={5} className="p-2 text-center text-rackley text-sm">
                      • • •
                    </td>
                  </tr>
                  
                  {/* Current User Row */}
                  <tr className="bg-turquoise/10 border-b border-turquoise/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-turquoise font-bold">{userRank}</span>
                        <TrendingUp className="w-4 h-4 text-accent" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center">
                          <span className="text-turquoise font-bold">คุณ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-turquoise font-medium">คุณ (You)</span>
                          <Badge className="bg-turquoise/20 text-turquoise border-0 text-xs">
                            You
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-turquoise font-semibold">{userAccuracy}%</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-tennessee font-semibold">{gameXp.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-foreground">🔥 {longestStreak}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Your Stats */}
        <Card className="bg-card border-turquoise/30 mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              📊 YOUR STATS
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-oxford-blue rounded-lg p-3">
                <p className="text-rackley text-sm">Rank</p>
                <p className="text-foreground text-xl font-bold">
                  #{userRank} 
                  <span className="text-accent text-sm ml-2">+5 จากสัปดาห์ก่อน</span>
                </p>
              </div>
              <div className="bg-oxford-blue rounded-lg p-3">
                <p className="text-rackley text-sm">Accuracy</p>
                <p className="text-turquoise text-xl font-bold">
                  {userAccuracy}% 
                  <span className="text-rackley text-sm ml-2">(Top {100 - userPercentile}%)</span>
                </p>
              </div>
              <div className="bg-oxford-blue rounded-lg p-3">
                <p className="text-rackley text-sm">Total XP</p>
                <p className="text-tennessee text-xl font-bold">{gameXp.toLocaleString()}</p>
              </div>
              <div className="bg-oxford-blue rounded-lg p-3">
                <p className="text-rackley text-sm">Best Streak</p>
                <p className="text-foreground text-xl font-bold">🔥 {longestStreak}</p>
              </div>
            </div>
            <div className="p-3 bg-turquoise/10 rounded-lg border border-turquoise/30">
              <p className="text-turquoise text-sm">
                💡 Tip: {improvementTip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            asChild 
            variant="outline" 
            className="border-rackley text-rackley hover:bg-rackley/10"
          >
            <Link to="/spot">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ Spot Hub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotLeaderboard;
