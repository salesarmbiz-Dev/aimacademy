import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Link as LinkIcon, Linkedin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateVisual } from '@/components/certificates/CertificateVisual';
import { useCertificates, Certificate } from '@/hooks/useCertificates';

const CertificateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchCertificateById, loading } = useCertificates();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchCertificateById(id).then(setCertificate);
    }
  }, [id, fetchCertificateById]);

  const handleDownload = async () => {
    if (!certRef.current || !certificate) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `AIM-Academy-${certificate.certificate_type}-${certificate.user_name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('ดาวน์โหลดสำเร็จ!');
    } catch (err) {
      toast.error('ไม่สามารถดาวน์โหลดได้ กรุณาลองใหม่');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (!certificate) return;
    const url = `https://aimacademy.lovable.app/verify/${certificate.verify_code}`;
    navigator.clipboard.writeText(url);
    toast.success('คัดลอกลิงก์แล้ว');
  };

  const handleShareLinkedIn = () => {
    if (!certificate) return;
    const url = `https://aimacademy.lovable.app/verify/${certificate.verify_code}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
  };

  if (loading || !certificate) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-24 mb-8" />
          <Skeleton className="w-full aspect-[1.414] rounded-lg mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/certificates')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        {/* Certificate Visual */}
        <div
          ref={certRef}
          className="w-full mb-6 rounded-lg overflow-hidden shadow-2xl"
        >
          <CertificateVisual
            certificateType={certificate.certificate_type}
            userName={certificate.user_name}
            issuedAt={certificate.issued_at}
            verifyCode={certificate.verify_code}
            skillsSnapshot={certificate.skills_snapshot}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 h-12"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด'}
          </Button>

          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={handleCopyLink}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            คัดลอกลิงก์
          </Button>

          <Button
            className="flex-1 h-12"
            style={{ background: '#0077B5' }}
            onClick={handleShareLinkedIn}
          >
            <Linkedin className="w-4 h-4 mr-2" />
            แชร์บน LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
