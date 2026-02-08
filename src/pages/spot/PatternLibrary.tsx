import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, Search, ChevronDown, ChevronRight, 
  Lock, Calendar, Gamepad2, Zap, Filter, Copy, Save, ChevronUp
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { 
  ALL_PATTERNS, 
  PATTERN_CATEGORY_INFO, 
  getPatternsByCategory,
  getPatternIdFromText,
  type PatternCategory,
  type PatternData 
} from '@/data/spotPatterns';
import { SPOT_CHALLENGES, type SpotChallengeData } from '@/data/spotChallenges';

const PatternLibrary: React.FC = () => {
  const { patternsDiscovered } = useSpot();
  const { user, isGuestMode } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['role']);
  const [savedPatternIds, setSavedPatternIds] = useState<string[]>([]);
  const [expandedPatternId, setExpandedPatternId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

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

  // Load saved status on mount
  useEffect(() => {
    async function loadSavedStatus() {
      if (!user?.id || isGuestMode) return;
      
      const { data } = await supabase
        .from('user_assets')
        .select('title')
        .eq('user_id', user.id)
        .eq('source_game', 'spot-the-difference');
      
      if (data) {
        // Match saved assets back to pattern IDs by title (pattern text)
        const savedIds = data
          .map(asset => {
            const pattern = ALL_PATTERNS.find(p => p.text === asset.title);
            return pattern?.id;
          })
          .filter(Boolean) as string[];
        setSavedPatternIds(savedIds);
      }
    }
    loadSavedStatus();
  }, [user?.id, isGuestMode]);

  // Find related challenge for a pattern
  const getRelatedChallenge = (pattern: PatternData): SpotChallengeData | undefined => {
    return SPOT_CHALLENGES.find(c => c.patternLearned === pattern.text);
  };

  // Copy pattern handler
  const handleCopyPattern = async (pattern: PatternData) => {
    const categoryInfo = PATTERN_CATEGORY_INFO[pattern.category];
    const formattedText = `📋 Pattern: ${pattern.text}

📝 คำอธิบาย: ${pattern.description}

✅ ตัวอย่าง: ${pattern.example || 'N/A'}

🏷️ หมวด: ${categoryInfo.nameTh}

— Discovered in AIM Academy: Spot the Difference`;

    try {
      await navigator.clipboard.writeText(formattedText);
      toast({ 
        title: '📋 Copy Pattern แล้ว!',
        description: 'วางได้เลยที่อื่น'
      });
    } catch (error) {
      toast({ 
        title: '❌ Copy ไม่สำเร็จ',
        variant: 'destructive'
      });
    }
  };

  // Save pattern handler
  const handleSavePattern = async (pattern: PatternData) => {
    if (!user?.id || isGuestMode) {
      toast({ 
        title: '🔒 ต้องเข้าสู่ระบบก่อน',
        description: 'เข้าสู่ระบบเพื่อบันทึก Pattern',
        variant: 'destructive'
      });
      return;
    }

    if (savedPatternIds.includes(pattern.id)) return;

    const relatedChallenge = getRelatedChallenge(pattern);
    const categoryInfo = PATTERN_CATEGORY_INFO[pattern.category];
    
    // Determine good/bad prompts
    const isACorrect = relatedChallenge?.correctAnswer === 'A';
    const goodPrompt = isACorrect ? relatedChallenge?.promptA : relatedChallenge?.promptB;
    const badPrompt = isACorrect ? relatedChallenge?.promptB : relatedChallenge?.promptA;

    const contentJson: Json = {
      pattern_text: pattern.text,
      description: pattern.description,
      example: pattern.example || null,
      category: pattern.category,
      category_name_th: categoryInfo.nameTh,
      bad_prompt: badPrompt?.text || null,
      good_prompt: goodPrompt?.text || null,
      bad_output: badPrompt?.output || null,
      good_output: goodPrompt?.output || null,
      why_correct: relatedChallenge?.explanation?.whyCorrect || null,
      why_wrong: relatedChallenge?.explanation?.whyWrong || null,
    };

    const qualityScore = relatedChallenge 
      ? Math.max(relatedChallenge.promptA.score, relatedChallenge.promptB.score) 
      : null;

    const insertData = {
      user_id: user.id,
      title: pattern.text,
      description: pattern.description,
      content_json: contentJson,
      source_game: 'spot-the-difference',
      quality_score: qualityScore,
      tags: [pattern.category, categoryInfo.nameTh],
      category: 'pattern' as const,
    };
    
    const { error } = await supabase.from('user_assets').insert([insertData]);

    if (!error) {
      setSavedPatternIds(prev => [...prev, pattern.id]);
      toast({ 
        title: '💾 บันทึก Pattern แล้ว!', 
        description: 'ดูได้ใน Asset Library' 
      });
    } else {
      toast({ 
        title: '❌ บันทึกไม่สำเร็จ',
        description: error.message, 
        variant: 'destructive' 
      });
    }
  };

  // Save all patterns handler
  const handleSaveAllPatterns = async () => {
    if (!user?.id || isGuestMode) {
      toast({ 
        title: '🔒 ต้องเข้าสู่ระบบก่อน',
        description: 'เข้าสู่ระบบเพื่อบันทึก Pattern',
        variant: 'destructive'
      });
      return;
    }

    const unsavedPatterns = discoveredPatterns.filter(p => !savedPatternIds.includes(p.id));
    if (unsavedPatterns.length === 0) {
      toast({ title: '✅ บันทึกหมดแล้ว!' });
      return;
    }

    setSavingAll(true);
    let savedCount = 0;

    for (const pattern of unsavedPatterns) {
      const relatedChallenge = getRelatedChallenge(pattern);
      const categoryInfo = PATTERN_CATEGORY_INFO[pattern.category];
      
      const isACorrect = relatedChallenge?.correctAnswer === 'A';
      const goodPrompt = isACorrect ? relatedChallenge?.promptA : relatedChallenge?.promptB;
      const badPrompt = isACorrect ? relatedChallenge?.promptB : relatedChallenge?.promptA;

      const contentJson: Json = {
        pattern_text: pattern.text,
        description: pattern.description,
        example: pattern.example || null,
        category: pattern.category,
        category_name_th: categoryInfo.nameTh,
        bad_prompt: badPrompt?.text || null,
        good_prompt: goodPrompt?.text || null,
        bad_output: badPrompt?.output || null,
        good_output: goodPrompt?.output || null,
        why_correct: relatedChallenge?.explanation?.whyCorrect || null,
        why_wrong: relatedChallenge?.explanation?.whyWrong || null,
      };

      const insertData = {
        user_id: user.id,
        title: pattern.text,
        description: pattern.description,
        content_json: contentJson,
        source_game: 'spot-the-difference',
        quality_score: relatedChallenge 
          ? Math.max(relatedChallenge.promptA.score, relatedChallenge.promptB.score) 
          : null,
        tags: [pattern.category, categoryInfo.nameTh],
        category: 'pattern' as const,
      };
      
      const { error } = await supabase.from('user_assets').insert([insertData]);

      if (!error) {
        savedCount++;
        setSavedPatternIds(prev => [...prev, pattern.id]);
      }
    }

    setSavingAll(false);
    toast({ 
      title: `✅ บันทึก ${savedCount} patterns แล้ว!`,
      description: 'ดูได้ใน Asset Library'
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePatternExpand = (patternId: string) => {
    setExpandedPatternId(prev => prev === patternId ? null : patternId);
  };

  const undiscoveredCount = ALL_PATTERNS.length - discoveredPatterns.length;
  const unsavedCount = discoveredPatterns.filter(p => !savedPatternIds.includes(p.id)).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/spot" 
            className="p-2 rounded-lg bg-card hover:bg-secondary/20 transition-colors"
            aria-label="กลับ Spot Hub"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                💡 Pattern Library
              </h1>
              <p className="text-muted-foreground text-sm">รวม Pattern ที่คุณเรียนรู้จากการเล่น</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">📊 STATS</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-secondary rounded-xl">
                <Lightbulb className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{discoveredPatterns.length}</p>
                <p className="text-xs text-muted-foreground">Patterns Learned</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <Filter className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{categoriesWithPatterns}/5</p>
                <p className="text-xs text-muted-foreground">Categories Covered</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{masteryLevel}%</p>
                <p className="text-xs text-muted-foreground">Mastery Level</p>
              </div>
            </div>

            {/* Save All Button */}
            {!isGuestMode && discoveredPatterns.length > 0 && unsavedCount > 0 && (
              <Button
                onClick={handleSaveAllPatterns}
                disabled={savingAll}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                aria-label="บันทึก patterns ทั้งหมด"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingAll 
                  ? 'กำลังบันทึก...' 
                  : `💾 Save All to Library (${unsavedCount} patterns)`
                }
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา patterns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border text-foreground"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
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
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">ยังไม่มี Pattern</h3>
              <p className="text-muted-foreground mb-4">
                เล่น Spot the Difference เพื่อค้นพบ Pattern ใหม่!
              </p>
              <Button 
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                    <Card className="bg-card border-border overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{info.icon}</span>
                            <div className="text-left">
                              <h3 className="font-semibold text-foreground">
                                {info.name.toUpperCase()} PATTERNS
                              </h3>
                              <p className="text-muted-foreground text-sm">
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
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-3">
                          {patterns.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-4">
                              ยังไม่มี pattern ในหมวดนี้
                            </p>
                          ) : (
                            patterns.map((pattern) => {
                              const relatedChallenge = getRelatedChallenge(pattern);
                              const isPatternExpanded = expandedPatternId === pattern.id;
                              const isSaved = savedPatternIds.includes(pattern.id);
                              
                              // Get good/bad prompts
                              const isACorrect = relatedChallenge?.correctAnswer === 'A';
                              const goodPrompt = isACorrect ? relatedChallenge?.promptA : relatedChallenge?.promptB;
                              const badPrompt = isACorrect ? relatedChallenge?.promptB : relatedChallenge?.promptA;

                              return (
                                <div
                                  key={pattern.id}
                                  className="p-4 bg-secondary rounded-lg border-l-4 transition-all"
                                  style={{ borderLeftColor: info.color }}
                                >
                                  <p className="text-foreground font-medium mb-2">
                                    💡 "{pattern.text}"
                                  </p>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    {pattern.description}
                                  </p>
                                  {pattern.example && (
                                    <p className="text-primary text-xs mb-3 bg-primary/10 p-2 rounded">
                                      Example: {pattern.example}
                                    </p>
                                  )}
                                  
                                  {/* Info Row */}
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      เรียนรู้แล้ว
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Gamepad2 className="w-3 h-3" />
                                      {pattern.relatedChallenges.length} challenges
                                    </span>
                                    <span className="flex items-center gap-1 text-primary">
                                      <Zap className="w-3 h-3" />
                                      +30 XP
                                    </span>
                                  </div>

                                  {/* Action Buttons Row */}
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <button
                                      onClick={() => handleCopyPattern(pattern)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
                                      aria-label="Copy pattern"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Copy
                                    </button>
                                    
                                    {!isGuestMode && (
                                      <button
                                        onClick={() => handleSavePattern(pattern)}
                                        disabled={isSaved}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                          isSaved
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                                            : 'bg-accent/10 text-accent hover:bg-accent/20'
                                        }`}
                                        aria-label={isSaved ? 'บันทึกแล้ว' : 'บันทึก pattern'}
                                      >
                                        {isSaved ? '✅ Saved' : (
                                          <>
                                            <Save className="w-3 h-3" />
                                            Save
                                          </>
                                        )}
                                      </button>
                                    )}

                                    {relatedChallenge && (
                                      <button
                                        onClick={() => togglePatternExpand(pattern.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition-colors ml-auto"
                                        aria-label={isPatternExpanded ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง Prompt'}
                                      >
                                        {isPatternExpanded ? (
                                          <>
                                            ซ่อนตัวอย่าง
                                            <ChevronUp className="w-3 h-3" />
                                          </>
                                        ) : (
                                          <>
                                            ดูตัวอย่าง Prompt
                                            <ChevronDown className="w-3 h-3" />
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>

                                  {/* Expanded View: Full Prompt Comparison */}
                                  {isPatternExpanded && relatedChallenge && (
                                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                                      {/* Context */}
                                      <p className="text-sm text-muted-foreground italic">
                                        📋 {relatedChallenge.context}
                                      </p>

                                      {/* Bad Prompt */}
                                      <div className="bg-destructive/10 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-destructive mb-2">
                                          ❌ Prompt ที่อ่อน (Score: {badPrompt?.score})
                                        </p>
                                        <p className="text-sm text-foreground font-mono bg-background/50 p-3 rounded-lg">
                                          {badPrompt?.text}
                                        </p>
                                        {badPrompt?.weaknesses && badPrompt.weaknesses.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            {badPrompt.weaknesses.map((w, i) => (
                                              <span key={i} className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">
                                                {w}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Good Prompt */}
                                      <div className="bg-emerald-500/10 dark:bg-emerald-500/10 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                                          ✅ Prompt ที่แข็ง (Score: {goodPrompt?.score})
                                        </p>
                                        <p className="text-sm text-foreground font-mono bg-background/50 p-3 rounded-lg">
                                          {goodPrompt?.text}
                                        </p>
                                        {goodPrompt?.strengths && goodPrompt.strengths.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            {goodPrompt.strengths.map((s, i) => (
                                              <span key={i} className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                                                {s}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Why */}
                                      <div className="bg-primary/10 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-primary mb-2">
                                          💡 ทำไมถึงดีกว่า
                                        </p>
                                        <ul className="text-sm text-foreground space-y-1">
                                          {relatedChallenge.explanation.whyCorrect.map((reason, i) => (
                                            <li key={i}>• {reason}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
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
              <Card className="bg-card border-border mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-muted-foreground">
                      UNDISCOVERED PATTERNS ({undiscoveredCount})
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    เล่นต่อเพื่อค้นพบ Pattern ใหม่!
                  </p>
                  <Button 
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
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
            className="border-border text-muted-foreground hover:bg-muted"
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
