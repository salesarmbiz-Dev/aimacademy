import React, { useState } from 'react';
import { Trophy, Zap, Flame } from 'lucide-react';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { DailyChallenge } from '@/components/challenges/DailyChallenge';
import { LeaderboardPreview } from '@/components/challenges/LeaderboardPreview';
import { ChallengeGameplay } from '@/components/challenges/ChallengeGameplay';
import { MOCK_CHALLENGES, type Challenge, type ChallengeMode, type ChallengeProgress } from '@/components/challenges/types';
import { useProgress } from '@/contexts/ProgressContext';

// Mock challenge progress (will be replaced with real data from ProgressContext)
const getInitialProgress = (challenges: Record<string, any>): Record<ChallengeMode, ChallengeProgress> => ({
  minimize: {
    completed: challenges?.minimize?.map((c: any) => c.id) || ['min-1', 'min-2'],
    scores: { 'min-1': 95, 'min-2': 88 },
    attempts: { 'min-3': 2 },
    bestTimes: { 'min-1': 95 },
    stars: { 'min-1': 3, 'min-2': 2 },
  },
  maximize: {
    completed: ['max-1'],
    scores: { 'max-1': 98 },
    attempts: {},
    bestTimes: {},
    stars: { 'max-1': 3 },
  },
  fix: {
    completed: ['fix-1', 'fix-2', 'fix-3', 'fix-4', 'fix-5'].slice(0, Math.min(5, Object.keys(challenges?.fix || {}).length)),
    scores: { 'fix-1': 92, 'fix-2': 88 },
    attempts: {},
    bestTimes: {},
    stars: { 'fix-1': 3 },
  },
  build: {
    completed: [],
    scores: {},
    attempts: {},
    bestTimes: {},
    stars: {},
  },
});

const Challenges: React.FC = () => {
  const { challenges } = useProgress();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Get progress from context or use mock data
  const progressData = getInitialProgress(challenges);

  const totalCompleted = Object.values(progressData).reduce(
    (sum, p) => sum + p.completed.length, 0
  );
  const totalChallenges = Object.values(MOCK_CHALLENGES).reduce(
    (sum, arr) => sum + arr.length, 0
  );
  const totalXp = Object.values(progressData).reduce(
    (sum, p) => sum + Object.values(p.scores).reduce((s, score) => s + score, 0), 0
  );

  // Build mode is locked until 5 Fix challenges are completed
  const isBuildLocked = progressData.fix.completed.length < 5;

  const handlePlayChallenge = (mode: ChallengeMode) => {
    const modeProgressData = progressData[mode];
    // Find first incomplete challenge
    const incompleteChallenges = MOCK_CHALLENGES[mode].filter(
      c => !modeProgressData.completed.includes(c.id)
    );
    
    if (incompleteChallenges.length > 0) {
      setSelectedChallenge(incompleteChallenges[0]);
    } else {
      // All completed, replay first one
      setSelectedChallenge(MOCK_CHALLENGES[mode][0]);
    }
  };

  const handleChallengeComplete = () => {
    // Will refresh progress from context
    setSelectedChallenge(null);
  };

  // If a challenge is selected, show the gameplay
  if (selectedChallenge) {
    return (
      <ChallengeGameplay
        challenge={selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        onComplete={handleChallengeComplete}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-tennessee" />
          <h1 className="text-white text-3xl font-bold">Challenge Arena</h1>
        </div>
        <p className="text-rackley text-lg">ทดสอบทักษะ Prompt ของคุณ</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="h-4 w-4 text-tennessee" />
            <span>Completed: {totalCompleted}/{totalChallenges}</span>
          </div>
          <div className="flex items-center gap-2 text-tennessee">
            <Zap className="h-4 w-4" />
            <span>Total XP Earned: {totalXp}</span>
          </div>
          <div className="flex items-center gap-2 text-turquoise">
            <Flame className="h-4 w-4" />
            <span>Current Streak: 5</span>
          </div>
        </div>
      </div>

      {/* Challenge Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChallengeCard
          mode="minimize"
          title="Minimize"
          subtitle="ความท้าทายแห่งความกระชับ"
          description="ลบ Block ให้เหลือน้อยที่สุด แต่ยังได้ผลลัพธ์ดี"
          goal="ลดเหลือ 3 Blocks แต่ได้ Score 80+"
          difficulty="medium"
          progress={progressData.minimize}
          totalChallenges={MOCK_CHALLENGES.minimize.length}
          onPlay={() => handlePlayChallenge('minimize')}
        />

        <ChallengeCard
          mode="maximize"
          title="Maximize"
          subtitle="ดันคะแนนให้ถึงขีดสุด"
          description="เพิ่ม Block เพื่อดันคะแนนจาก 70 ให้ถึง 90+"
          goal="เริ่มจาก 70 points → ทำให้ได้ 95+"
          difficulty="hard"
          progress={progressData.maximize}
          totalChallenges={MOCK_CHALLENGES.maximize.length}
          onPlay={() => handlePlayChallenge('maximize')}
        />

        <ChallengeCard
          mode="fix"
          title="Fix"
          subtitle="หาจุดผิดและแก้ไข"
          description="Prompt มี Block ผิดหรือขาดหายไป - หาและแก้ให้ถูก"
          goal="หา Block ที่ผิด แก้ไขให้ Score 85+"
          difficulty="easy"
          progress={progressData.fix}
          totalChallenges={MOCK_CHALLENGES.fix.length}
          onPlay={() => handlePlayChallenge('fix')}
        />

        <ChallengeCard
          mode="build"
          title="Build"
          subtitle="สร้างจากศูนย์"
          description="สร้าง Prompt ใหม่จาก Block Library ตามโจทย์ที่ให้"
          goal="ประกอบ Prompt ให้ได้ Score 85+ ตามโจทย์"
          difficulty="expert"
          progress={progressData.build}
          totalChallenges={MOCK_CHALLENGES.build.length}
          isLocked={isBuildLocked}
          unlockCondition="ปลดล็อคเมื่อ: ผ่าน Fix 5 ข้อ"
          onPlay={() => handlePlayChallenge('build')}
        />
      </div>

      {/* Daily Challenge */}
      <div className="mb-8">
        <DailyChallenge onPlay={() => handlePlayChallenge('minimize')} />
      </div>

      {/* Leaderboard Preview */}
      <LeaderboardPreview />
    </div>
  );
};

export default Challenges;
