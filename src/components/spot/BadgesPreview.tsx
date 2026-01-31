import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpot } from '@/contexts/SpotContext';
import { SPOT_BADGES, RARITY_COLORS, calculateBadgeProgress } from '@/data/spotBadges';

const BadgesPreview: React.FC = () => {
  const { 
    unlockedBadges = [], 
    correctAnswers, 
    longestStreak, 
    patternsDiscovered,
    challengesCompleted,
    skills 
  } = useSpot();

  // Calculate stats for badge progress
  const accuracy = challengesCompleted > 0 
    ? Math.round((correctAnswers / challengesCompleted) * 100) 
    : 0;

  const allSkillsAbove50 = Object.values(skills).every(v => v >= 50);

  const stats = {
    correctAnswers,
    longestStreak,
    patternsCount: patternsDiscovered.length,
    accuracy,
    categoriesPlayed: 3, // Mock
    allSkillsAbove50,
    playDays: 5, // Mock
    fastAnswers: 3, // Mock
  };

  // Get badges with unlock status and progress
  const badgesWithStatus = SPOT_BADGES.slice(0, 5).map(badge => ({
    ...badge,
    isUnlocked: unlockedBadges.includes(badge.id),
    progress: calculateBadgeProgress(badge, stats),
  }));

  const unlockedCount = unlockedBadges.length;
  const totalCount = SPOT_BADGES.length;

  return (
    <Card className="bg-card border-rackley/30">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            🏅 BADGES ({unlockedCount}/{totalCount})
          </h3>
          <Link 
            to="/profile?tab=achievements" 
            className="text-turquoise text-sm hover:underline flex items-center gap-1"
          >
            ดูทั้งหมด
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {badgesWithStatus.map((badge) => (
            <div
              key={badge.id}
              className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-oxford-blue to-secondary'
                  : 'bg-rackley/20 opacity-50'
              }`}
              style={{
                boxShadow: badge.isUnlocked 
                  ? `0 0 15px ${RARITY_COLORS[badge.rarity]}30`
                  : undefined,
                border: badge.isUnlocked 
                  ? `2px solid ${RARITY_COLORS[badge.rarity]}50`
                  : '2px solid transparent',
              }}
            >
              {badge.isUnlocked ? (
                <>
                  <span className="text-2xl">{badge.icon}</span>
                  <Badge 
                    className="text-[8px] px-1 py-0 mt-1 border-0"
                    style={{
                      backgroundColor: `${RARITY_COLORS[badge.rarity]}20`,
                      color: RARITY_COLORS[badge.rarity],
                    }}
                  >
                    {badge.rarity}
                  </Badge>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-rackley" />
                  <span className="text-[10px] text-rackley mt-1">
                    {badge.progress > 0 ? `${Math.round(badge.progress)}%` : 'Locked'}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Next badge to unlock hint */}
        {unlockedCount < totalCount && (
          <div className="mt-3 p-2 bg-oxford-blue/50 rounded-lg">
            <p className="text-rackley text-xs">
              💡 ถัดไป: {SPOT_BADGES.find(b => !unlockedBadges.includes(b.id))?.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesPreview;
