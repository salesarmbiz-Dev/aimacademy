import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import {
  CERTIFICATE_CRITERIA,
  CertificateCriteria,
  generateVerifyCode,
} from '@/data/certificateCriteria';

export interface Certificate {
  id: string;
  user_id: string;
  certificate_type: string;
  title: string;
  description: string | null;
  issued_at: string;
  verify_code: string;
  user_name: string;
  skills_snapshot: Record<string, number> | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface UserProgress {
  level: number;
  totalXp: number;
  challengesCompleted: number;
  accuracy: number;
  spotChallenges: number;
  spotAccuracy: number;
  legoChallenges: number;
  legoAccuracy: number;
}

export const useCertificates = () => {
  const { user } = useAuth();
  const { stats, profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user progress from context
  const getUserProgress = useCallback((): UserProgress => {
    return {
      level: stats.level,
      totalXp: stats.totalXp,
      challengesCompleted: stats.challengesCompleted,
      accuracy: 75, // Mock value for now
      spotChallenges: 15, // Mock value
      spotAccuracy: 78, // Mock value
      legoChallenges: 12, // Mock value
      legoAccuracy: 72, // Mock value
    };
  }, [stats]);

  // Check if user meets criteria for a certificate
  const meetsCriteria = useCallback(
    (criteria: CertificateCriteria, progress: UserProgress): boolean => {
      if (criteria.minLevel && progress.level < criteria.minLevel) return false;
      if (criteria.minTotalXp && progress.totalXp < criteria.minTotalXp) return false;
      if (criteria.minChallengesCompleted && progress.challengesCompleted < criteria.minChallengesCompleted) return false;
      if (criteria.minAccuracy && progress.accuracy < criteria.minAccuracy) return false;
      if (criteria.minSpotChallenges && progress.spotChallenges < criteria.minSpotChallenges) return false;
      if (criteria.minSpotAccuracy && progress.spotAccuracy < criteria.minSpotAccuracy) return false;
      if (criteria.minLegoChallenges && progress.legoChallenges < criteria.minLegoChallenges) return false;
      if (criteria.minLegoAccuracy && progress.legoAccuracy < criteria.minLegoAccuracy) return false;
      return true;
    },
    []
  );

  // Calculate progress percentage for a certificate
  const calculateProgress = useCallback(
    (criteria: CertificateCriteria, progress: UserProgress) => {
      const checks: Array<{ label: string; current: number; target: number; met: boolean }> = [];
      let total = 0;
      let met = 0;

      if (criteria.minLevel) {
        const isMet = progress.level >= criteria.minLevel;
        checks.push({ label: `Level ${criteria.minLevel}+`, current: progress.level, target: criteria.minLevel, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minTotalXp) {
        const isMet = progress.totalXp >= criteria.minTotalXp;
        checks.push({ label: `XP ${criteria.minTotalXp.toLocaleString()}+`, current: progress.totalXp, target: criteria.minTotalXp, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minChallengesCompleted) {
        const isMet = progress.challengesCompleted >= criteria.minChallengesCompleted;
        checks.push({ label: `ทำ Challenge ${criteria.minChallengesCompleted}+`, current: progress.challengesCompleted, target: criteria.minChallengesCompleted, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minAccuracy) {
        const isMet = progress.accuracy >= criteria.minAccuracy;
        checks.push({ label: `Accuracy ${criteria.minAccuracy}%+`, current: progress.accuracy, target: criteria.minAccuracy, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minSpotChallenges) {
        const isMet = progress.spotChallenges >= criteria.minSpotChallenges;
        checks.push({ label: `Spot Challenge ${criteria.minSpotChallenges}+`, current: progress.spotChallenges, target: criteria.minSpotChallenges, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minSpotAccuracy) {
        const isMet = progress.spotAccuracy >= criteria.minSpotAccuracy;
        checks.push({ label: `Spot Accuracy ${criteria.minSpotAccuracy}%+`, current: progress.spotAccuracy, target: criteria.minSpotAccuracy, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minLegoChallenges) {
        const isMet = progress.legoChallenges >= criteria.minLegoChallenges;
        checks.push({ label: `Lego Challenge ${criteria.minLegoChallenges}+`, current: progress.legoChallenges, target: criteria.minLegoChallenges, met: isMet });
        total++;
        if (isMet) met++;
      }
      if (criteria.minLegoAccuracy) {
        const isMet = progress.legoAccuracy >= criteria.minLegoAccuracy;
        checks.push({ label: `Lego Accuracy ${criteria.minLegoAccuracy}%+`, current: progress.legoAccuracy, target: criteria.minLegoAccuracy, met: isMet });
        total++;
        if (isMet) met++;
      }

      return {
        percentage: total > 0 ? (met / total) * 100 : 0,
        criteria: checks,
      };
    },
    []
  );

  // Fetch user's earned certificates
  const fetchUserCertificates = useCallback(async (): Promise<Certificate[]> => {
    if (!user?.id) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data as Certificate[]) || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch a single certificate by ID
  const fetchCertificateById = useCallback(async (id: string): Promise<Certificate | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data as Certificate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch certificate');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch certificate by verify code (public)
  const fetchCertificateByCode = useCallback(async (code: string): Promise<Certificate | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('certificates')
        .select('*')
        .eq('verify_code', code)
        .single();

      if (fetchError) throw fetchError;
      return data as Certificate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Certificate not found');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Award a new certificate
  const awardCertificate = useCallback(
    async (certificateType: string): Promise<Certificate | null> => {
      if (!user?.id || !profile?.name) return null;

      const certInfo = CERTIFICATE_CRITERIA.find((c) => c.type === certificateType);
      if (!certInfo) return null;

      const progress = getUserProgress();

      try {
        const newCert = {
          user_id: user.id,
          certificate_type: certificateType,
          title: certInfo.title,
          description: certInfo.description,
          verify_code: generateVerifyCode(),
          user_name: profile.name,
          skills_snapshot: {
            accuracy: progress.accuracy,
            speed: Math.round(Math.random() * 30 + 60), // Mock
            analysis: progress.spotAccuracy,
            building: progress.legoAccuracy,
          },
          metadata: {
            level: progress.level,
            totalXp: progress.totalXp,
          },
        };

        const { data, error: insertError } = await supabase
          .from('certificates')
          .insert(newCert)
          .select()
          .single();

        if (insertError) throw insertError;
        return data as Certificate;
      } catch (err) {
        console.error('Failed to award certificate:', err);
        return null;
      }
    },
    [user?.id, profile?.name, getUserProgress]
  );

  // Check and award eligible certificates
  const checkAndAwardCertificates = useCallback(async (): Promise<Certificate | null> => {
    if (!user?.id) return null;

    // Get already earned certificates
    const earned = await fetchUserCertificates();
    const earnedTypes = earned.map((c) => c.certificate_type);

    const progress = getUserProgress();

    // Check each certificate type
    for (const cert of CERTIFICATE_CRITERIA) {
      if (earnedTypes.includes(cert.type)) continue;

      if (meetsCriteria(cert.criteria, progress)) {
        const awarded = await awardCertificate(cert.type);
        if (awarded) return awarded;
      }
    }

    return null;
  }, [user?.id, fetchUserCertificates, getUserProgress, meetsCriteria, awardCertificate]);

  return {
    loading,
    error,
    fetchUserCertificates,
    fetchCertificateById,
    fetchCertificateByCode,
    awardCertificate,
    checkAndAwardCertificates,
    calculateProgress,
    getUserProgress,
    meetsCriteria,
  };
};
