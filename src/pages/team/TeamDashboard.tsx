import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, RefreshCw, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  getOrganizationOverview,
  getSkillAssessmentData,
  getUsageAnalytics,
  getGamePerformance,
  getSurveyResults,
  getAssetLibraryStats,
  type OrganizationOverview,
  type SkillAssessmentData,
  type UsageAnalytics,
  type GamePerformance,
  type SurveyResults,
  type AssetLibraryStats,
} from '@/services/hrDashboardService';
import { cn } from '@/lib/utils';

// Admin email whitelist (MVP)
const HR_EMAILS = ['theera.stw@gmail.com', 'hr@example.com', 'admin@aimacademy.com'];

type TabType = 'overview' | 'skill' | 'usage' | 'games' | 'survey' | 'assets';

const TeamDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { organization, canManage, loading: teamLoading } = useTeam();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Data states
  const [overview, setOverview] = useState<OrganizationOverview | null>(null);
  const [skills, setSkills] = useState<SkillAssessmentData | null>(null);
  const [usage, setUsage] = useState<UsageAnalytics | null>(null);
  const [games, setGames] = useState<GamePerformance | null>(null);
  const [survey, setSurvey] = useState<SurveyResults | null>(null);
  const [assets, setAssets] = useState<AssetLibraryStats | null>(null);

  // Check access
  const hasAccess = user?.email && HR_EMAILS.includes(user.email);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, sk, us, gm, sv, as] = await Promise.all([
        getOrganizationOverview(),
        getSkillAssessmentData(),
        getUsageAnalytics(),
        getGamePerformance(),
        getSurveyResults(),
        getAssetLibraryStats(),
      ]);
      setOverview(ov);
      setSkills(sk);
      setUsage(us);
      setGames(gm);
      setSurvey(sv);
      setAssets(as);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess) {
      loadDashboardData();
    }
  }, [hasAccess, loadDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!hasAccess) return;
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [hasAccess, loadDashboardData]);

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Access denied
  if (!hasAccess) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto text-center">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-destructive mb-2">🔒 ต้องเป็น HR/Admin เท่านั้น</h2>
          <p className="text-muted-foreground mb-4">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
          <Button onClick={() => navigate('/dashboard')}>กลับ Dashboard</Button>
        </div>
      </div>
    );
  }

  const orgName = organization?.name || 'AIM Academy';

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'skill', label: '📈 Skills' },
    { id: 'usage', label: '⏱ Usage' },
    { id: 'games', label: '🎮 Games' },
    { id: 'survey', label: '📝 Survey' },
    { id: 'assets', label: '📄 Assets' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-500';
    if (score >= 41) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status: 'active' | 'at_risk' | 'dormant') => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">🟢 Active</span>;
      case 'at_risk':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">🟡 At Risk</span>;
      case 'dormant':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">🔴 Dormant</span>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    return `${Math.floor(minutes / 60)} ชม.ที่แล้ว`;
  };

  const handleExport = () => {
    // Simple CSV export
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', overview?.totalUsers || 0],
      ['Active Users', overview?.activeUsers || 0],
      ['Completion Rate', `${overview?.avgCompletionRate || 0}%`],
      ['Total Time Learning', `${overview?.totalTimeLearning || 0} hours`],
      ['Assets Created', overview?.totalAssetsCreated || 0],
      ['NPS Score', overview?.avgNPS || 0],
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIM_Academy_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <Helmet>
        <title>HR Analytics Dashboard | {orgName} | AIM Academy</title>
      </Helmet>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/team')}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-foreground text-2xl md:text-3xl font-bold">HR Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">{orgName}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Time range filter */}
            <div className="flex gap-1 bg-muted rounded-full p-1">
              {['7d', '30d', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full transition-colors',
                    timeRange === range 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {range === '7d' ? '7 วัน' : range === '30d' ? '30 วัน' : 'ทั้งหมด'}
                </button>
              ))}
            </div>
            
            {/* Last updated */}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(lastUpdated)}
              </span>
            )}
            
            <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/30 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-b-primary text-primary font-semibold'
                  : 'border-b-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))
                ) : (
                  <>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">👥 ผู้ใช้ทั้งหมด</p>
                      <p className="text-primary text-2xl font-bold mt-1">{overview?.totalUsers || 0} คน</p>
                      <p className="text-xs text-green-500 mt-1">Active: {overview?.activeUsers || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">✅ Completion Rate</p>
                      <p className={cn("text-2xl font-bold mt-1", getScoreColor(overview?.avgCompletionRate || 0))}>
                        {overview?.avgCompletionRate || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">SET 1 (70%+)</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">⏱ เวลาเรียนรู้รวม</p>
                      <p className="text-primary text-2xl font-bold mt-1">{overview?.totalTimeLearning || 0} ชม.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        เฉลี่ย {overview && overview.totalUsers > 0 ? (overview.totalTimeLearning / overview.totalUsers).toFixed(1) : 0} ชม./คน
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">📄 Assets สร้างแล้ว</p>
                      <p className="text-primary text-2xl font-bold mt-1">{overview?.totalAssetsCreated || 0} ชิ้น</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~฿{assets?.estimatedValue?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">📊 NPS Score</p>
                      <p className={cn(
                        "text-2xl font-bold mt-1",
                        (overview?.avgNPS || 0) >= 50 ? 'text-green-500' :
                        (overview?.avgNPS || 0) >= 0 ? 'text-yellow-500' : 'text-red-500'
                      )}>
                        {overview?.avgNPS || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{survey?.totalResponses || 0} responses</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">🔥 Active Rate</p>
                      <p className={cn(
                        "text-2xl font-bold mt-1",
                        getScoreColor(overview && overview.totalUsers > 0 
                          ? Math.round((overview.activeUsers / overview.totalUsers) * 100) 
                          : 0)
                      )}>
                        {overview && overview.totalUsers > 0 
                          ? Math.round((overview.activeUsers / overview.totalUsers) * 100) 
                          : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">ใน 7 วันที่ผ่านมา</p>
                    </div>
                  </>
                )}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Daily Active Users Chart */}
                <div className="bg-card rounded-xl p-4 border border-border/30">
                  <h3 className="font-semibold text-foreground mb-4">Daily Active Users (30 วัน)</h3>
                  {loading ? (
                    <Skeleton className="h-48" />
                  ) : usage?.dailyActiveUsers && usage.dailyActiveUsers.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={usage.dailyActiveUsers}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground text-sm">ยังไม่มีข้อมูล</p>
                    </div>
                  )}
                </div>

                {/* Asset Creation Trend */}
                <div className="bg-card rounded-xl p-4 border border-border/30">
                  <h3 className="font-semibold text-foreground mb-4">Asset Creation (30 วัน)</h3>
                  {loading ? (
                    <Skeleton className="h-48" />
                  ) : assets?.assetCreationTrend && assets.assetCreationTrend.some(d => d.count > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={assets.assetCreationTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground text-sm">ยังไม่มีข้อมูล</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Low data warning */}
              {!loading && (overview?.totalUsers || 0) < 3 && (overview?.totalUsers || 0) > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    ⚠️ ข้อมูลยังน้อย — จะแม่นยำขึ้นเมื่อมีผู้ใช้เพิ่ม ({overview?.totalUsers} คน)
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!loading && overview?.totalUsers === 0 && (
                <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">ยังไม่มีข้อมูล — รอ test users เข้าใช้งาน</p>
                </div>
              )}
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skill' && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : skills && skills.users.length > 0 ? (
                <>
                  {/* Summary */}
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <p className="text-primary font-semibold text-lg">
                      📈 คะแนนเฉลี่ยเพิ่มขึ้น: +{skills.avgImprovement} คะแนน
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {skills.avgPreScore} → {skills.avgPostScore}
                      {skills.topImprover && (
                        <span className="ml-4">🏆 พัฒนามากที่สุด: {skills.topImprover.name} (+{skills.topImprover.delta})</span>
                      )}
                    </p>
                  </div>

                  {/* User list */}
                  {skills.users.map((user) => (
                    <div key={user.userId} className="bg-card rounded-xl p-4 border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground font-medium">{user.userName}</span>
                        <span className={cn(
                          "text-sm font-semibold",
                          (user.improvement || 0) > 0 ? 'text-green-500' :
                          (user.improvement || 0) < 0 ? 'text-red-500' : 'text-muted-foreground'
                        )}>
                          {user.improvement !== null ? (
                            user.improvement > 0 ? `+${user.improvement}` : user.improvement
                          ) : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs w-8">Pre</span>
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div 
                            className="bg-muted-foreground/50 rounded-full h-3 transition-all" 
                            style={{ width: `${user.preScore || 0}%` }} 
                          />
                        </div>
                        <span className="text-muted-foreground text-xs w-8">{user.preScore ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-muted-foreground text-xs w-8">Post</span>
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary rounded-full h-3 transition-all" 
                            style={{ width: `${user.postScore || 0}%` }} 
                          />
                        </div>
                        <span className="text-primary text-xs w-8 font-semibold">{user.postScore ?? '—'}</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">ยังไม่มีข้อมูล Assessment</p>
                </div>
              )}
            </div>
          )}

          {/* USAGE TAB */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              {loading ? (
                <Skeleton className="h-64 rounded-xl" />
              ) : (
                <>
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">Avg Session</p>
                      <p className="text-primary text-xl font-bold">{usage?.avgSessionDuration || 0} นาที</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">Sessions/สัปดาห์</p>
                      <p className="text-primary text-xl font-bold">{usage?.avgSessionsPerWeek || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">ช่วงเวลายอดนิยม</p>
                      <p className="text-primary text-xl font-bold">
                        {usage?.peakUsageHours[0]?.hour ?? '--'}:00 น.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">อุปกรณ์</p>
                      <p className="text-foreground text-sm mt-1">
                        📱 {usage?.deviceBreakdown.mobile || 0} | 💻 {usage?.deviceBreakdown.desktop || 0}
                      </p>
                    </div>
                  </div>

                  {/* User Engagement Table */}
                  {usage && usage.userEngagement.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30 text-left text-muted-foreground text-sm">
                            <th className="py-3 px-4">ชื่อ</th>
                            <th className="py-3 px-4">Sessions</th>
                            <th className="py-3 px-4">เวลารวม</th>
                            <th className="py-3 px-4">Active ล่าสุด</th>
                            <th className="py-3 px-4">สถานะ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usage.userEngagement.slice(0, 20).map((user) => (
                            <tr 
                              key={user.userId} 
                              className={cn(
                                "border-b border-border/20",
                                user.status === 'dormant' && 'bg-red-500/5'
                              )}
                            >
                              <td className="py-3 px-4 text-foreground">{user.userName}</td>
                              <td className="py-3 px-4 text-foreground">{user.totalSessions}</td>
                              <td className="py-3 px-4 text-foreground">{user.totalTimeMinutes} นาที</td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {user.lastActive 
                                  ? new Date(user.lastActive).toLocaleDateString('th-TH')
                                  : '—'}
                              </td>
                              <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                      <p className="text-muted-foreground">ยังไม่มีข้อมูล Session</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* GAMES TAB */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
              ) : games && games.games.length > 0 ? (
                <>
                  {/* Game cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {games.games.map((game) => (
                      <div key={game.gameId} className="bg-card rounded-xl p-4 border border-border/30">
                        <h4 className="font-semibold text-foreground mb-3">{game.gameName}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total plays:</span>
                            <span className="ml-2 text-foreground font-medium">{game.totalPlays}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Unique players:</span>
                            <span className="ml-2 text-foreground font-medium">{game.uniquePlayers}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg score:</span>
                            <span className={cn("ml-2 font-medium", getScoreColor(game.avgScore))}>{game.avgScore}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completion:</span>
                            <span className={cn("ml-2 font-medium", getScoreColor(game.completionRate))}>{game.completionRate}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg time:</span>
                            <span className="ml-2 text-foreground font-medium">{game.avgTimeMinutes} นาที</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total XP:</span>
                            <span className="ml-2 text-primary font-medium">{game.totalXpAwarded.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Scorers */}
                  {games.topScorers.length > 0 && (
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-3">🏆 Top Scorers</h4>
                      <div className="space-y-2">
                        {games.topScorers.slice(0, 5).map((scorer, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                i === 0 ? 'bg-yellow-400 text-yellow-900' :
                                i === 1 ? 'bg-gray-300 text-gray-700' :
                                i === 2 ? 'bg-orange-400 text-orange-900' :
                                'bg-muted text-muted-foreground'
                              )}>
                                {i + 1}
                              </span>
                              <span className="text-foreground">{scorer.userName}</span>
                              <span className="text-muted-foreground text-xs">({scorer.gameId})</span>
                            </div>
                            <span className="text-primary font-semibold">{scorer.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">ยังไม่มีข้อมูล Game Performance</p>
                </div>
              )}
            </div>
          )}

          {/* SURVEY TAB */}
          {activeTab === 'survey' && (
            <div className="space-y-6">
              {loading ? (
                <Skeleton className="h-64 rounded-xl" />
              ) : survey && survey.totalResponses > 0 ? (
                <>
                  {/* NPS Score */}
                  <div className="bg-card rounded-xl p-6 border border-border/30 text-center">
                    <p className="text-muted-foreground text-sm mb-2">Net Promoter Score</p>
                    <p className={cn(
                      "text-5xl font-bold",
                      survey.npsScore >= 50 ? 'text-green-500' :
                      survey.npsScore >= 0 ? 'text-yellow-500' : 'text-red-500'
                    )}>
                      {survey.npsScore}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {survey.npsScore >= 50 ? '🟢 Excellent' :
                       survey.npsScore >= 0 ? '🟡 Good' : '🔴 Needs Improvement'}
                    </p>
                    
                    {/* NPS Breakdown bar */}
                    <div className="flex mt-4 h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${survey.totalResponses > 0 ? (survey.npsBreakdown.promoters / survey.totalResponses) * 100 : 0}%` }}
                      />
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${survey.totalResponses > 0 ? (survey.npsBreakdown.passives / survey.totalResponses) * 100 : 0}%` }}
                      />
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${survey.totalResponses > 0 ? (survey.npsBreakdown.detractors / survey.totalResponses) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                      <span>Promoters: {survey.npsBreakdown.promoters}</span>
                      <span>Passives: {survey.npsBreakdown.passives}</span>
                      <span>Detractors: {survey.npsBreakdown.detractors}</span>
                    </div>
                    
                    {survey.totalResponses < 5 && (
                      <p className="text-xs text-yellow-600 mt-3">
                        ⚠️ จาก {survey.totalResponses} คำตอบ (ยังน้อยสำหรับ statistical significance)
                      </p>
                    )}
                  </div>

                  {/* Ratings */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-card rounded-xl p-4 border border-border/30 text-center">
                      <p className="text-2xl mb-1">🎮</p>
                      <p className="text-muted-foreground text-sm">ความสนุก</p>
                      <p className="text-primary text-xl font-bold">{survey.avgRatings.fun}/5</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30 text-center">
                      <p className="text-2xl mb-1">📊</p>
                      <p className="text-muted-foreground text-sm">ความยากง่าย</p>
                      <p className="text-primary text-xl font-bold">{survey.avgRatings.difficulty}/5</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30 text-center">
                      <p className="text-2xl mb-1">💼</p>
                      <p className="text-muted-foreground text-sm">ความมีประโยชน์</p>
                      <p className="text-primary text-xl font-bold">{survey.avgRatings.usefulness}/5</p>
                    </div>
                  </div>

                  {/* Continue Interest */}
                  <div className="bg-card rounded-xl p-4 border border-border/30">
                    <h4 className="font-semibold text-foreground mb-3">ต้องการเล่น SET 2 ต่อ</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-lg p-3 text-center">
                        <p className="text-green-600 dark:text-green-400 text-xl font-bold">{survey.continueInterest.yes}</p>
                        <p className="text-xs text-green-700 dark:text-green-300">อยากเล่น</p>
                      </div>
                      <div className="flex-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-center">
                        <p className="text-yellow-600 dark:text-yellow-400 text-xl font-bold">{survey.continueInterest.maybe}</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">อาจจะ</p>
                      </div>
                      <div className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-lg p-3 text-center">
                        <p className="text-red-600 dark:text-red-400 text-xl font-bold">{survey.continueInterest.no}</p>
                        <p className="text-xs text-red-700 dark:text-red-300">ไม่สนใจ</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Feedback */}
                  {survey.recentFeedback.length > 0 && (
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-3">💬 Feedback ล่าสุด</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {survey.recentFeedback.map((fb, i) => (
                          <div key={i} className="bg-muted/50 rounded-lg p-3">
                            <p className="text-foreground text-sm">{fb.text}</p>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span className={cn(
                                "px-2 py-0.5 rounded",
                                fb.nps >= 9 ? 'bg-green-100 text-green-700' :
                                fb.nps >= 7 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              )}>
                                NPS: {fb.nps}
                              </span>
                              <span>{new Date(fb.date).toLocaleDateString('th-TH')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">ยังไม่มีข้อมูล Survey</p>
                </div>
              )}
            </div>
          )}

          {/* ASSETS TAB */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              {loading ? (
                <div className="grid md:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                </div>
              ) : assets && assets.totalAssets > 0 ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">Total Assets</p>
                      <p className="text-primary text-2xl font-bold">{assets.totalAssets}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">By Category</p>
                      <p className="text-foreground text-sm mt-1">
                        📝 {assets.assetsByCategory.prompts} | 📋 {assets.assetsByCategory.sops} | 🔍 {assets.assetsByCategory.patterns}
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">Avg Quality</p>
                      <p className={cn("text-2xl font-bold", getScoreColor(assets.avgQualityScore))}>
                        {assets.avgQualityScore}/100
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <p className="text-muted-foreground text-xs">Estimated Value</p>
                      <p className="text-primary text-2xl font-bold">฿{assets.estimatedValue.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Top Quality Assets */}
                  {assets.topQualityAssets.length > 0 && (
                    <div className="bg-card rounded-xl p-4 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-3">⭐ Top Quality Assets</h4>
                      <div className="space-y-2">
                        {assets.topQualityAssets.map((asset, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                            <div>
                              <span className="text-foreground">{asset.title}</span>
                              <span className="ml-2 text-xs text-muted-foreground">({asset.category})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{asset.creator}</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                asset.score >= 90 ? 'bg-green-100 text-green-700' :
                                asset.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-muted text-muted-foreground'
                              )}>
                                {asset.score >= 90 ? '⭐ Excellent' : asset.score >= 70 ? 'Good' : 'Average'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">ยังไม่มีข้อมูล Assets</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamDashboard;
