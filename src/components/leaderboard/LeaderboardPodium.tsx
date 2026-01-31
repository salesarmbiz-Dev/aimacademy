import React from 'react';
import { Crown } from 'lucide-react';
import type { LeaderboardUser, ChallengeLeaderboardUser } from './types';
import { TIER_SYSTEM } from './types';

interface LeaderboardPodiumProps {
  users: (LeaderboardUser | ChallengeLeaderboardUser)[];
  valueKey: 'totalXp' | 'weeklyXp' | 'bestScore';
  valueLabel: string;
}

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ users, valueKey, valueLabel }) => {
  if (users.length < 3) return null;

  const top3 = users.slice(0, 3);
  const [first, second, third] = top3;

  const podiumOrder = [second, first, third];
  const heights = ['140px', '180px', '100px'];
  const avatarSizes = ['70px', '80px', '70px'];
  const gradients = [
    'linear-gradient(180deg, #C0C0C0 0%, #6593A6 100%)',
    'linear-gradient(180deg, #FFD700 0%, #F27405 100%)',
    'linear-gradient(180deg, #CD7F32 0%, #8B4513 100%)'
  ];
  const borderColors = ['#C0C0C0', '#FFD700', '#CD7F32'];
  const medals = ['🥈', '🥇', '🥉'];

  const getValue = (user: LeaderboardUser | ChallengeLeaderboardUser) => {
    if (valueKey === 'bestScore') {
      return (user as ChallengeLeaderboardUser).bestScore;
    }
    return (user as LeaderboardUser)[valueKey];
  };

  return (
    <div className="bg-gradient-to-b from-secondary to-background rounded-3xl p-10 mb-8">
      <h2 className="text-2xl font-bold text-white text-center mb-8">🏆 Top 3 Players</h2>
      
      <div className="flex justify-center items-end gap-4 md:gap-8">
        {podiumOrder.map((user, index) => {
          const isFirst = index === 1;
          const tier = TIER_SYSTEM[user.tier];
          const value = getValue(user);
          
          return (
            <div key={user.id} className="flex flex-col items-center">
              {/* Crown for 1st place */}
              {isFirst && (
                <div className="mb-2 animate-bounce">
                  <span className="text-4xl">👑</span>
                </div>
              )}
              
              {/* Avatar */}
              <div 
                className="relative -mb-8 z-10"
                style={{ 
                  width: avatarSizes[index],
                  height: avatarSizes[index]
                }}
              >
                <div 
                  className="w-full h-full rounded-full overflow-hidden border-4"
                  style={{ 
                    borderColor: borderColors[index],
                    boxShadow: isFirst ? '0 0 30px rgba(255, 215, 0, 0.5)' : undefined
                  }}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Podium */}
              <div 
                className="flex flex-col items-center justify-start pt-12 px-4 rounded-t-xl"
                style={{ 
                  width: isFirst ? '160px' : '140px',
                  height: heights[index],
                  background: gradients[index]
                }}
              >
                <span className="text-3xl mb-1">{medals[index]}</span>
                <p className="text-secondary font-bold text-sm md:text-base truncate max-w-full">
                  {user.name}
                </p>
                <p className="text-secondary/80 text-xs md:text-sm">
                  {typeof value === 'number' && valueKey !== 'bestScore' 
                    ? value.toLocaleString() 
                    : value}{valueKey === 'bestScore' ? '/100' : ''} {valueLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Base */}
      <div className="h-5 bg-secondary rounded-b-xl mx-auto max-w-lg" />
    </div>
  );
};

export default LeaderboardPodium;
