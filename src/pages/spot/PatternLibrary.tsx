import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, Search, ChevronDown, ChevronRight, 
  Lock, Calendar, Gamepad2, Zap, Filter
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useSpot } from '@/contexts/SpotContext';
import { 
  ALL_PATTERNS, 
  PATTERN_CATEGORY_INFO, 
  getPatternsByCategory,
  type PatternCategory 
} from '@/data/spotPatterns';

const PatternLibrary: React.FC = () => {
  const { patternsDiscovered } = useSpot();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['role']);

  // Calculate stats
  const discoveredPatterns = useMemo(() => {
    return ALL_PATTERNS.filter(p => patternsDiscovered.includes(p.text));
  }, [patternsDiscovered]);

  const categoriesWithPatterns = useMemo(() => {
    const categories = new Set<PatternCategory>();
    discoveredPatterns.forEach(p => categories.add(p.category));
    return categories.size;
  }, [discoveredPatterns]);

  const masteryLevel = useMemo(() => {
    return Math.round((discoveredPatterns.length / ALL_PATTERNS.length) * 100);
  }, [discoveredPatterns]);

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    let patterns = discoveredPatterns;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      patterns = patterns.filter(p => 
        p.text.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter !== 'all') {
      patterns = patterns.filter(p => p.category === categoryFilter);
    }
    
    return patterns;
  }, [discoveredPatterns, searchQuery, categoryFilter]);

  // Group patterns by category
  const patternsByCategory = useMemo(() => {
    const grouped: Record<PatternCategory, typeof filteredPatterns> = {
      role: [],
      context: [],
      format: [],
      tone: [],
      efficiency: [],
    };
    
    filteredPatterns.forEach(pattern => {
      grouped[pattern.category].push(pattern);
    });
    
    return grouped;
  }, [filteredPatterns]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const undiscoveredCount = ALL_PATTERNS.length - discoveredPatterns.length;

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
            <div className="p-3 bg-turquoise/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-turquoise" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                💡 Pattern Library
              </h1>
              <p className="text-rackley text-sm">รวม Pattern ที่คุณเรียนรู้จากการเล่น</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">📊 STATS</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Lightbulb className="w-6 h-6 text-turquoise mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{discoveredPatterns.length}</p>
                <p className="text-xs text-rackley">Patterns Learned</p>
              </div>
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Filter className="w-6 h-6 text-tennessee mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{categoriesWithPatterns}/5</p>
                <p className="text-xs text-rackley">Categories Covered</p>
              </div>
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Zap className="w-6 h-6 text-turquoise mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{masteryLevel}%</p>
                <p className="text-xs text-rackley">Mastery Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rackley" />
                <Input
                  placeholder="ค้นหา patterns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-oxford-blue border-rackley/50 text-foreground"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-oxford-blue border-rackley/50 text-foreground">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-rackley/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(PATTERN_CATEGORY_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.icon} {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {discoveredPatterns.length === 0 ? (
          <Card className="bg-card border-rackley/30 mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rackley/20 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-rackley" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">ยังไม่มี Pattern</h3>
              <p className="text-rackley mb-4">
                เล่น Spot the Difference เพื่อค้นพบ Pattern ใหม่!
              </p>
              <Button 
                asChild
                className="bg-turquoise text-oxford-blue hover:bg-turquoise/90"
              >
                <Link to="/spot">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  เริ่มเล่น
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pattern Categories */}
            <div className="space-y-4 mb-6">
              {(Object.entries(PATTERN_CATEGORY_INFO) as [PatternCategory, typeof PATTERN_CATEGORY_INFO.role][]).map(([category, info]) => {
                const patterns = patternsByCategory[category];
                const allCategoryPatterns = getPatternsByCategory(category);
                const isExpanded = expandedCategories.includes(category);

                if (categoryFilter !== 'all' && categoryFilter !== category) return null;

                return (
                  <Collapsible
                    key={category}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <Card className="bg-card border-rackley/30 overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-oxford-blue/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{info.icon}</span>
                            <div className="text-left">
                              <h3 className="font-semibold text-foreground">
                                {info.name.toUpperCase()} PATTERNS
                              </h3>
                              <p className="text-rackley text-sm">
                                {patterns.length}/{allCategoryPatterns.length} discovered
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className="border-0"
                              style={{ 
                                backgroundColor: `${info.color}20`,
                                color: info.color 
                              }}
                            >
                              {patterns.length}
                            </Badge>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-rackley" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-rackley" />
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-3">
                          {patterns.length === 0 ? (
                            <p className="text-rackley text-sm text-center py-4">
                              ยังไม่มี pattern ในหมวดนี้
                            </p>
                          ) : (
                            patterns.map((pattern) => (
                              <div
                                key={pattern.id}
                                className="p-4 bg-oxford-blue rounded-lg border-l-4 hover:scale-[1.01] transition-transform"
                                style={{ borderLeftColor: info.color }}
                              >
                                <p className="text-foreground font-medium mb-2">
                                  💡 "{pattern.text}"
                                </p>
                                <p className="text-rackley text-sm mb-3">
                                  {pattern.description}
                                </p>
                                {pattern.example && (
                                  <p className="text-turquoise text-xs mb-3 bg-turquoise/10 p-2 rounded">
                                    Example: {pattern.example}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-rackley">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    เรียนรู้แล้ว
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Gamepad2 className="w-3 h-3" />
                                    {pattern.relatedChallenges.length} challenges
                                  </span>
                                  <span className="flex items-center gap-1 text-turquoise">
                                    <Zap className="w-3 h-3" />
                                    +30 XP
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>

            {/* Undiscovered Patterns */}
            {undiscoveredCount > 0 && (
              <Card className="bg-card border-rackley/30 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-rackley" />
                    <h3 className="font-semibold text-rackley">
                      UNDISCOVERED PATTERNS ({undiscoveredCount})
                    </h3>
                  </div>
                  <p className="text-rackley text-sm mb-4">
                    เล่นต่อเพื่อค้นพบ Pattern ใหม่!
                  </p>
                  <Button 
                    asChild
                    className="bg-turquoise text-oxford-blue hover:bg-turquoise/90"
                  >
                    <Link to="/spot">
                      🎯 เล่น Spot the Difference
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

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

export default PatternLibrary;
