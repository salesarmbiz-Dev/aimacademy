import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, ArrowLeft, Eye, Puzzle, Sparkles, Search, 
  Filter, Calendar, Zap, User, MessageCircle, Layout, Target, ListTodo 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '@/contexts/ProgressContext';
import { useSpot } from '@/contexts/SpotContext';
import { ALL_PATTERNS } from '@/data/spotPatterns';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface UnifiedInsight {
  id: string;
  content: string;
  discoveredAt: Date;
  source: 'spot' | 'lego';
  category: string;
  xpEarned: number;
  challengeId?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'role': return User;
    case 'context': return Target;
    case 'tone': return MessageCircle;
    case 'format': return Layout;
    case 'efficiency': return Zap;
    case 'task': return ListTodo;
    default: return Lightbulb;
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'role': return 'border-l-turquoise';
    case 'context': return 'border-l-rackley';
    case 'tone': return 'border-l-tennessee';
    case 'format': return 'border-l-purple-500';
    case 'efficiency': return 'border-l-green-500';
    default: return 'border-l-tennessee';
  }
};

const Insights: React.FC = () => {
  const { insights } = useProgress();
  const { patternsDiscovered } = useSpot();
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<'all' | 'spot' | 'lego'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'xp'>('recent');

  // Combine insights from both games
  const allInsights: UnifiedInsight[] = useMemo(() => {
    const spotInsights: UnifiedInsight[] = patternsDiscovered.map((patternId, idx) => {
      const patternData = ALL_PATTERNS.find(p => p.id === patternId);
      return {
        id: `spot-${patternId}`,
        content: patternData?.text || patternId,
        discoveredAt: new Date(Date.now() - idx * 86400000), // Mock dates
        source: 'spot' as const,
        category: patternData?.category || 'role',
        xpEarned: 30,
        challengeId: patternData?.relatedChallenges[0],
      };
    });

    const legoInsights: UnifiedInsight[] = insights.map(insight => ({
      id: insight.id,
      content: insight.content,
      discoveredAt: new Date(insight.discovered_at),
      source: 'lego' as const,
      category: 'general',
      xpEarned: 30,
    }));

    return [...spotInsights, ...legoInsights];
  }, [patternsDiscovered, insights]);

  // Apply filters and sorting
  const filteredInsights = useMemo(() => {
    let filtered = allInsights;

    // Game filter
    if (gameFilter !== 'all') {
      filtered = filtered.filter(i => i.source === gameFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => i.content.toLowerCase().includes(query));
    }

    // Sorting
    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime());
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => a.discoveredAt.getTime() - b.discoveredAt.getTime());
        break;
      case 'xp':
        filtered = [...filtered].sort((a, b) => b.xpEarned - a.xpEarned);
        break;
    }

    return filtered;
  }, [allInsights, gameFilter, categoryFilter, searchQuery, sortBy]);

  const spotCount = allInsights.filter(i => i.source === 'spot').length;
  const legoCount = allInsights.filter(i => i.source === 'lego').length;
  const hasInsights = allInsights.length > 0;

  // Group by source for display
  const spotInsights = filteredInsights.filter(i => i.source === 'spot');
  const legoInsights = filteredInsights.filter(i => i.source === 'lego');

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-rackley" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tennessee/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-tennessee" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                💡 Insights Library
              </h1>
              <p className="text-rackley">รวม Pattern ที่คุณเรียนรู้จากทุกเกม</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-rackley/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{allInsights.length}</p>
              <p className="text-xs text-rackley">Total Insights</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-turquoise/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-turquoise/20 rounded-lg">
                <Eye className="w-5 h-5 text-turquoise" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{spotCount}</p>
                <p className="text-xs text-rackley">จาก Spot</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-tennessee/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-tennessee/20 rounded-lg">
                <Puzzle className="w-5 h-5 text-tennessee" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{legoCount}</p>
                <p className="text-xs text-rackley">จาก Lego</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rackley" />
                <Input
                  placeholder="ค้นหา insight..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-rackley/50 text-foreground"
                />
              </div>

              {/* Game Filter */}
              <Select value={gameFilter} onValueChange={(v) => setGameFilter(v as 'all' | 'spot' | 'lego')}>
                <SelectTrigger className="w-40 bg-background border-rackley/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-rackley/30">
                  <SelectItem value="all">ทุกเกม</SelectItem>
                  <SelectItem value="spot">🎯 Spot</SelectItem>
                  <SelectItem value="lego">🧱 Lego</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-background border-rackley/50">
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent className="bg-card border-rackley/30">
                  <SelectItem value="all">ทุกหมวด</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="context">Context</SelectItem>
                  <SelectItem value="tone">Tone</SelectItem>
                  <SelectItem value="format">Format</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'recent' | 'oldest' | 'xp')}>
                <SelectTrigger className="w-40 bg-background border-rackley/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-rackley/30">
                  <SelectItem value="recent">ล่าสุด</SelectItem>
                  <SelectItem value="oldest">เก่าสุด</SelectItem>
                  <SelectItem value="xp">XP มากสุด</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Insights List or Empty State */}
        {hasInsights ? (
          <div className="space-y-6">
            {/* Spot Insights Section */}
            {spotInsights.length > 0 && (gameFilter === 'all' || gameFilter === 'spot') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-turquoise" />
                  <h2 className="text-lg font-semibold text-foreground">
                    FROM SPOT THE DIFFERENCE
                  </h2>
                  <Badge variant="secondary" className="bg-turquoise/20 text-turquoise">
                    {spotInsights.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {spotInsights.map((insight) => {
                    const Icon = getCategoryIcon(insight.category);
                    return (
                      <Card 
                        key={insight.id} 
                        className={`bg-card border-l-4 ${getCategoryColor(insight.category)} border-rackley/30 hover:border-turquoise/50 transition-colors`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-turquoise/20">
                              <Icon className="w-4 h-4 text-turquoise" />
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground font-medium">"{insight.content}"</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-rackley">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDistanceToNow(insight.discoveredAt, { addSuffix: true, locale: th })}
                                </span>
                                {insight.challengeId && (
                                  <span>🎯 Challenge #{insight.challengeId}</span>
                                )}
                                <span className="flex items-center gap-1 text-tennessee">
                                  <Zap className="w-3 h-3" />
                                  +{insight.xpEarned} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lego Insights Section */}
            {legoInsights.length > 0 && (gameFilter === 'all' || gameFilter === 'lego') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Puzzle className="w-5 h-5 text-tennessee" />
                  <h2 className="text-lg font-semibold text-foreground">
                    FROM PROMPT LEGO
                  </h2>
                  <Badge variant="secondary" className="bg-tennessee/20 text-tennessee">
                    {legoInsights.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {legoInsights.map((insight) => (
                    <Card 
                      key={insight.id} 
                      className="bg-card border-l-4 border-l-tennessee border-rackley/30 hover:border-tennessee/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-tennessee/20">
                            <Lightbulb className="w-4 h-4 text-tennessee" />
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground font-medium">"{insight.content}"</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-rackley">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(insight.discoveredAt, { addSuffix: true, locale: th })}
                              </span>
                              <span className="flex items-center gap-1 text-tennessee">
                                <Zap className="w-3 h-3" />
                                +{insight.xpEarned} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredInsights.length === 0 && (
              <Card className="bg-card border-rackley/30">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-rackley mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">ไม่พบ Insight</h3>
                  <p className="text-rackley">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-card border-rackley/30">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rackley/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-rackley" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">ยังไม่มี Insights</h2>
              <p className="text-rackley mb-6">เล่นเกมเพื่อค้นพบ Patterns และ Insights ใหม่ๆ</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-turquoise text-oxford-blue hover:bg-turquoise/90">
                  <Link to="/spot">
                    <Eye className="w-4 h-4 mr-2" />
                    เล่น Spot the Difference
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-tennessee text-tennessee hover:bg-tennessee/10">
                  <Link to="/prompt-lego">
                    <Puzzle className="w-4 h-4 mr-2" />
                    เล่น Prompt Lego
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Insights;
