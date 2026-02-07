import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Mock data for team members
const teamMembers = [
  { name: 'สมชาย', pre: 45, post: 68, lastActive: '2 ชม.', sessions: 12, assets: 24, status: 'active' },
  { name: 'สมหญิง', pre: 52, post: 75, lastActive: '1 วัน', sessions: 8, assets: 18, status: 'active' },
  { name: 'วิชัย', pre: 38, post: 61, lastActive: '3 ชม.', sessions: 10, assets: 21, status: 'active' },
  { name: 'สุนิสา', pre: 60, post: 82, lastActive: '5 ชม.', sessions: 15, assets: 32, status: 'active' },
  { name: 'ธนพล', pre: 42, post: 58, lastActive: '3 วัน', sessions: 4, assets: 12, status: 'moderate' },
  { name: 'พิมพ์ใจ', pre: 55, post: 78, lastActive: '6 ชม.', sessions: 9, assets: 19, status: 'active' },
  { name: 'กิตติ', pre: 35, post: 50, lastActive: '8 วัน', sessions: 2, assets: 6, status: 'dormant' },
  { name: 'นภาพร', pre: 48, post: 70, lastActive: '1 วัน', sessions: 7, assets: 14, status: 'moderate' },
];

// Quality scoring data
const qualityScores = [
  { name: 'สุนิสา', clarity: 9, relevance: 8, completeness: 9, isTop: true },
  { name: 'พิมพ์ใจ', clarity: 8, relevance: 9, completeness: 8, isTop: false },
  { name: 'สมหญิง', clarity: 8, relevance: 7, completeness: 8, isTop: false },
  { name: 'นภาพร', clarity: 7, relevance: 8, completeness: 7, isTop: false },
  { name: 'สมชาย', clarity: 7, relevance: 7, completeness: 7, isTop: false },
  { name: 'วิชัย', clarity: 6, relevance: 7, completeness: 6, isTop: false },
  { name: 'ธนพล', clarity: 6, relevance: 5, completeness: 6, isTop: false },
  { name: 'กิตติ', clarity: 5, relevance: 5, completeness: 5, isTop: false },
];

// Competency data
const competencies = [
  { name: 'Role Setting', score: 72 },
  { name: 'Context Design', score: 58 },
  { name: 'Task Specification', score: 78 },
  { name: 'Output Formatting', score: 65 },
  { name: 'Constraint Setting', score: 35 },
  { name: 'Iteration & Refinement', score: 50 },
];

// Gap analysis data
const gapAnalysis = [
  { skill: 'Constraint Setting', current: 35, target: 70, priority: 'high' },
  { skill: 'Iteration & Refinement', current: 50, target: 80, priority: 'high' },
  { skill: 'Context Design', current: 58, target: 75, priority: 'medium' },
  { skill: 'Output Formatting', current: 65, target: 80, priority: 'medium' },
  { skill: 'Role Setting', current: 72, target: 85, priority: 'low' },
  { skill: 'Task Specification', current: 78, target: 90, priority: 'low' },
];

// Audit log
const auditLog = [
  { date: '7 ก.พ. 2026', user: 'สุนิสา', action: 'ยอมรับ AI Usage Policy', status: 'สำเร็จ' },
  { date: '6 ก.พ. 2026', user: 'สมชาย', action: 'เสร็จสิ้น Data Handling Training', status: 'สำเร็จ' },
  { date: '5 ก.พ. 2026', user: 'พิมพ์ใจ', action: 'ยอมรับ AI Usage Policy', status: 'สำเร็จ' },
  { date: '4 ก.พ. 2026', user: 'ธนพล', action: 'เริ่ม Prompt Safety Training', status: 'กำลังดำเนินการ' },
  { date: '3 ก.พ. 2026', user: 'วิชัย', action: 'เสร็จสิ้น Prompt Safety Training', status: 'สำเร็จ' },
];

type TabType = 'skill' | 'usage' | 'quality' | 'competency' | 'gap' | 'compliance';

const TeamDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { organization, canManage, loading: teamLoading } = useTeam();
  const [activeTab, setActiveTab] = useState<TabType>('skill');
  const [timeRange, setTimeRange] = useState('30d');

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const orgName = organization?.name || 'บริษัท AI Solutions จำกัด';

  const tabs: { id: TabType; label: string }[] = [
    { id: 'skill', label: 'Skill Assessment' },
    { id: 'usage', label: 'Usage Analytics' },
    { id: 'quality', label: 'Quality Scoring' },
    { id: 'competency', label: 'Competency Map' },
    { id: 'gap', label: 'Gap Analysis' },
    { id: 'compliance', label: 'Compliance' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 71) return { bar: 'bg-green-500', text: 'text-green-400' };
    if (score >= 41) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
    return { bar: 'bg-red-500', text: 'text-red-400' };
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2" />Active</>;
      case 'moderate':
        return <><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block mr-2" />Moderate</>;
      case 'dormant':
        return <><span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-2" />Dormant</>;
      default:
        return null;
    }
  };

  const avgImprovement = Math.round(
    teamMembers.reduce((acc, m) => acc + (m.post - m.pre), 0) / teamMembers.length
  );

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
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-card border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value="30d">30 วันล่าสุด</option>
              <option value="90d">90 วัน</option>
              <option value="all">ทั้งหมด</option>
            </select>
            <button className="btn-ghost text-sm">📥 Export Report</button>
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <p className="text-muted-foreground text-sm">Active Users</p>
            <p className="text-tennessee text-3xl font-bold mt-1">24/30</p>
            <p className="text-xs mt-1 text-green-400">↑ 3 จากเดือนก่อน</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <p className="text-muted-foreground text-sm">Avg Skill Score</p>
            <p className="text-tennessee text-3xl font-bold mt-1">72/100</p>
            <p className="text-xs mt-1 text-green-400">↑ +8 points</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <p className="text-muted-foreground text-sm">Assets Created</p>
            <p className="text-tennessee text-3xl font-bold mt-1">156</p>
            <p className="text-xs mt-1 text-green-400">+23 สัปดาห์นี้</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border/30">
            <p className="text-muted-foreground text-sm">Training Completion</p>
            <p className="text-tennessee text-3xl font-bold mt-1">85%</p>
            <p className="text-xs mt-1 text-green-400">↑ จาก 72%</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/30 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-tennessee text-tennessee font-semibold'
                  : 'border-b-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Module Content */}
        <div className="min-h-[400px]">
          {/* Module 1: Skill Assessment */}
          {activeTab === 'skill' && (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-card rounded-xl p-4 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">{member.name}</span>
                    <span className="text-green-400 text-sm font-semibold">+{member.post - member.pre} points</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs w-8">Pre</span>
                    <div className="flex-1 bg-oxford-blue/50 rounded-full h-3">
                      <div className="bg-rackley rounded-full h-3" style={{ width: `${member.pre}%` }} />
                    </div>
                    <span className="text-muted-foreground text-xs w-6">{member.pre}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-muted-foreground text-xs w-8">Post</span>
                    <div className="flex-1 bg-oxford-blue/50 rounded-full h-3">
                      <div className="bg-tennessee rounded-full h-3" style={{ width: `${member.post}%` }} />
                    </div>
                    <span className="text-tennessee text-xs w-6 font-semibold">{member.post}</span>
                  </div>
                </div>
              ))}
              <div className="bg-tennessee/10 rounded-xl p-4 mt-6 text-center">
                <p className="text-tennessee font-semibold">Average improvement: +{avgImprovement} points (24%)</p>
              </div>
            </div>
          )}

          {/* Module 2: Usage Analytics */}
          {activeTab === 'usage' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 text-left text-muted-foreground text-sm">
                    <th className="py-3 px-4">ชื่อ</th>
                    <th className="py-3 px-4">ใช้ล่าสุด</th>
                    <th className="py-3 px-4">Sessions/สัปดาห์</th>
                    <th className="py-3 px-4">Assets ที่ใช้</th>
                    <th className="py-3 px-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {[...teamMembers].sort((a, b) => b.sessions - a.sessions).map((member) => (
                    <tr 
                      key={member.name} 
                      className={`border-b border-border/20 ${member.status === 'dormant' ? 'bg-red-500/5' : ''}`}
                    >
                      <td className="py-3 px-4 text-foreground">{member.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{member.lastActive}</td>
                      <td className="py-3 px-4 text-foreground">{member.sessions}</td>
                      <td className="py-3 px-4 text-foreground">{member.assets}</td>
                      <td className="py-3 px-4 text-sm">
                        {getStatusIndicator(member.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Module 3: Quality Scoring */}
          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualityScores.map((person) => {
                const overall = ((person.clarity + person.relevance + person.completeness) / 3).toFixed(1);
                return (
                  <div key={person.name} className="bg-card rounded-xl p-4 border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-foreground font-medium">
                        {person.name}
                        {person.isTop && (
                          <span className="bg-tennessee text-white text-xs px-2 py-0.5 rounded-full ml-2">Top</span>
                        )}
                      </span>
                      <span className="text-tennessee font-bold">{overall}/10</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs w-24">Clarity</span>
                        <div className="flex-1 bg-oxford-blue/50 rounded-full h-2">
                          <div className="bg-tennessee rounded-full h-2" style={{ width: `${person.clarity * 10}%` }} />
                        </div>
                        <span className="text-xs w-6 text-right">{person.clarity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs w-24">Relevance</span>
                        <div className="flex-1 bg-oxford-blue/50 rounded-full h-2">
                          <div className="bg-tennessee rounded-full h-2" style={{ width: `${person.relevance * 10}%` }} />
                        </div>
                        <span className="text-xs w-6 text-right">{person.relevance}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs w-24">Completeness</span>
                        <div className="flex-1 bg-oxford-blue/50 rounded-full h-2">
                          <div className="bg-tennessee rounded-full h-2" style={{ width: `${person.completeness * 10}%` }} />
                        </div>
                        <span className="text-xs w-6 text-right">{person.completeness}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Module 4: Competency Map */}
          {activeTab === 'competency' && (
            <div className="space-y-2">
              {competencies.map((comp) => {
                const colors = getScoreColor(comp.score);
                return (
                  <div key={comp.name} className="flex items-center gap-4 py-3">
                    <span className="text-foreground text-sm w-40 shrink-0">{comp.name}</span>
                    <div className="flex-1 bg-oxford-blue/50 rounded-full h-4">
                      <div 
                        className={`${colors.bar} rounded-full h-4 transition-all`} 
                        style={{ width: `${comp.score}%` }} 
                      />
                    </div>
                    <span className={`text-sm w-12 text-right font-semibold ${colors.text}`}>
                      {comp.score}/100
                    </span>
                  </div>
                );
              })}
              <div className="flex gap-4 justify-center mt-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> 0-40 Weak</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded" /> 41-70 Developing</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> 71-100 Strong</span>
              </div>
            </div>
          )}

          {/* Module 5: Gap Analysis */}
          {activeTab === 'gap' && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 text-left text-muted-foreground text-sm">
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Skill Gap</th>
                      <th className="py-3 px-4">Current</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Priority Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gapAnalysis.map((item, index) => (
                      <tr key={item.skill} className="border-b border-border/20">
                        <td className="py-3 px-4 text-foreground font-semibold">{index + 1}</td>
                        <td className="py-3 px-4 text-foreground">{item.skill}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.current}</td>
                        <td className="py-3 px-4 text-tennessee font-semibold">{item.target}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {item.priority.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-tennessee/10 border border-tennessee/30 rounded-xl p-6 mt-6">
                <p className="text-tennessee font-semibold mb-2">📋 คำแนะนำ</p>
                <p className="text-foreground">
                  เริ่ม Constraint Setting Workshop จาก SET 2 เพื่อปิด skill gap ที่สำคัญที่สุด — ตามด้วย Iteration & Refinement training
                </p>
              </div>
            </>
          )}

          {/* Module 6: Compliance */}
          {activeTab === 'compliance' && (
            <>
              {/* Compliance Score Ring */}
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32 rounded-full border-8 border-border/30 flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#F27405 0deg ${95 * 3.6}deg, transparent ${95 * 3.6}deg 360deg)`,
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #fff calc(100% - 8px))',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #fff calc(100% - 8px))',
                  }}
                >
                  <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                    <span className="text-tennessee text-3xl font-bold">95%</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 max-w-xl mx-auto mb-8">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30">
                  <span className="text-foreground">✅ AI Usage Policy acknowledged</span>
                  <span className="text-green-400 text-sm">28/30 (93%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30">
                  <span className="text-foreground">✅ Data handling guidelines</span>
                  <span className="text-green-400 text-sm">30/30 (100%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30">
                  <span className="text-foreground">✅ Prompt safety training</span>
                  <span className="text-yellow-400 text-sm">25/30 (83%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30">
                  <span className="text-muted-foreground">⬜ Advanced governance</span>
                  <span className="text-muted-foreground text-sm">0/30 (0%)</span>
                </div>
              </div>

              {/* Audit Log */}
              <h3 className="text-foreground font-semibold mb-4">Audit Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 text-left text-muted-foreground text-sm">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((log, index) => (
                      <tr key={index} className="border-b border-border/20">
                        <td className="py-3 px-4 text-muted-foreground">{log.date}</td>
                        <td className="py-3 px-4 text-foreground">{log.user}</td>
                        <td className="py-3 px-4 text-foreground">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${log.status === 'สำเร็จ' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamDashboard;
