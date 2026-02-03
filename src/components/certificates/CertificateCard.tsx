import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CertificateType, formatShortThaiDate } from '@/data/certificateCriteria';

interface EarnedCertificateCardProps {
  certificate: {
    id: string;
    certificate_type: string;
    issued_at: string;
    verify_code: string;
  };
  certInfo: CertificateType;
  onDownload: () => void;
  onShare: () => void;
}

export const EarnedCertificateCard: React.FC<EarnedCertificateCardProps> = ({
  certificate,
  certInfo,
  onDownload,
  onShare,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      className="p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
      style={{
        background: 'rgba(1, 40, 64, 0.8)',
        border: '1px solid rgba(5, 242, 242, 0.3)',
      }}
      onClick={() => navigate(`/certificate/${certificate.id}`)}
    >
      <div className="text-center mb-4">
        <span className="text-4xl mb-2 block">{certInfo.icon}</span>
        <h3 className="text-lg font-bold" style={{ color: certInfo.color }}>
          {certInfo.title}
        </h3>
        <p className="text-sm text-muted-foreground">{certInfo.titleTh}</p>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-4">
        ออกเมื่อ: {formatShortThaiDate(certificate.issued_at)}
      </p>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-1" />
          ดาวน์โหลด
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-1" />
          แชร์
        </Button>
      </div>
    </Card>
  );
};

interface LockedCertificateCardProps {
  certInfo: CertificateType;
  progress: {
    percentage: number;
    criteria: Array<{
      label: string;
      current: number;
      target: number;
      met: boolean;
    }>;
  };
}

export const LockedCertificateCard: React.FC<LockedCertificateCardProps> = ({
  certInfo,
  progress,
}) => {
  return (
    <Card
      className="p-6 opacity-85"
      style={{
        background: 'rgba(1, 40, 64, 0.4)',
        border: '1px solid rgba(101, 147, 166, 0.3)',
      }}
    >
      <div className="text-center mb-4">
        <div className="relative inline-block">
          <span className="text-4xl mb-2 block grayscale opacity-60">
            {certInfo.icon}
          </span>
          <Lock className="absolute -top-1 -right-1 w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-muted-foreground">
          {certInfo.title}
        </h3>
        <p className="text-sm text-muted-foreground/70">{certInfo.titleTh}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">เกณฑ์:</p>
        <div className="space-y-1">
          {progress.criteria.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {c.met ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-3 h-3 border border-muted-foreground/50 rounded-sm" />
              )}
              <span className={c.met ? 'text-green-500' : 'text-muted-foreground'}>
                {c.label} (คุณ: {c.current.toLocaleString()}/{c.target.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Progress
          value={progress.percentage}
          className="h-2"
          style={{
            background: 'rgba(101, 147, 166, 0.3)',
          }}
        />
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(progress.percentage)}%
        </p>
      </div>
    </Card>
  );
};
