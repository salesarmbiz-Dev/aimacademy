import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Flame, Lightbulb, Keyboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSpot } from '@/contexts/SpotContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAnimations } from '@/contexts/AnimationContext';
import { 
  SPOT_CHALLENGES, 
  getChallengesByCategory, 
  getRandomChallenge,
  calculateXP,
  type SpotChallengeData 
} from '@/data/spotChallenges';
import SpotResultModal from '@/components/spot/SpotResultModal';
import GuestLimitModal from '@/components/spot/GuestLimitModal';

const SpotGamePlay: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isGuestMode, guestChallengesRemaining, decrementGuestChallenges } = useAuth();
  const { triggerXP } = useAnimations();
  const { 
    currentStreak, 
    submitAnswer, 
    addPattern,
    challengesCompleted,
  } = useSpot();

  const [challenge, setChallenge] = useState<SpotChallengeData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showGuestLimit, setShowGuestLimit] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(1);

  // Get challenges for category
  const getChallengesForCategory = useCallback(() => {
    if (categoryId === 'random' || categoryId === 'daily') {
      return SPOT_CHALLENGES;
    }
    return getChallengesByCategory(categoryId as any);
  }, [categoryId]);

  // Load next challenge
  const loadNextChallenge = useCallback(() => {
    const challenges = getChallengesForCategory();
    const available = challenges.filter(c => !completedIds.includes(c.id));
    
    if (available.length === 0) {
      // Category completed
      navigate('/spot');
      return;
    }

    const next = categoryId === 'random' || categoryId === 'daily'
      ? getRandomChallenge(completedIds)
      : available[0];

    setChallenge(next);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setUsedHint(false);
    setResult(null);
  }, [categoryId, completedIds, getChallengesForCategory, navigate]);

  // Initial load
  useEffect(() => {
    loadNextChallenge();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) return;
      
      if (e.key === 'a' || e.key === 'A' || e.key === '1') {
        handleSelectAnswer('A');
      } else if (e.key === 'b' || e.key === 'B' || e.key === '2') {
        handleSelectAnswer('B');
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHint(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult]);

  const handleSelectAnswer = (answer: 'A' | 'B') => {
    if (!challenge || showResult) return;

    // Check guest limit
    if (isGuestMode && guestChallengesRemaining <= 0) {
      setShowGuestLimit(true);
      return;
    }

    setSelectedAnswer(answer);
    
    const correct = answer === challenge.correctAnswer;
    const xpEarned = calculateXP(correct, currentStreak, usedHint);
    
    // Submit answer to context
    submitAnswer(challenge.id, answer);
    
    // Add pattern if correct and new
    if (correct && challenge.patternLearned) {
      addPattern(challenge.patternLearned);
    }

    // Trigger XP animation
    if (xpEarned > 0) {
      triggerXP(xpEarned);
    }

    // Decrement guest challenges
    if (isGuestMode) {
      decrementGuestChallenges();
    }

    setResult({ correct, xpEarned });
    setCompletedIds(prev => [...prev, challenge.id]);
    setShowResult(true);
  };

  const handleNextChallenge = () => {
    // Check guest limit
    if (isGuestMode && guestChallengesRemaining <= 0) {
      setShowGuestLimit(true);
      return;
    }
    
    setChallengeIndex(prev => prev + 1);
    loadNextChallenge();
  };

  const handleUseHint = () => {
    setShowHint(true);
    setUsedHint(true);
  };

  const getCategoryName = () => {
    switch (categoryId) {
      case 'social-media': return 'Social Media';
      case 'email': return 'Email';
      case 'ad-copy': return 'Ad Copy';
      case 'customer-service': return 'Customer Service';
      case 'content': return 'Content Writing';
      case 'random': return 'Random Mix';
      case 'daily': return 'Daily Challenge';
      default: return 'Challenge';
    }
  };

  const totalChallenges = getChallengesForCategory().length;

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 animate-pulse" />
          <p className="text-rackley">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/spot" 
              className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-rackley" />
            </Link>
            <span className="text-foreground font-semibold">{getCategoryName()}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
              <Flame className="w-4 h-4 text-tennessee" />
              <span className="text-foreground font-semibold">{currentStreak}</span>
            </div>
            <Badge variant="outline" className="border-rackley text-rackley">
              ข้อ {challengeIndex}/{categoryId === 'random' ? '∞' : totalChallenges}
            </Badge>
          </div>
        </div>

        {/* Challenge Context */}
        <Card className="bg-card border-rackley/30 mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-rackley uppercase tracking-wider">CHALLENGE</span>
            </div>
            <p className="text-foreground text-lg md:text-xl font-medium">
              {challenge.context}
            </p>
          </CardContent>
        </Card>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Card A */}
          <Card 
            className={`bg-card transition-all duration-200 cursor-pointer ${
              selectedAnswer === 'A' 
                ? 'border-2 border-rackley shadow-[0_0_20px_rgba(101,147,166,0.3)]' 
                : 'border-rackley/30 hover:border-rackley hover:-translate-y-1'
            }`}
            onClick={() => !showResult && handleSelectAnswer('A')}
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-rackley/20">
                <div className="w-10 h-10 rounded-full bg-rackley flex items-center justify-center">
                  <span className="text-oxford-blue font-bold text-lg">A</span>
                </div>
                <span className="font-semibold text-foreground">Option A</span>
              </div>

              {/* Prompt */}
              <div className="p-4 border-b border-rackley/20">
                <p className="text-xs text-rackley uppercase tracking-wider mb-2">PROMPT:</p>
                <div className="bg-oxford-blue rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-foreground text-sm whitespace-pre-wrap">{challenge.promptA.text}</p>
                </div>
              </div>

              {/* Output */}
              <div className="p-4">
                <p className="text-xs text-rackley uppercase tracking-wider mb-2">OUTPUT:</p>
                <div className="bg-root-beer/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-foreground text-sm whitespace-pre-wrap">{challenge.promptA.output}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card B */}
          <Card 
            className={`bg-card transition-all duration-200 cursor-pointer ${
              selectedAnswer === 'B' 
                ? 'border-2 border-tennessee shadow-[0_0_20px_rgba(242,116,5,0.3)]' 
                : 'border-tennessee/30 hover:border-tennessee hover:-translate-y-1'
            }`}
            onClick={() => !showResult && handleSelectAnswer('B')}
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-tennessee/20">
                <div className="w-10 h-10 rounded-full bg-tennessee flex items-center justify-center">
                  <span className="text-foreground font-bold text-lg">B</span>
                </div>
                <span className="font-semibold text-foreground">Option B</span>
              </div>

              {/* Prompt */}
              <div className="p-4 border-b border-tennessee/20">
                <p className="text-xs text-rackley uppercase tracking-wider mb-2">PROMPT:</p>
                <div className="bg-oxford-blue rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-foreground text-sm whitespace-pre-wrap">{challenge.promptB.text}</p>
                </div>
              </div>

              {/* Output */}
              <div className="p-4">
                <p className="text-xs text-rackley uppercase tracking-wider mb-2">OUTPUT:</p>
                <div className="bg-root-beer/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-foreground text-sm whitespace-pre-wrap">{challenge.promptB.output}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Choice Buttons */}
        {!showResult && (
          <div className="flex gap-4 justify-center mb-6">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 max-w-xs border-rackley text-rackley hover:bg-rackley hover:text-oxford-blue"
              onClick={() => handleSelectAnswer('A')}
            >
              เลือก A
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 max-w-xs border-tennessee text-tennessee hover:bg-tennessee hover:text-foreground"
              onClick={() => handleSelectAnswer('B')}
            >
              เลือก B
            </Button>
          </div>
        )}

        {/* Hint Section */}
        {!showResult && (
          <Card className="bg-card border-rackley/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-tennessee" />
                  <span className="text-foreground font-medium">💡 ต้องการ Hint?</span>
                </div>
                {!showHint ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-tennessee text-tennessee hover:bg-tennessee/10"
                    onClick={handleUseHint}
                  >
                    ขอ Hint (-10 XP)
                  </Button>
                ) : (
                  <Badge className="bg-tennessee/20 text-tennessee border-0">-10 XP</Badge>
                )}
              </div>
              {showHint && (
                <p className="mt-3 text-rackley text-sm bg-oxford-blue rounded-lg p-3">
                  {challenge.hint}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Keyboard Shortcut Hint */}
        {!showResult && (
          <div className="flex items-center justify-center gap-2 mt-4 text-rackley text-xs">
            <Keyboard className="w-4 h-4" />
            <span>กด A หรือ B เพื่อเลือก • H เพื่อดู Hint</span>
          </div>
        )}

        {/* Result Modal */}
        {showResult && result && (
          <SpotResultModal
            isOpen={showResult}
            challenge={challenge}
            selectedAnswer={selectedAnswer!}
            result={result}
            streak={currentStreak}
            usedHint={usedHint}
            onNext={handleNextChallenge}
            onClose={() => navigate('/spot')}
          />
        )}

        {/* Guest Limit Modal */}
        <GuestLimitModal 
          isOpen={showGuestLimit}
          correctCount={challengesCompleted}
          totalCount={5}
          onClose={() => setShowGuestLimit(false)}
        />
      </div>
    </div>
  );
};

export default SpotGamePlay;
