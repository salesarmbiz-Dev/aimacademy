import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Gamepad2, BarChart3, FileText, Trophy, TrendingUp, Zap, Eye, Puzzle, FileCheck, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityStats } from '@/hooks/useActivityStats';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

const ProfileActivity: React.FC = () => {
  const { stats, recentActivity, isLoading, formatTime, estimateAssetValue } = useActivityStats();

  const time = formatTime(stats.totalTimeSeconds);
  const assetValue = estimateAssetValue(stats.assetsCreated);

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
          description: `จบ ${gameName} (${score} คะแนน)`,
        };
      
      case 'asset_created':
        return {
          icon: FileText,
          color: 'text-tennessee',
          bg: 'bg-tennessee/20',
          description: `สร้าง ${data.asset_type}: ${(data as Record<string, string>).title || 'Asset ใหม่'}`,
        };
      
      case 'assessment_complete':
        const assessmentType = data.type === 'pre' ? 'Pre-Assessment' : 'Post-Assessment';
        const assessmentScore = data.total_score as number;
        return {
          icon: BarChart3,
          color: 'text-primary',
          bg: 'bg-primary/20',
          description: `ทำ ${assessmentType} (${assessmentScore} คะแนน)`,
        };
      
      case 'badge_earned':
        return {
          icon: Trophy,
          color: 'text-tennessee',
          bg: 'bg-tennessee/20',
          description: `ได้รับ Badge: ${(data as Record<string, string>).badge_name || 'Badge ใหม่'}`,
        };
      
      case 'level_up':
        return {
          icon: TrendingUp,
          color: 'text-turquoise',
          bg: 'bg-turquoise/20',
          description: `Level Up! → Level ${data.new_level}`,
        };
      
      default:
        return {
          icon: Zap,
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          description: event.event_type,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Stats Card */}
      <Card className="bg-card border-rackley/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-turquoise" />
            <h2 className="text-foreground text-lg font-semibold">📊 สถิติการใช้งาน</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Learning Time */}
            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-turquoise" />
                <span className="text-xs text-muted-foreground">เวลาเรียนรู้รวม</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{time.hours}</span>
                <span className="text-sm text-muted-foreground">ชั่วโมง</span>
                <span className="text-lg font-bold text-foreground ml-1">{time.minutes}</span>
                <span className="text-sm text-muted-foreground">นาที</span>
              </div>
            </div>

            {/* Games Played */}
            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="h-4 w-4 text-tennessee" />
                <span className="text-xs text-muted-foreground">เกมที่เล่น</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stats.gamesPlayed}</span>
                <span className="text-sm text-muted-foreground">ครั้ง</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                จบ {stats.gamesCompleted} ครั้ง
              </p>
            </div>

            {/* Sessions */}
            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Sessions</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stats.totalSessions}</span>
                <span className="text-sm text-muted-foreground">ครั้ง</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                เฉลี่ย {stats.averageSessionMinutes} นาที/session
              </p>
            </div>

            {/* Assets Created */}
            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-tennessee" />
                <span className="text-xs text-muted-foreground">Assets สร้างแล้ว</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stats.assetsCreated}</span>
                <span className="text-sm text-muted-foreground">ชิ้น</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                มูลค่ารวม ~฿{(assetValue / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card className="bg-card border-rackley/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-tennessee" />
              <h2 className="text-foreground text-lg font-semibold">กิจกรรมล่าสุด</h2>
            </div>
            <Link 
              to="/profile?tab=history" 
              className="text-sm text-turquoise hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">ยังไม่มีกิจกรรม</p>
              <p className="text-sm text-muted-foreground mt-1">เริ่มเล่นเกมเพื่อสร้าง activity log!</p>
              <Link
                to="/games"
                className="inline-block mt-4 px-4 py-2 bg-turquoise text-oxford-blue rounded-lg font-medium hover:opacity-90"
              >
                เริ่มเลย
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const display = getActivityDisplay(activity);
                const Icon = display.icon;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border-l-4"
                    style={{ borderLeftColor: display.color.replace('text-', '') === 'turquoise' ? 'var(--turquoise)' : 
                             display.color.replace('text-', '') === 'tennessee' ? 'var(--tennessee)' : 
                             'var(--primary)' }}
                  >
                    <div className={`p-2 rounded-lg ${display.bg}`}>
                      <Icon className={`w-4 h-4 ${display.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm">{display.description}</p>
                      <p className="text-xs text-muted-foreground">
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
    </div>
  );
};

export default ProfileActivity;
