import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Linkedin, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { getCertificateByType } from '@/data/certificateCriteria';

interface CertificateAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    id: string;
    certificate_type: string;
    title: string;
    user_name: string;
    verify_code: string;
  } | null;
  onDownload?: () => void;
}

export const CertificateAwardModal: React.FC<CertificateAwardModalProps> = ({
  isOpen,
  onClose,
  certificate,
  onDownload,
}) => {
  const navigate = useNavigate();
  const hasConfettied = useRef(false);

  useEffect(() => {
    if (isOpen && certificate && !hasConfettied.current) {
      hasConfettied.current = true;
      
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#05F2F2', '#F27405', '#FFD700', '#22C55E'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    if (!isOpen) {
      hasConfettied.current = false;
    }
  }, [isOpen, certificate]);

  if (!certificate) return null;

  const certInfo = getCertificateByType(certificate.certificate_type);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    `https://aimacademy.lovable.app/verify/${certificate.verify_code}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-md p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #012840 0%, #0a1929 100%)',
              border: '2px solid rgba(5, 242, 242, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                ยินดีด้วย!
              </h2>
              <p className="text-muted-foreground mb-6">
                คุณได้รับใบรับรอง
              </p>

              {/* Certificate Preview */}
              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background: 'rgba(1, 40, 64, 0.6)',
                  border: '1px solid rgba(5, 242, 242, 0.2)',
                }}
              >
                <span className="text-4xl block mb-2">{certInfo?.icon}</span>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: certInfo?.color }}
                >
                  {certInfo?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {certInfo?.titleTh}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    onClose();
                    navigate(`/certificate/${certificate.id}`);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  ดูใบรับรอง
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ดาวน์โหลด
                  </Button>

                  <Button
                    className="flex-1"
                    style={{ background: '#0077B5' }}
                    onClick={() => window.open(linkedInUrl, '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    แชร์บน LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
