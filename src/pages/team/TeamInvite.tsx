import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Copy, Check, Link2, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const TeamInvite: React.FC = () => {
  const navigate = useNavigate();
  const { organization, loading, canManage } = useTeam();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    if (!organization) return;
    await navigator.clipboard.writeText(organization.invite_code);
    setCopiedCode(true);
    toast({ title: 'คัดลอก Invite Code แล้ว!' });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!organization) return;
    const link = `${window.location.origin}/join/${organization.invite_code}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast({ title: 'คัดลอกลิงก์แล้ว!' });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!organization) {
    navigate('/team');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>เชิญสมาชิก | AIM Academy</title>
      </Helmet>
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/team')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Link2 className="w-8 h-8 text-[#05F2F2]" />
          เชิญสมาชิกเข้าทีม
        </h1>

        <Card className="bg-card/80 border-[#05F2F2]/20 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Invite Code ของทีมคุณ</CardTitle>
            <CardDescription>
              แชร์ให้สมาชิกเพื่อเข้าร่วมทีม {organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invite Code Display */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-background/50 border border-[#05F2F2]/30 rounded-xl px-6 py-4 text-center">
                <span className="text-3xl font-mono font-bold text-[#05F2F2] tracking-widest">
                  {organization.invite_code}
                </span>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="border-[#05F2F2] text-[#05F2F2] hover:bg-[#05F2F2]/10 h-16 w-16"
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>

            {/* Full Link */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">หรือแชร์ลิงก์นี้:</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background/30 border border-muted rounded-lg px-4 py-3 text-sm text-muted-foreground truncate">
                  {window.location.origin}/join/{organization.invite_code}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="border-muted text-muted-foreground hover:text-foreground"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="ml-2 hidden sm:inline">คัดลอก</span>
                </Button>
              </div>
            </div>

            {/* Member Count */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-muted/20">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                สมาชิก: <span className="text-foreground font-semibold">-- / {organization.max_members}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {canManage && (
          <Button
            onClick={() => navigate('/team/dashboard')}
            className="w-full bg-[#F27405] hover:bg-[#F27405]/90 text-white"
          >
            ไปที่ HR Dashboard
          </Button>
        )}
      </div>
    </>
  );
};

export default TeamInvite;
