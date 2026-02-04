import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, Link2, Users, ArrowRight, Crown, UserCog, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const TeamHub: React.FC = () => {
  const navigate = useNavigate();
  const { organization, membership, loading, canManage, createOrganization, joinOrganization } = useTeam();
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    setIsCreating(true);
    const success = await createOrganization(teamName.trim());
    setIsCreating(false);
    if (success) {
      navigate('/team/dashboard');
    }
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    await joinOrganization(inviteCode.trim());
    setIsJoining(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // User has a team
  if (organization && membership) {
    const roleIcon = membership.role === 'admin' ? Crown : membership.role === 'manager' ? UserCog : User;
    const roleLabel = membership.role === 'admin' ? 'Admin' : membership.role === 'manager' ? 'Manager' : 'Member';
    const RoleIcon = roleIcon;

    return (
      <>
        <Helmet>
          <title>ทีมของฉัน | AIM Academy</title>
        </Helmet>
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#05F2F2]" />
            ทีมของฉัน
          </h1>

          <Card className="bg-card/80 border-[#05F2F2]/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#F27405]" />
                    {organization.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Invite Code: <span className="font-mono text-[#05F2F2]">{organization.invite_code}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05F2F2]/10 border border-[#05F2F2]/30">
                  <RoleIcon className="w-4 h-4 text-[#05F2F2]" />
                  <span className="text-sm text-[#05F2F2]">{roleLabel}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                {canManage && (
                  <Button
                    onClick={() => navigate('/team/dashboard')}
                    className="bg-[#F27405] hover:bg-[#F27405]/90 text-white flex-1"
                  >
                    เข้า HR Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/team/invite')}
                  variant="outline"
                  className="border-[#05F2F2] text-[#05F2F2] hover:bg-[#05F2F2]/10 flex-1"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  เชิญสมาชิก
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team stats preview for members */}
          {!canManage && (
            <Card className="bg-card/80 border-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">สถิติของฉันในทีม</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  ดูความก้าวหน้าของคุณเทียบกับค่าเฉลี่ยของทีมได้ที่หน้า Dashboard
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                  className="mt-4 text-[#05F2F2]"
                >
                  ไปที่ Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </>
    );
  }

  // User has no team - show create/join options
  return (
    <>
      <Helmet>
        <title>ทีมของฉัน | AIM Academy</title>
      </Helmet>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#05F2F2]" />
          ทีมของฉัน
        </h1>
        <p className="text-muted-foreground mb-8">
          สร้างทีมใหม่เพื่อ track ความก้าวหน้า หรือเข้าร่วมทีมที่มี Invite Code
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Team Card */}
          <Card className="bg-card/80 border-[#F27405]/30 hover:border-[#F27405]/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F27405]" />
                สร้างทีมใหม่
              </CardTitle>
              <CardDescription>
                สำหรับ HR หรือหัวหน้าทีมที่ต้องการ track พัฒนาการของทีม
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ชื่อทีม/องค์กร</label>
                <Input
                  placeholder="เช่น บริษัท AI Solutions"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-background/50 border-muted"
                />
              </div>
              <Button
                onClick={handleCreateTeam}
                disabled={!teamName.trim() || isCreating}
                className="w-full bg-[#F27405] hover:bg-[#F27405]/90 text-white"
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    กำลังสร้าง...
                  </>
                ) : (
                  'สร้างทีม'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Join Team Card */}
          <Card className="bg-card/80 border-[#05F2F2]/30 hover:border-[#05F2F2]/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#05F2F2]" />
                เข้าร่วมทีม
              </CardTitle>
              <CardDescription>
                มี Invite Code แล้ว? กรอกเพื่อเข้าร่วมทีม
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Invite Code</label>
                <Input
                  placeholder="เช่น AIM-ABCD"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="bg-background/50 border-muted font-mono uppercase"
                  maxLength={8}
                />
              </div>
              <Button
                onClick={handleJoinTeam}
                disabled={!inviteCode.trim() || isJoining}
                variant="outline"
                className="w-full border-[#05F2F2] text-[#05F2F2] hover:bg-[#05F2F2]/10"
              >
                {isJoining ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    กำลังเข้าร่วม...
                  </>
                ) : (
                  'เข้าร่วม'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeamHub;
