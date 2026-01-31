import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FlaskConical, Trophy, Lightbulb, Award, TrendingUp, Inbox, Eye, Puzzle, Zap, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'spot_correct' | 'spot_streak' | 'lego_experiment' | 'lego_insight' | 'badge_unlock' | 'level_up';
  description: string;
  xpEarned: number;
  timestamp: Date;
  game: 'spot' | 'lego' | 'global';
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'spot_correct',
    description: 'ตอบถูก Social Media Challenge',
    xpEarned: 50,
    timestamp: new Date(Date.now() - 1800000),
    game: 'spot',
  },
  {
    id: '2',
    type: 'spot_streak',
    description: 'ถูก 5 ข้อติด! 🔥',
    xpEarned: 75,
    timestamp: new Date(Date.now() - 3600000),
    game: 'spot',
  },
  {
    id: '3',
    type: 'lego_insight',
    description: 'ค้นพบ Insight ใหม่',
    xpEarned: 30,
    timestamp: new Date(Date.now() - 7200000),
    game: 'lego',
  },
  {
    id: '4',
    type: 'badge_unlock',
    description: 'ปลดล็อค Badge "ตาไว"',
    xpEarned: 100,
    timestamp: new Date(Date.now() - 86400000),
    game: 'global',
  },
  {
    id: '5',
    type: 'lego_experiment',
    description: 'ทดลอง Prompt ใหม่',
    xpEarned: 25,
    timestamp: new Date(Date.now() - 172800000),
    game: 'lego',
  },
];

const getActivityIcon = (type: Activity['type'], game: Activity['game']) => {
  if (game === 'spot') {
    return { icon: Eye, color: 'text-turquoise', bg: 'bg-turquoise/20' };
  }
  if (game === 'lego') {
    return { icon: Puzzle, color: 'text-tennessee', bg: 'bg-tennessee/20' };
  }
  
  switch (type) {
    case 'badge_unlock':
      return { icon: Trophy, color: 'text-tennessee', bg: 'bg-tennessee/20' };
    case 'level_up':
      return { icon: TrendingUp, color: 'text-turquoise', bg: 'bg-turquoise/20' };
    default:
      return { icon: Lightbulb, color: 'text-rackley', bg: 'bg-rackley/20' };
  }
};

const getGameEmoji = (game: Activity['game']) => {
  switch (game) {
    case 'spot': return '🎯';
    case 'lego': return '🧱';
    default: return '🌟';
  }
};

const RecentActivity: React.FC = () => {
  const isEmpty = MOCK_ACTIVITIES.length === 0;

  return (
    <Card className="bg-card border-rackley/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-tennessee" />
            <h2 className="text-foreground text-lg font-semibold">Recent Activity</h2>
          </div>
          <Link to="/profile" className="text-turquoise text-sm hover:underline">
            ดูทั้งหมด
          </Link>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="h-12 w-12 text-rackley mb-3" />
            <p className="text-rackley font-medium">ยังไม่มีกิจกรรม</p>
            <p className="text-rackley text-sm mt-1">เริ่มเล่นเกมเพื่อสะสม XP!</p>
            <Link
              to="/spot"
              className="mt-4 px-4 py-2 bg-turquoise text-oxford-blue rounded-lg font-medium hover:opacity-90"
            >
              เริ่มเลย
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_ACTIVITIES.map((activity) => {
              const { icon: Icon, color, bg } = getActivityIcon(activity.type, activity.game);
              
              return (
                <div 
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm">
                      <span className="mr-2">{getGameEmoji(activity.game)}</span>
                      {activity.description}
                    </p>
                    <p className="text-xs text-rackley">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: th })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-tennessee font-semibold text-sm">
                    <Zap className="w-3 h-3" />
                    +{activity.xpEarned}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
