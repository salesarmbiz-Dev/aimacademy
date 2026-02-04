import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface OrgPreview {
  id: string;
  name: string;
  plan: string;
}

const JoinTeam: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { organization, joinOrganization, loading: teamLoading } = useTeam();
  const [orgPreview, setOrgPreview] = useState<OrgPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!code) {
        setError('ไม่พบ Invite Code');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('organizations')
          .select('id, name, plan')
          .eq('invite_code', code.toUpperCase())
          .single();

        if (fetchError || !data) {
          setError('ไม่พบทีมจาก Invite Code นี้');
        } else {
          setOrgPreview(data);
        }
      } catch (e) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, [code]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?redirect=/join/${code}`);
    }
  }, [authLoading, user, code, navigate]);

  const handleJoin = async () => {
    if (!code) return;
    setJoining(true);
    const success = await joinOrganization(code);
    setJoining(false);
    if (success) {
      navigate('/team');
    }
  };

  if (authLoading || loading || teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#012840]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Already a member of this org
  if (organization && orgPreview && organization.id === orgPreview.id) {
    return (
      <>
        <Helmet>
          <title>เข้าร่วมทีม | AIM Academy</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen bg-[#012840] p-4">
          <Card className="bg-card/80 border-[#05F2F2]/30 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
              </div>
              <CardTitle className="text-xl">คุณเป็นสมาชิกอยู่แล้ว</CardTitle>
              <CardDescription>
                คุณเป็นสมาชิกของทีม {organization.name} แล้ว
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/team')}
                className="w-full bg-[#05F2F2] hover:bg-[#05F2F2]/90 text-[#012840]"
              >
                ไปที่ทีมของฉัน
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Helmet>
          <title>เข้าร่วมทีม | AIM Academy</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen bg-[#012840] p-4">
          <Card className="bg-card/80 border-destructive/30 max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">{error}</CardTitle>
              <CardDescription>
                กรุณาตรวจสอบ Invite Code อีกครั้ง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/team')}
                variant="outline"
                className="w-full"
              >
                ไปที่หน้าทีม
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Show join confirmation
  return (
    <>
      <Helmet>
        <title>เข้าร่วมทีม {orgPreview?.name} | AIM Academy</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-[#012840] p-4">
        <Card className="bg-card/80 border-[#05F2F2]/30 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#F27405]/20 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-[#F27405]" />
            </div>
            <CardTitle className="text-xl">เข้าร่วมทีม</CardTitle>
            <CardDescription>
              คุณได้รับเชิญให้เข้าร่วมทีม
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-background/30 rounded-xl border border-muted/20">
              <p className="text-sm text-muted-foreground mb-1">ชื่อทีม</p>
              <p className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-[#05F2F2]" />
                {orgPreview?.name}
              </p>
            </div>

            <Button
              onClick={handleJoin}
              disabled={joining}
              className="w-full bg-[#F27405] hover:bg-[#F27405]/90 text-white"
            >
              {joining ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  กำลังเข้าร่วม...
                </>
              ) : (
                'เข้าร่วมทีม'
              )}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              ยกเลิก
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JoinTeam;
