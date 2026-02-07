import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, TrendingUp, Inbox, Eye, Puzzle, Zap, Flame, FileCheck, BarChart3, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { useActivityStats } from '@/hooks/useActivityStats';

const RecentActivity: React.FC = () => {
  const { recentActivity, isLoading } = useActivityStats();

  // Get icon and description for activity type
  const getActivityDisplay = (event: typeof recentActivity[0]) => {
    const data = event.event_data;
    
    switch (event.event_type) {
      case 'game_complete':
        const gameId = data.game_id as string;
        const score = data.score as number;
        const gameNames: Record<string, string> = {
          'debugger': 'Prompt Debugger',
          'prompt-debugger': 'Prompt Debugger',
          'prompt-lego': 'Prompt Lego',
          'spot-the-difference': 'Spot the Difference',
          'sop-machine': 'SOP Machine',
        };
        const gameName = gameNames[gameId] || gameId;
        const GameIcon = gameId.includes('debugger') ? Zap : 
                        gameId.includes('spot') ? Eye :
                        gameId.includes('sop') ? FileCheck : Puzzle;
        return {
          icon: GameIcon,
          color: 'text-turquoise',
          bg: 'bg-turquoise/20',
          emoji: '🎮',
          description: `จบ ${gameName} (${score} คะแนน)`,
        };
      
      case 'asset_created':
        return {
          icon: FileText,
          color: 'text-tennessee',
          bg: 'bg-tennessee/20',
          emoji: '📄',
          description: `สร้าง ${data.asset_type || 'Asset ใหม่'}`,
        };
      
      case 'assessment_complete':
        const assessmentType = data.type === 'pre' ? 'Pre-Assessment' : 'Post-Assessment';
        const assessmentScore = data.total_score as number;
        return {
          icon: BarChart3,
          color: 'text-primary',
          bg: 'bg-primary/20',
          emoji: '📊',
          description: `ทำ ${assessmentType} (${assessmentScore} คะแนน)`,
        };
      
      case 'badge_earned':
        return {
          icon: Trophy,
          color: 'text-tennessee',
          bg: 'bg-tennessee/20',
          emoji: '🏆',
          description: `ได้รับ Badge: ${(data as Record<string, string>).badge_name || 'Badge ใหม่'}`,
        };
      
      case 'level_up':
        return {
          icon: TrendingUp,
          color: 'text-turquoise',
          bg: 'bg-turquoise/20',
          emoji: '⬆️',
          description: `Level Up! → Level ${data.new_level}`,
        };
      
      default:
        return {
          icon: Zap,
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          emoji: '🌟',
          description: event.event_type,
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-rackley/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="h-5 w-5 text-tennessee" />
            <h2 className="text-foreground text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-rackley/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-tennessee" />
            <h2 className="text-foreground text-lg font-semibold">Recent Activity</h2>
          </div>
          <Link to="/profile?tab=activity" className="text-turquoise text-sm hover:underline">
            ดูทั้งหมด
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="h-12 w-12 text-rackley mb-3" />
            <p className="text-rackley font-medium">ยังไม่มีกิจกรรม</p>
            <p className="text-rackley text-sm mt-1">เริ่มเล่นเกมเพื่อสะสม XP!</p>
            <Link
              to="/games"
              className="mt-4 px-4 py-2 bg-turquoise text-oxford-blue rounded-lg font-medium hover:opacity-90"
            >
              เริ่มเลย
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => {
              const display = getActivityDisplay(activity);
              const Icon = display.icon;
              
              return (
                <div 
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className={`p-2 rounded-lg ${display.bg}`}>
                    <Icon className={`w-4 h-4 ${display.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm">
                      <span className="mr-2">{display.emoji}</span>
                      {display.description}
                    </p>
                    <p className="text-xs text-rackley">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: th })}
                    </p>
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
