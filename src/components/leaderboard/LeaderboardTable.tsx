import React from 'react';
import { ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardUser, ChallengeLeaderboardUser, LeaderboardTab } from './types';
import { TIER_SYSTEM } from './types';

interface LeaderboardTableProps {
  users: (LeaderboardUser | ChallengeLeaderboardUser)[];
  tab: LeaderboardTab;
  currentUserId?: string;
  onUserClick?: (user: LeaderboardUser | ChallengeLeaderboardUser) => void;
  highlightedUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  users, 
  tab, 
  currentUserId,
  onUserClick,
  highlightedUserId
}) => {
  const isChallenge = ['minimize', 'maximize', 'fix', 'build'].includes(tab);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-white font-semibold">#{rank}</span>;
  };

  const getChangeDisplay = (change: number, isNew?: boolean) => {
    if (isNew) {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">NEW</Badge>
      );
    }
    if (change > 0) {
      return (
        <span className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded text-sm">
          <ArrowUp className="w-3 h-3" />+{change}
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded text-sm">
          <ArrowDown className="w-3 h-3" />{change}
        </span>
      );
    }
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getValue = (user: LeaderboardUser | ChallengeLeaderboardUser) => {
    if (isChallenge) {
      const challengeUser = user as ChallengeLeaderboardUser;
      return challengeUser.bestScore;
    }
    const globalUser = user as LeaderboardUser;
    return tab === 'weekly' ? globalUser.weeklyXp : globalUser.totalXp;
  };

  const getSecondaryValue = (user: LeaderboardUser | ChallengeLeaderboardUser) => {
    if (!isChallenge) return null;
    const challengeUser = user as ChallengeLeaderboardUser;
    
    if (tab === 'minimize' || tab === 'maximize') {
      return `${challengeUser.blocksUsed} blocks • ${challengeUser.bestTime}`;
    }
    return `${challengeUser.completedCount} completed • ${challengeUser.avgTime} avg`;
  };

  // Find current user if not in visible list
  const currentUser = users.find(u => u.isCurrentUser);
  const visibleUsers = users.filter(u => !u.isCurrentUser).slice(0, 50);
  const showCurrentUserSeparately = currentUser && currentUser.rank > 12;

  return (
    <div className="bg-secondary rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="bg-background px-6 py-4 grid grid-cols-12 gap-4 text-muted-foreground text-xs uppercase font-semibold">
        <div className="col-span-1">#</div>
        <div className="col-span-5">ผู้เล่น</div>
        <div className="col-span-2">Tier</div>
        <div className="col-span-2">{isChallenge ? 'Score' : 'XP'}</div>
        <div className="col-span-2 text-right">เปลี่ยนแปลง</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-muted-foreground/20">
        {visibleUsers.map((user) => {
          const tier = TIER_SYSTEM[user.tier];
          const isHighlighted = user.id === highlightedUserId;
          
          return (
            <div 
              key={user.id}
              className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition-colors cursor-pointer hover:bg-muted-foreground/10 ${
                isHighlighted ? 'bg-accent/10 border-l-4 border-accent' : ''
              }`}
              onClick={() => onUserClick?.(user)}
            >
              {/* Rank */}
              <div className="col-span-1">
                {getRankDisplay(user.rank)}
              </div>

              {/* Player */}
              <div className="col-span-5 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden border-2"
                  style={{ borderColor: tier.color }}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{user.name}</span>
                    {user.isCurrentUser && (
                      <Badge className="bg-accent/20 text-accent text-xs">คุณ</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">Lv.{user.level}</span>
                </div>
              </div>

              {/* Tier */}
              <div className="col-span-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${tier.color}20`,
                    color: tier.color
                  }}
                >
                  {tier.icon} {tier.name}
                </Badge>
              </div>

              {/* Value */}
              <div className="col-span-2">
                <div className="text-white font-bold text-lg">
                  {isChallenge 
                    ? `${getValue(user)}/100`
                    : getValue(user)?.toLocaleString()
                  }
                </div>
                {isChallenge && (
                  <div className="text-muted-foreground text-xs">
                    {getSecondaryValue(user)}
                  </div>
                )}
              </div>

              {/* Change */}
              <div className="col-span-2 flex justify-end">
                {getChangeDisplay(user.change)}
              </div>
            </div>
          );
        })}

        {/* Current user separator and row */}
        {showCurrentUserSeparately && currentUser && (
          <>
            <div className="px-6 py-2 bg-background text-center">
              <span className="text-muted-foreground text-sm">• • •</span>
            </div>
            <div 
              className="px-6 py-4 grid grid-cols-12 gap-4 items-center bg-accent/10 border-l-4 border-accent"
            >
              <div className="col-span-1">
                <span className="text-white font-semibold">#{currentUser.rank}</span>
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden border-2"
                  style={{ borderColor: TIER_SYSTEM[currentUser.tier].color }}
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{currentUser.name}</span>
                    <Badge className="bg-accent/20 text-accent text-xs">คุณ</Badge>
                  </div>
                  <span className="text-muted-foreground text-xs">Lv.{currentUser.level}</span>
                </div>
              </div>
              <div className="col-span-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${TIER_SYSTEM[currentUser.tier].color}20`,
                    color: TIER_SYSTEM[currentUser.tier].color
                  }}
                >
                  {TIER_SYSTEM[currentUser.tier].icon} {TIER_SYSTEM[currentUser.tier].name}
                </Badge>
              </div>
              <div className="col-span-2">
                <div className="text-white font-bold text-lg">
                  {isChallenge 
                    ? `${getValue(currentUser)}/100`
                    : getValue(currentUser)?.toLocaleString()
                  }
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                {getChangeDisplay(currentUser.change)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardTable;
