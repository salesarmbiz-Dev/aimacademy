import React from 'react';
import { Medal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'PromptMaster', score: 2450 },
  { rank: 2, name: 'AIBuilder', score: 2380 },
  { rank: 3, name: 'LegoKing', score: 2290 },
  { rank: 4, name: 'CodeNinja', score: 2150 },
  { rank: 5, name: 'You', score: 1890, isCurrentUser: true },
];

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export const LeaderboardPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-oxford rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-tennessee" />
          <h3 className="text-white text-lg font-semibold">Top Challengers สัปดาห์นี้</h3>
        </div>
        <button
          onClick={() => navigate('/leaderboard')}
          className="text-turquoise text-sm hover:underline flex items-center gap-1"
        >
          ดูทั้งหมด
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-2">
        {MOCK_LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-colors',
              entry.isCurrentUser ? 'bg-turquoise/10 border border-turquoise/30' : 'hover:bg-rootbeer/50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-bold">
                {entry.rank <= 3 ? (
                  <span className="text-lg">{RANK_MEDALS[entry.rank - 1]}</span>
                ) : (
                  <span className="text-rackley">{entry.rank}</span>
                )}
              </span>
              <div className="w-8 h-8 rounded-full bg-oxford border border-rackley/30 flex items-center justify-center text-white text-sm font-medium">
                {entry.name.charAt(0)}
              </div>
              <span className={cn('font-medium', entry.isCurrentUser ? 'text-turquoise' : 'text-white')}>
                {entry.name}
              </span>
            </div>
            <span className="text-tennessee font-semibold">{entry.score.toLocaleString()} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};
