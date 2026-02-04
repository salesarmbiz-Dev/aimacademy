import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import StatsCards from '@/components/team/StatsCards';
import EngagementChart from '@/components/team/EngagementChart';
import SkillRadarChart from '@/components/team/SkillRadarChart';
import MembersTable from '@/components/team/MembersTable';
import { 
  TeamStats, 
  MOCK_MEMBERS, 
  MOCK_ENGAGEMENT_DATA, 
  MOCK_SKILL_AVERAGES 
} from '@/components/team/types';

const TeamDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { organization, canManage, loading } = useTeam();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  
  // Use mock data for demo
  const [stats] = useState<TeamStats>({
    totalMembers: 24,
    completedMembers: 15,
    activeThisWeek: 18,
    averageImprovement: 23,
  });

  useEffect(() => {
    if (!loading && !canManage) {
      navigate('/team');
    }
  }, [loading, canManage, navigate]);

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['ชื่อ', 'Level', 'Pre Test %', 'Post Test %', 'เปลี่ยนแปลง %'];
    const rows = MOCK_MEMBERS.map(m => [
      m.display_name,
      m.level,
      m.pre_test_score ?? 'N/A',
      m.post_test_score ?? 'N/A',
      m.score_change ?? 'N/A',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `team-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    // Simple print-based PDF export
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>HR Dashboard | {organization.name} | AIM Academy</title>
      </Helmet>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/team')}
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-[#F27405]" />
              HR Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {organization.name}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <StatsCards stats={stats} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <EngagementChart
            data={MOCK_ENGAGEMENT_DATA}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <SkillRadarChart data={MOCK_SKILL_AVERAGES} />
        </div>

        {/* Members Table */}
        <MembersTable
          members={MOCK_MEMBERS}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
      </div>
    </>
  );
};

export default TeamDashboard;
