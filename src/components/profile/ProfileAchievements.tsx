import React, { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { MOCK_BADGES, type Badge } from './types';

const ProfileAchievements: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedCount = MOCK_BADGES.filter(b => b.earnedAt).length;
  const totalCount = MOCK_BADGES.length;

  const filteredBadges = MOCK_BADGES.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'earned') return badge.earnedAt !== null;
    if (filter === 'locked') return badge.earnedAt === null;
    return true;
  });

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '#A855F7';
      case 'epic': return '#FFD700';
      case 'rare': return '#05F2F2';
      default: return null;
    }
  };

  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const isEarned = badge.earnedAt !== null;
    const rarityColor = getRarityColor(badge.rarity);

    return (
      <Card
        className={`cursor-pointer transition-all hover:scale-105 ${
          isEarned 
            ? 'bg-gradient-to-br from-secondary to-transparent border-2' 
            : 'bg-secondary border border-muted-foreground/30 opacity-70'
        }`}
        style={{ borderColor: isEarned ? badge.color : undefined }}
        onClick={() => setSelectedBadge(badge)}
      >
        <CardContent className="p-5 text-center relative">
          {/* Rarity tag */}
          {badge.rarity && (
            <div 
              className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold uppercase"
              style={{ 
                backgroundColor: `${rarityColor}20`,
                color: rarityColor || undefined
              }}
            >
              {badge.rarity}
            </div>
          )}

          {/* Badge icon */}
          <div className="relative inline-block">
            <div 
              className={`text-5xl ${!isEarned ? 'grayscale opacity-50' : ''}`}
              style={isEarned ? { 
                filter: 'drop-shadow(0 0 10px ' + badge.color + '50)'
              } : undefined}
            >
              {badge.icon}
            </div>
            {!isEarned && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Badge info */}
          <h4 className="mt-3 font-semibold text-white">{badge.name}</h4>
          <p className="mt-1 text-muted-foreground text-sm line-clamp-2">{badge.description}</p>

          {/* Status */}
          {isEarned ? (
            <div className="mt-3 flex items-center justify-center gap-1 text-sm" style={{ color: badge.color }}>
              <Check className="w-4 h-4" />
              <span>Earned {new Date(badge.earnedAt!).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span>
            </div>
          ) : badge.progress ? (
            <div className="mt-3">
              <Progress 
                value={(badge.progress.current / badge.progress.target) * 100}
                className="h-1.5 bg-background"
              />
              <p className="mt-1 text-muted-foreground text-xs">
                {badge.progress.current}/{badge.progress.target}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-muted-foreground text-xs">🔒 {badge.requirement}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            🏆 Achievements
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {earnedCount}/{totalCount} unlocked
          </p>
        </div>

        <div className="flex gap-2">
          {(['all', 'earned', 'locked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f 
                  ? 'bg-accent text-secondary font-medium' 
                  : 'bg-secondary text-muted-foreground hover:text-white'
              }`}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'earned' ? 'ปลดล็อคแล้ว' : 'ยังไม่ปลดล็อค'}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredBadges.map(badge => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>

      {/* Badge Detail Modal */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="bg-secondary border-muted-foreground/30 max-w-md">
          {selectedBadge && (
            <>
              <DialogHeader>
                <div className="text-center">
                  <div 
                    className="text-7xl inline-block"
                    style={{ 
                      filter: selectedBadge.earnedAt 
                        ? 'drop-shadow(0 0 20px ' + selectedBadge.color + '80)'
                        : 'grayscale(1) opacity(0.5)'
                    }}
                  >
                    {selectedBadge.icon}
                  </div>
                  <DialogTitle className="mt-4 text-2xl">{selectedBadge.name}</DialogTitle>
                  {selectedBadge.rarity && (
                    <BadgeComponent 
                      className="mt-2"
                      style={{ 
                        backgroundColor: `${getRarityColor(selectedBadge.rarity)}20`,
                        color: getRarityColor(selectedBadge.rarity) || undefined
                      }}
                    >
                      {selectedBadge.rarity.toUpperCase()}
                    </BadgeComponent>
                  )}
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground text-center">{selectedBadge.description}</p>

                <div className="bg-background rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Requirement:</p>
                  <p className="text-white mt-1">{selectedBadge.requirement}</p>
                </div>

                {selectedBadge.progress && !selectedBadge.earnedAt && (
                  <div className="bg-background rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-white">
                        {selectedBadge.progress.current}/{selectedBadge.progress.target}
                      </span>
                    </div>
                    <Progress 
                      value={(selectedBadge.progress.current / selectedBadge.progress.target) * 100}
                      className="h-2 bg-secondary"
                    />
                  </div>
                )}

                {selectedBadge.earnedAt && (
                  <div className="bg-background rounded-lg p-4 text-center" style={{ borderColor: selectedBadge.color }}>
                    <Check className="w-6 h-6 mx-auto" style={{ color: selectedBadge.color }} />
                    <p className="text-white mt-2">
                      Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div className="text-center pt-2">
                  <p className="text-primary text-xl font-bold">+{selectedBadge.xpReward} XP</p>
                  <p className="text-muted-foreground text-sm">Reward</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileAchievements;
