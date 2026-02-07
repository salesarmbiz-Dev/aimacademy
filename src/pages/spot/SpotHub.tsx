import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Eye, Trophy, Target, Flame, Lightbulb, Lock, 
  Shuffle, Zap, Star, AlertTriangle, UserPlus 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSpot } from '@/contexts/SpotContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useGameTracking } from '@/hooks/useGameTracking';
import { CATEGORIES, getChallengesByCategory } from '@/data/spotChallenges';
import SkillRadarChart from '@/components/spot/SkillRadarChart';
import DailyChallengeCard from '@/components/spot/DailyChallengeCard';
import BadgesPreview from '@/components/spot/BadgesPreview';
import QuickLinksCard from '@/components/spot/QuickLinksCard';
import StreakMilestones from '@/components/spot/StreakMilestones';

const SpotHub: React.FC = () => {
  const navigate = useNavigate();
  const { isGuestMode, guestChallengesRemaining } = useAuth();
  const { stats } = useUser();
  const { 
    challengesCompleted, 
    correctAnswers, 
    currentStreak, 
    longestStreak,
    gameXp,
    skills,
    patternsDiscovered,
  } = useSpot();
  const { startGame } = useGameTracking('spot-the-difference');
  const hasTrackedRef = useRef(false);

  // Track game entry when hub is viewed
  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
    }
  }, []);

  const accuracy = challengesCompleted > 0 
    ? Math.round((correctAnswers / challengesCompleted) * 100) 
    : 0;

  // Calculate category progress (mock - will use real data later)
  const getCategoryProgress = (categoryId: string) => {
    const challenges = getChallengesByCategory(categoryId as any);
    const completed = Math.min(challengesCompleted, challenges.length);
    return { completed, total: challenges.length };
  };

  const skillsList = [
    { key: 'roleDetection', name: 'Role Detection', value: skills.roleDetection },
    { key: 'contextClarity', name: 'Context Clarity', value: skills.contextClarity },
    { key: 'formatMatching', name: 'Format Matching', value: skills.formatMatching },
    { key: 'toneAlignment', name: 'Tone Alignment', value: skills.toneAlignment },
    { key: 'efficiency', name: 'Efficiency', value: skills.efficiency },
  ];

  const handlePlayCategory = (categoryId: string) => {
    startGame({ category: categoryId });
    navigate(`/spot/play/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-rackley" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-turquoise/20 rounded-xl">
                <Eye className="w-8 h-8 text-turquoise" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  🎯 Spot the Difference
                </h1>
                <p className="text-rackley text-sm">จับผิด 2 Prompts - อันไหนดีกว่า?</p>
              </div>
            </div>
          </div>
          
          {/* Header Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
              <Flame className="w-4 h-4 text-tennessee" />
              <span className="text-foreground font-semibold">{currentStreak}</span>
              <span className="text-rackley text-sm">streak</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
              <Star className="w-4 h-4 text-tennessee" />
              <span className="text-tennessee font-semibold">{gameXp.toLocaleString()}</span>
              <span className="text-rackley text-sm">XP</span>
            </div>
          </div>
        </div>

        {/* Guest Mode Warning */}
        {isGuestMode && (
          <Card className="bg-tennessee/10 border-tennessee/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-tennessee" />
                  <div>
                    <p className="text-tennessee font-semibold">Guest Mode - เหลืออีก {guestChallengesRemaining} ข้อ</p>
                    <p className="text-rackley text-sm">สร้าง Account เพื่อบันทึก Progress และ XP</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-tennessee text-foreground hover:bg-tennessee/90"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  สมัครฟรี
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Stats */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">📊 YOUR PROGRESS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Trophy className="w-6 h-6 text-turquoise mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{challengesCompleted}</p>
                <p className="text-xs text-rackley">Completed</p>
              </div>
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Target className="w-6 h-6 text-tennessee mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-rackley">Accuracy</p>
              </div>
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Flame className="w-6 h-6 text-tennessee mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
                <p className="text-xs text-rackley">Best Streak</p>
              </div>
              <div className="text-center p-4 bg-oxford-blue rounded-xl">
                <Lightbulb className="w-6 h-6 text-turquoise mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{patternsDiscovered.length}</p>
                <p className="text-xs text-rackley">Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Levels with Radar Chart */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">📈 SKILL LEVELS</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Progress bars */}
              <div className="flex-1 space-y-4">
                {skillsList.map((skill) => (
                  <div key={skill.key} className="flex items-center gap-4">
                    <span className="text-sm text-rackley w-32 flex-shrink-0">{skill.name}</span>
                    <div className="flex-1">
                      <Progress 
                        value={skill.value} 
                        className="h-2 bg-oxford-blue"
                      />
                    </div>
                    <span className="text-sm text-foreground font-semibold w-12 text-right">
                      {skill.value}%
                    </span>
                  </div>
                ))}
              </div>
              {/* Radar chart */}
              <div className="hidden lg:flex items-center justify-center">
                <SkillRadarChart skills={skills} size={200} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Preview & Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <BadgesPreview />
          <QuickLinksCard />
        </div>

        {/* Streak Milestones */}
        <div className="mb-6">
          <StreakMilestones />
        </div>

        {/* Categories */}
        <h2 className="text-lg font-semibold text-foreground mb-4">📂 CATEGORIES</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {CATEGORIES.map((category) => {
            const progress = getCategoryProgress(category.id);
            const isLocked = category.requiredLevel > stats.level;
            const colorClass = category.color === 'turquoise' 
              ? 'border-turquoise/30 hover:border-turquoise hover:shadow-[0_0_20px_rgba(5,242,242,0.15)]'
              : category.color === 'tennessee'
              ? 'border-tennessee/30 hover:border-tennessee hover:shadow-[0_0_20px_rgba(242,116,5,0.15)]'
              : 'border-rackley/30';

            return (
              <Card 
                key={category.id}
                className={`bg-card transition-all duration-300 ${colorClass} ${isLocked ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => !isLocked && handlePlayCategory(category.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    {isLocked && <Lock className="w-5 h-5 text-rackley" />}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-rackley text-sm mb-3">{category.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-rackley mb-1">
                      <span>{progress.completed}/{progress.total}</span>
                      <span>{Math.round((progress.completed / progress.total) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(progress.completed / progress.total) * 100} 
                      className="h-1.5 bg-oxford-blue"
                    />
                  </div>

                  {isLocked ? (
                    <Badge variant="outline" className="text-rackley border-rackley/50">
                      Level {category.requiredLevel} Required
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className={`w-full ${
                        category.color === 'turquoise' 
                          ? 'bg-turquoise/20 text-turquoise hover:bg-turquoise hover:text-oxford-blue'
                          : 'bg-tennessee/20 text-tennessee hover:bg-tennessee hover:text-foreground'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayCategory(category.id);
                      }}
                    >
                      เล่น
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Random Mix Card */}
          <Card 
            className="bg-card border-turquoise/30 hover:border-turquoise hover:shadow-[0_0_20px_rgba(5,242,242,0.15)] transition-all duration-300 cursor-pointer"
            onClick={() => handlePlayCategory('random')}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">🎲</span>
                <Badge className="bg-turquoise/20 text-turquoise border-0">
                  ∞ Unlimited
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Random Mix</h3>
              <p className="text-rackley text-sm mb-3">สุ่มจากทุกหมวด</p>
              
              <Button 
                size="sm" 
                className="w-full bg-turquoise/20 text-turquoise hover:bg-turquoise hover:text-oxford-blue"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                เล่น
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Challenge */}
        <DailyChallengeCard />
      </div>
    </div>
  );
};

export default SpotHub;
