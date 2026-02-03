import React, { useEffect, useState, useRef } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EarnedCertificateCard, LockedCertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateVisual } from '@/components/certificates/CertificateVisual';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { CERTIFICATE_CRITERIA, getCertificateByType } from '@/data/certificateCriteria';

const Certificates: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    fetchUserCertificates,
    calculateProgress,
    getUserProgress,
  } = useCertificates();

  const [earnedCerts, setEarnedCerts] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);
  const [downloadingCert, setDownloadingCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      setIsLoading(true);
      const certs = await fetchUserCertificates();
      setEarnedCerts(certs);
      setIsLoading(false);
    };
    loadCertificates();
  }, [fetchUserCertificates]);

  const userProgress = getUserProgress();
  const earnedTypes = earnedCerts.map((c) => c.certificate_type);
  const lockedCerts = CERTIFICATE_CRITERIA.filter(
    (c) => !earnedTypes.includes(c.type)
  );

  const handleDownload = async (cert: Certificate) => {
    setDownloadingCert(cert);
    // Wait for render
    await new Promise((r) => setTimeout(r, 100));

    if (!certRef.current) return;

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `AIM-Academy-${cert.certificate_type}-${cert.user_name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('ดาวน์โหลดสำเร็จ!');
    } catch (err) {
      toast.error('ไม่สามารถดาวน์โหลดได้ กรุณาลองใหม่');
    } finally {
      setDownloadingCert(null);
    }
  };

  const handleShare = (cert: Certificate) => {
    const url = `https://aimacademy.lovable.app/verify/${cert.verify_code}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Hidden certificate for download */}
      {downloadingCert && (
        <div className="fixed -left-[9999px] top-0">
          <div ref={certRef} style={{ width: 900 }}>
            <CertificateVisual
              certificateType={downloadingCert.certificate_type}
              userName={downloadingCert.user_name}
              issuedAt={downloadingCert.issued_at}
              verifyCode={downloadingCert.verify_code}
              skillsSnapshot={downloadingCert.skills_snapshot}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            ใบรับรองของฉัน
          </h1>
        </div>
        <p className="text-muted-foreground">
          หลักฐานความสำเร็จในการเรียนรู้ AI Prompting
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Earned Certificates */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            ใบรับรองที่ได้รับ
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : earnedCerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedCerts.map((cert) => {
                const certInfo = getCertificateByType(cert.certificate_type);
                if (!certInfo) return null;
                return (
                  <EarnedCertificateCard
                    key={cert.id}
                    certificate={cert}
                    certInfo={certInfo}
                    onDownload={() => handleDownload(cert)}
                    onShare={() => handleShare(cert)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-border/50 bg-card/50">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                คุณยังไม่มีใบรับรอง
              </h3>
              <p className="text-muted-foreground mb-4">
                ทำ Challenge ต่อไปเพื่อปลดล็อคใบรับรองแรกของคุณ!
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                เริ่มเรียนรู้
              </Button>
            </div>
          )}
        </section>

        {/* Locked Certificates */}
        {lockedCerts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              ใบรับรองที่รอปลดล็อค
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedCerts.map((cert) => (
                <LockedCertificateCard
                  key={cert.type}
                  certInfo={cert}
                  progress={calculateProgress(cert.criteria, userProgress)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Certificates;
