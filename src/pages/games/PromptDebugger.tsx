import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Bug, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp,
  X,
  Lightbulb,
  Clock,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LevelCard } from '@/components/games/debugger/LevelCard';
import { PromptDisplay } from '@/components/games/debugger/PromptDisplay';
import { BugTypeSelector } from '@/components/games/debugger/BugTypeSelector';
import { ResultsModal } from '@/components/games/debugger/ResultsModal';
import { GameSummary } from '@/components/games/debugger/GameSummary';
import { useDebuggerProgress } from '@/hooks/useDebuggerProgress';
import { useGameTracking } from '@/hooks/useGameTracking';
import { debuggerLevels, bugTypeInfo, type BugType, type DebuggerLevel } from '@/data/debuggerLevels';
import type { SelectedBug, GameState, LevelProgress } from '@/components/games/debugger/types';

type View = 'levelSelect' | 'gameplay' | 'summary';

const PromptDebugger: React.FC = () => {
  const navigate = useNavigate();
  const { levelProgress, loading, saveLevelResult, getHighestUnlockedLevel } = useDebuggerProgress();
  const { startGame, endGame, exitGame, trackLevel } = useGameTracking('prompt-debugger');

  // View state
  const [currentView, setCurrentView] = useState<View>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [bugTypesExpanded, setBugTypesExpanded] = useState(false);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    currentStep: 'read',
    selectedBugs: [],
    userFixes: {},
    wrongAttempts: {},
    timeElapsed: 0,
    hintsUsed: 0,
  });

  // Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [levelResult, setLevelResult] = useState<LevelProgress | null>(null);

  // Current level data
  const currentLevel: DebuggerLevel | null = selectedLevel 
    ? debuggerLevels.find(l => l.level === selectedLevel) || null
    : null;

  // Start timer when gameplay begins
  useEffect(() => {
    if (currentView === 'gameplay' && !showResults) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentView, showResults]);

  // Level selection handlers
  const handleLevelSelect = (level: number) => {
    const highestUnlocked = getHighestUnlockedLevel();
    if (level <= highestUnlocked) {
      setSelectedLevel(level);
      setGameState({
        currentStep: 'read',
        selectedBugs: [],
        userFixes: {},
        wrongAttempts: {},
        timeElapsed: 0,
        hintsUsed: 0,
      });
      setShowResults(false);
      setLevelResult(null);
      setCurrentView('gameplay');
      
      // Track game start for this level
      startGame({ level });
    }
  };

  const handleStartNextUnlocked = () => {
    const highestUnlocked = getHighestUnlockedLevel();
    const nextIncomplete = Array.from({ length: 10 }, (_, i) => i + 1)
      .find(l => !levelProgress.get(l)?.completed && l <= highestUnlocked);
    
    if (nextIncomplete) {
      handleLevelSelect(nextIncomplete);
    } else {
      handleLevelSelect(highestUnlocked);
    }
  };

  // Bug selection handlers
  const handleBugSelect = (bug: SelectedBug) => {
    setGameState(prev => ({
      ...prev,
      selectedBugs: [...prev.selectedBugs, bug],
      currentStep: 'identify',
    }));
  };

  const handleBugDeselect = (bugId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedBugs: prev.selectedBugs.filter(b => b.id !== bugId),
      currentStep: prev.selectedBugs.length <= 1 ? 'read' : 'identify',
    }));
  };

  // Bug type identification
  const handleBugTypeSelect = (bugId: string, type: BugType) => {
    if (!currentLevel) return;

    const bugDef = currentLevel.bugs.find(b => b.id === bugId);
    if (!bugDef) return;

    const isCorrect = type === bugDef.bugType;
    const currentWrongAttempts = gameState.wrongAttempts[bugId] || 0;

    setGameState(prev => {
      const updatedBugs = prev.selectedBugs.map(b => {
        if (b.id === bugId) {
          return { ...b, identifiedType: type, isCorrect };
        }
        return b;
      });

      const updatedWrongAttempts = {
        ...prev.wrongAttempts,
        [bugId]: isCorrect ? currentWrongAttempts : currentWrongAttempts + 1,
      };

      // Check if all bugs are correctly identified
      const allBugsIdentified = updatedBugs.every(b => b.isCorrect);
      const allBugsFound = updatedBugs.length >= currentLevel.bugCount;

      return {
        ...prev,
        selectedBugs: updatedBugs,
        wrongAttempts: updatedWrongAttempts,
        currentStep: allBugsIdentified && allBugsFound ? 'fix' : 'identify',
      };
    });
  };

  // Fix submission
  const handleFixChange = (bugId: string, fix: string) => {
    setGameState(prev => ({
      ...prev,
      userFixes: { ...prev.userFixes, [bugId]: fix },
    }));
  };

  const handleSubmitFixes = useCallback(() => {
    if (!currentLevel) return;

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate score
    const bugsFound = gameState.selectedBugs.length;
    const typesCorrect = gameState.selectedBugs.filter(b => b.isCorrect).length;
    
    // Bug detection score (40 points)
    const bugDetectionScore = Math.round((bugsFound / currentLevel.bugCount) * 40);
    
    // Bug type identification score (30 points)
    const typeScore = Math.round((typesCorrect / currentLevel.bugCount) * 30);
    
    // Fix quality score (20 points) - simplified keyword matching
    let fixQualityScore = 0;
    currentLevel.bugs.forEach(bug => {
      const userFix = gameState.userFixes[bug.id] || '';
      if (userFix.length > 10) {
        // Basic check: user wrote something substantial
        fixQualityScore += 20 / currentLevel.bugCount;
      }
    });
    fixQualityScore = Math.round(fixQualityScore);
    
    // Time bonus (10 points)
    let timeBonus = 0;
    if (gameState.timeElapsed <= currentLevel.parTimeSeconds) {
      timeBonus = 10;
    } else if (gameState.timeElapsed <= currentLevel.parTimeSeconds * 1.5) {
      timeBonus = 5;
    }

    const totalScore = Math.min(100, bugDetectionScore + typeScore + fixQualityScore + timeBonus);
    
    // Star rating
    let stars = 0;
    if (totalScore >= 85) stars = 3;
    else if (totalScore >= 60) stars = 2;
    else if (totalScore >= 30) stars = 1;

    // XP calculation
    const xpEarned = Math.max(5, Math.round(currentLevel.xpReward * (totalScore / 100)));

    const result: LevelProgress = {
      level: currentLevel.level,
      score: totalScore,
      stars,
      completed: true,
      bugsFound,
      typesCorrect,
      fixQualityScore,
      timeSeconds: gameState.timeElapsed,
      xpEarned,
    };

    // Track level completion
    trackLevel(currentLevel.level, totalScore, {
      bugs_found: bugsFound,
      types_correct: typesCorrect,
      time_seconds: gameState.timeElapsed,
      xp_earned: xpEarned,
      stars,
    });

    setLevelResult(result);
    saveLevelResult(currentLevel.level, result);
    setShowResults(true);
  }, [currentLevel, gameState, saveLevelResult, trackLevel]);

  // Navigation handlers
  const handleExitGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Track exit without completion
    if (selectedLevel) {
      exitGame(gameState.selectedBugs.length > 0 ? 50 : 0, { level: selectedLevel });
    }
    setCurrentView('levelSelect');
    setSelectedLevel(null);
  };

  const handleNextLevel = () => {
    if (selectedLevel && selectedLevel < 10) {
      handleLevelSelect(selectedLevel + 1);
    } else {
      // Track overall game completion when all levels done
      const totalXp = Array.from(levelProgress.values()).reduce((sum, p) => sum + (p.xpEarned || 0), 0);
      const avgScore = completedCount > 0 
        ? Math.round(Array.from(levelProgress.values()).reduce((sum, p) => sum + p.score, 0) / completedCount)
        : 0;
      endGame(avgScore, totalXp, { levels_completed: completedCount });
      setCurrentView('summary');
    }
  };

  const handleReplay = () => {
    if (selectedLevel) {
      handleLevelSelect(selectedLevel);
    }
  };

  const handleBackToHub = () => {
    navigate('/games');
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get completed count
  const completedCount = Array.from(levelProgress.values()).filter(p => p.completed).length;
  const highestUnlocked = getHighestUnlockedLevel();

  // Check if all bugs are found and identified
  const allBugsFoundAndIdentified = currentLevel && 
    gameState.selectedBugs.length >= currentLevel.bugCount &&
    gameState.selectedBugs.every(b => b.isCorrect);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-tennessee border-t-transparent rounded-full" />
      </div>
    );
  }

  // SUMMARY VIEW
  if (currentView === 'summary') {
    return (
      <GameSummary
        levelProgress={levelProgress}
        totalLevels={10}
        onBackToHub={handleBackToHub}
      />
    );
  }

  // GAMEPLAY VIEW
  if (currentView === 'gameplay' && currentLevel) {
    const activeBug = gameState.selectedBugs.find(b => !b.isCorrect && b.identifiedType !== null) ||
      gameState.selectedBugs.find(b => b.isCorrect === null);
    const bugDef = activeBug ? currentLevel.bugs.find(b => b.id === activeBug.id) : null;

    return (
      <>
        <Helmet>
          <title>Level {currentLevel.level} - Prompt Debugger | AIM Academy</title>
        </Helmet>

        <div className="fixed inset-0 bg-card z-40">
          {/* Top Bar */}
          <div className="h-14 bg-secondary border-b border-border/30 flex items-center justify-between px-4">
            <span className="text-foreground font-semibold">Level {currentLevel.level}</span>
            <div className="flex items-center gap-2 text-sm">
              <Bug className="w-4 h-4 text-tennessee" />
              <span className="text-foreground">
                {gameState.selectedBugs.filter(b => b.isCorrect).length}/{currentLevel.bugCount} found
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(gameState.timeElapsed)}
              </div>
              <button
                onClick={handleExitGame}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Game Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
            <div className="max-w-2xl mx-auto">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                {['read', 'identify', 'fix'].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                      gameState.currentStep === step 
                        ? 'bg-tennessee text-white'
                        : index < ['read', 'identify', 'fix'].indexOf(gameState.currentStep)
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                    )}>
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className={cn(
                        'flex-1 h-0.5',
                        index < ['read', 'identify', 'fix'].indexOf(gameState.currentStep)
                          ? 'bg-green-500'
                          : 'bg-muted'
                      )} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Prompt Card */}
              <div className="bg-card rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {gameState.currentStep === 'fix' ? 'แก้ไข Prompt ให้ถูกต้อง:' : 'Prompt ที่มีปัญหา:'}
                  </p>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {currentLevel.useCase}
                  </span>
                </div>

                {gameState.currentStep !== 'fix' ? (
                  <PromptDisplay
                    prompt={currentLevel.prompt}
                    bugs={currentLevel.bugs}
                    selectedBugs={gameState.selectedBugs}
                    onBugSelect={handleBugSelect}
                    onBugDeselect={handleBugDeselect}
                    disabled={false}
                  />
                ) : (
                  <div className="space-y-4">
                    {currentLevel.bugs.map(bug => (
                      <div key={bug.id} className="border border-border/30 rounded-xl p-4">
                        <p className="text-sm text-red-400 line-through mb-2">{bug.buggyText}</p>
                        <textarea
                          value={gameState.userFixes[bug.id] || ''}
                          onChange={(e) => handleFixChange(bug.id, e.target.value)}
                          placeholder="เขียน Prompt ที่แก้ไขแล้ว..."
                          className="w-full border-2 border-turquoise rounded-lg p-3 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-turquoise/50 text-foreground bg-background"
                        />
                        <button
                          onClick={() => {
                            const hint = bug.hint;
                            alert(`💡 Hint: ${hint}`);
                            setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3" />
                          ดู Hint (-10 XP)
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructions */}
                {gameState.currentStep === 'read' && (
                  <p className="text-sm text-muted-foreground italic mt-4">
                    💡 อ่าน prompt แล้วหาจุดที่ผิด — กดที่ประโยคที่มีปัญหา
                  </p>
                )}
              </div>

              {/* Bug Type Selector - show when a bug is selected but not identified */}
              {activeBug && bugDef && gameState.currentStep === 'identify' && (
                <div className="mb-4 animate-fade-in">
                  <p className="text-sm text-foreground mb-2">
                    คุณเลือก: <span className="text-tennessee font-medium">"{activeBug.text}"</span>
                  </p>
                  <BugTypeSelector
                    selectedType={activeBug.identifiedType}
                    correctType={bugDef.bugType}
                    wrongAttempts={gameState.wrongAttempts[activeBug.id] || 0}
                    onSelect={(type) => handleBugTypeSelect(activeBug.id, type)}
                    isCorrect={activeBug.isCorrect}
                  />
                  {activeBug.isCorrect && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        💡 {bugDef.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Progress summary when identifying */}
              {gameState.currentStep === 'identify' && gameState.selectedBugs.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-foreground font-medium mb-2">
                    Bugs Found: {gameState.selectedBugs.filter(b => b.isCorrect).length}/{currentLevel.bugCount}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {gameState.selectedBugs.map(bug => (
                      <span
                        key={bug.id}
                        className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          bug.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        )}
                      >
                        {bug.isCorrect ? '✓' : '?'} {bug.text.slice(0, 20)}...
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/30 p-4">
            <div className="max-w-2xl mx-auto">
              {gameState.currentStep === 'fix' && (
                <Button
                  onClick={handleSubmitFixes}
                  disabled={Object.keys(gameState.userFixes).length < currentLevel.bugCount}
                  className="w-full bg-tennessee hover:bg-tennessee/90 text-white py-6 text-lg"
                >
                  ส่งคำตอบ →
                </Button>
              )}
              {gameState.currentStep === 'identify' && allBugsFoundAndIdentified && (
                <Button
                  onClick={() => setGameState(prev => ({ ...prev, currentStep: 'fix' }))}
                  className="w-full bg-tennessee hover:bg-tennessee/90 text-white py-6 text-lg"
                >
                  ไปขั้นตอนแก้ไข →
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Modal */}
        {showResults && levelResult && (
          <ResultsModal
            level={currentLevel.level}
            score={levelResult.score}
            stars={levelResult.stars}
            bugsFound={levelResult.bugsFound}
            bugsTotal={currentLevel.bugCount}
            typesCorrect={levelResult.typesCorrect}
            fixQualityScore={levelResult.fixQualityScore}
            timeSeconds={levelResult.timeSeconds}
            xpEarned={levelResult.xpEarned}
            isLastLevel={currentLevel.level === 10}
            onNextLevel={handleNextLevel}
            onReplay={handleReplay}
            onBackToLevelSelect={() => {
              setShowResults(false);
              setCurrentView('levelSelect');
            }}
          />
        )}
      </>
    );
  }

  // LEVEL SELECT VIEW (default)
  return (
    <>
      <Helmet>
        <title>Prompt Debugger | AIM Academy</title>
        <meta name="description" content="หา Bug ใน Prompt ที่พัง แล้วแก้ไขให้ถูกต้อง" />
      </Helmet>

      <div className="min-h-screen bg-card">
        {/* Top Bar */}
        <div className="sticky top-0 bg-card border-b border-border/30 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={handleBackToHub}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">กลับ Game Hub</span>
            </button>
            <h1 className="text-lg font-bold text-foreground">Prompt Debugger</h1>
            <span className="text-sm text-muted-foreground">{completedCount}/10</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <Bug className="w-12 h-12 text-tennessee mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-oxford mb-2">Prompt Debugger</h1>
            <p className="text-base text-rackley mb-4">
              หา Bug ใน Prompt ที่พัง แล้วแก้ไขให้ถูกต้อง
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                🎯 Hard
              </span>
              <span className="text-sm text-rackley">
                ⏱ 45-60 นาที (ทั้ง 10 levels)
              </span>
            </div>
          </div>

          {/* Bug Type Legend (Collapsible) */}
          <div className="bg-muted/30 rounded-xl mb-8">
            <button
              onClick={() => setBugTypesExpanded(!bugTypesExpanded)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="text-foreground font-medium">📋 8 ประเภท Bug ที่จะเจอ</span>
              {bugTypesExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            {bugTypesExpanded && (
              <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(bugTypeInfo).map(([key, info]) => (
                  <div key={key} className="bg-card rounded-lg p-3 text-sm">
                    <span className="text-lg mr-2">{info.icon}</span>
                    <span className="text-foreground font-medium">{info.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{info.labelTh}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Level Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {debuggerLevels.map(level => {
              const progress = levelProgress.get(level.level);
              const isUnlocked = level.level <= highestUnlocked;
              
              let status: 'completed' | 'unlocked' | 'locked' = 'locked';
              if (progress?.completed) status = 'completed';
              else if (isUnlocked) status = 'unlocked';

              return (
                <LevelCard
                  key={level.level}
                  level={level.level}
                  bugCount={level.bugCount}
                  stars={progress?.stars || 0}
                  status={status}
                  bestScore={progress?.score}
                  onClick={() => handleLevelSelect(level.level)}
                />
              );
            })}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartNextUnlocked}
            className="w-full bg-tennessee hover:bg-tennessee/90 text-white py-6 text-lg font-bold"
          >
            {completedCount === 10 
              ? 'เล่นซ้ำ Level ที่ชอบ' 
              : `เริ่ม Level ${getHighestUnlockedLevel()} →`
            }
          </Button>
        </div>
      </div>
    </>
  );
};

export default PromptDebugger;
