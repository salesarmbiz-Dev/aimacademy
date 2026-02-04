import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  admin_user_id: string;
  invite_code: string;
  max_members: number;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'member';
  joined_at: string;
  // Extended fields from joins
  user_email?: string;
  display_name?: string;
}

export interface MemberWithStats extends OrgMember {
  display_name: string;
  user_email: string;
  level: number;
  pre_test_score: number | null;
  post_test_score: number | null;
  score_change: number | null;
  last_active: string | null;
  challenges_completed: number;
  completion_percentage: number;
}

const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'AIM-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useTeam = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<OrgMember | null>(null);
  const [members, setMembers] = useState<MemberWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchUserOrganization = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // First check if user is a member of any org
      const { data: memberData, error: memberError } = await supabase
        .from('org_members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (memberData) {
        setMembership(memberData as OrgMember);
        
        // Fetch the organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', memberData.org_id)
          .single();

        if (orgError) throw orgError;
        setOrganization(orgData as Organization);
      } else {
        setMembership(null);
        setOrganization(null);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserOrganization();
  }, [fetchUserOrganization]);

  const createOrganization = async (name: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const inviteCode = generateInviteCode();
      
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name,
          admin_user_id: user.id,
          invite_code: inviteCode,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: orgData.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      toast({
        title: 'สร้างทีมสำเร็จ!',
        description: `Invite Code: ${inviteCode}`,
      });

      await fetchUserOrganization();
      return true;
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถสร้างทีมได้',
        variant: 'destructive',
      });
      return false;
    }
  };

  const joinOrganization = async (inviteCode: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Find organization by invite code
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (orgError || !orgData) {
        toast({
          title: 'ไม่พบทีม',
          description: 'กรุณาตรวจสอบ Invite Code',
          variant: 'destructive',
        });
        return false;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('org_members')
        .select('id')
        .eq('org_id', orgData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: 'คุณเป็นสมาชิกอยู่แล้ว',
          description: `คุณเป็นสมาชิกของทีม ${orgData.name} แล้ว`,
        });
        return true;
      }

      // Check member count
      const { count } = await supabase
        .from('org_members')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgData.id);

      if (count && count >= orgData.max_members) {
        toast({
          title: 'ทีมเต็มแล้ว',
          description: 'ทีมนี้มีสมาชิกครบจำนวนแล้ว',
          variant: 'destructive',
        });
        return false;
      }

      // Join the organization
      const { error: joinError } = await supabase
        .from('org_members')
        .insert({
          org_id: orgData.id,
          user_id: user.id,
          role: 'member',
        });

      if (joinError) throw joinError;

      toast({
        title: 'เข้าร่วมทีมสำเร็จ!',
        description: `ยินดีต้อนรับสู่ทีม ${orgData.name}`,
      });

      await fetchUserOrganization();
      return true;
    } catch (error: any) {
      console.error('Error joining organization:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถเข้าร่วมทีมได้',
        variant: 'destructive',
      });
      return false;
    }
  };

  const fetchMembers = useCallback(async (): Promise<MemberWithStats[]> => {
    if (!organization) return [];

    setMembersLoading(true);
    try {
      // Get all members of the org
      const { data: membersData, error: membersError } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', organization.id);

      if (membersError) throw membersError;

      // For each member, get their stats
      const membersWithStats: MemberWithStats[] = await Promise.all(
        (membersData || []).map(async (member) => {
          // Get assessment attempts
          const { data: attempts } = await supabase
            .from('assessment_attempts')
            .select('*')
            .eq('user_id', member.user_id)
            .eq('status', 'completed');

          const preTest = attempts?.find(a => a.assessment_type === 'pre_test');
          const postTest = attempts?.find(a => a.assessment_type === 'post_test');

          // Get last activity
          const { data: lastActivity } = await supabase
            .from('user_activity_log')
            .select('created_at')
            .eq('user_id', member.user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get challenge completions count
          const { count: challengeCount } = await supabase
            .from('user_activity_log')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', member.user_id)
            .eq('activity_type', 'challenge_complete');

          // Calculate completion percentage
          let completionPct = 0;
          if (preTest) completionPct += 25;
          const challenges = challengeCount || 0;
          completionPct += Math.min(25, (challenges / 20) * 25);
          if (postTest) completionPct += 25;
          if (postTest && (postTest.percentage || 0) >= 60) completionPct += 25;

          // Calculate level (simplified - based on challenges completed)
          const level = Math.min(10, Math.floor((challengeCount || 0) / 5) + 1);

          return {
            ...member,
            role: member.role as 'admin' | 'manager' | 'member',
            display_name: `สมาชิก ${member.user_id.slice(0, 4)}`,
            user_email: `user-${member.user_id.slice(0, 8)}@example.com`,
            level,
            pre_test_score: preTest ? preTest.percentage : null,
            post_test_score: postTest ? postTest.percentage : null,
            score_change: preTest && postTest ? (postTest.percentage || 0) - (preTest.percentage || 0) : null,
            last_active: lastActivity?.created_at || null,
            challenges_completed: challengeCount || 0,
            completion_percentage: completionPct,
          };
        })
      );

      setMembers(membersWithStats);
      return membersWithStats;
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    } finally {
      setMembersLoading(false);
    }
  }, [organization]);

  const isAdmin = membership?.role === 'admin';
  const isManager = membership?.role === 'manager';
  const canManage = isAdmin || isManager;

  return {
    organization,
    membership,
    members,
    loading,
    membersLoading,
    isAdmin,
    isManager,
    canManage,
    createOrganization,
    joinOrganization,
    fetchMembers,
    refetch: fetchUserOrganization,
  };
};
