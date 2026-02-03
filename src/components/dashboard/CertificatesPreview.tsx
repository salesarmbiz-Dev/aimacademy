import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { CERTIFICATE_CRITERIA, getCertificateByType, formatShortThaiDate } from '@/data/certificateCriteria';

const CertificatesPreview: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUserCertificates, calculateProgress, getUserProgress, loading } = useCertificates();
  const [earnedCerts, setEarnedCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchUserCertificates().then(setEarnedCerts);
  }, [fetchUserCertificates]);

  const userProgress = getUserProgress();
  const earnedTypes = earnedCerts.map((c) => c.certificate_type);

  // Find next certificate to unlock
  const nextToUnlock = CERTIFICATE_CRITERIA.find((c) => !earnedTypes.includes(c.type));
  const nextProgress = nextToUnlock
    ? calculateProgress(nextToUnlock.criteria, userProgress)
    : null;

  // Get latest earned certificate
  const latestEarned = earnedCerts[0];
  const latestCertInfo = latestEarned ? getCertificateByType(latestEarned.certificate_type) : null;

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">ใบรับรอง</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/certificates')}
          >
            ดูทั้งหมด
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Earned */}
        {latestEarned && latestCertInfo && (
          <div
            className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(5, 242, 242, 0.1)',
              border: '1px solid rgba(5, 242, 242, 0.3)',
            }}
            onClick={() => navigate(`/certificate/${latestEarned.id}`)}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{latestCertInfo.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {latestCertInfo.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  ได้รับเมื่อ {formatShortThaiDate(latestEarned.issued_at)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Next to Unlock */}
        {nextToUnlock && nextProgress && (
          <div
            className="p-4 rounded-xl opacity-80"
            style={{
              background: 'rgba(101, 147, 166, 0.1)',
              border: '1px solid rgba(101, 147, 166, 0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <span className="text-2xl grayscale opacity-60">{nextToUnlock.icon}</span>
                <Lock className="absolute -top-1 -right-1 w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-muted-foreground truncate">
                  {nextToUnlock.title}
                </h4>
                <p className="text-xs text-muted-foreground/70">
                  ใบรับรองถัดไป
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Progress value={nextProgress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(nextProgress.percentage)}% complete
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && earnedCerts.length === 0 && !nextToUnlock && (
          <div className="text-center py-4">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              ทำ Challenge เพื่อปลดล็อคใบรับรอง
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificatesPreview;
