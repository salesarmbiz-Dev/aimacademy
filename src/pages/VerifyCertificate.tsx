import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { getCertificateByType, formatThaiDate } from '@/data/certificateCriteria';

const VerifyCertificate: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { fetchCertificateByCode, loading } = useCertificates();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (code) {
      fetchCertificateByCode(code).then((cert) => {
        if (cert) {
          setCertificate(cert);
        } else {
          setNotFound(true);
        }
      });
    }
  }, [code, fetchCertificateByCode]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #012840 0%, #260D0B 100%)',
        }}
      >
        <div className="max-w-md w-full space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #012840 0%, #260D0B 100%)',
        }}
      >
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ไม่พบใบรับรองนี้
          </h1>
          <p className="text-white/60 mb-2">Certificate not found</p>
          <p className="text-white/40 text-sm mb-8">
            รหัสยืนยันไม่ถูกต้องหรือถูกลบแล้ว
          </p>
          <Button onClick={() => navigate('/')}>กลับหน้าหลัก</Button>
        </div>
      </div>
    );
  }

  if (!certificate) return null;

  const certInfo = getCertificateByType(certificate.certificate_type);
  const skills = certificate.skills_snapshot || {};

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #012840 0%, #260D0B 100%)',
      }}
    >
      <div className="max-w-lg w-full">
        {/* Verified Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-center mb-6"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-1">
            ✅ ใบรับรองนี้เป็นของจริง
          </h1>
          <p className="text-white/60">This certificate is verified</p>
        </motion.div>

        {/* Certificate Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl mb-6"
          style={{
            background: 'rgba(1, 40, 64, 0.8)',
            border: '1px solid rgba(5, 242, 242, 0.3)',
          }}
        >
          {/* Certificate Title */}
          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">{certInfo?.icon}</span>
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: certInfo?.color }}
            >
              {certInfo?.title}
            </h2>
            <p className="text-white/70">{certInfo?.titleTh}</p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">ผู้ได้รับ:</span>
              <span className="text-white font-medium">
                {certificate.user_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">ออกเมื่อ:</span>
              <span className="text-white">
                {formatThaiDate(certificate.issued_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">รหัสยืนยัน:</span>
              <span className="text-white font-mono">
                {certificate.verify_code}
              </span>
            </div>
          </div>

          {/* Skills */}
          {Object.keys(skills).length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-white/50 text-sm mb-3">
                ทักษะที่ได้รับการรับรอง:
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {skills.analysis !== undefined && (
                  <div className="text-center">
                    <span className="text-[#05F2F2] font-bold">
                      {skills.analysis}%
                    </span>
                    <p className="text-white/50 text-xs">Analysis</p>
                  </div>
                )}
                {skills.building !== undefined && (
                  <div className="text-center">
                    <span className="text-[#05F2F2] font-bold">
                      {skills.building}%
                    </span>
                    <p className="text-white/50 text-xs">Building</p>
                  </div>
                )}
                {skills.accuracy !== undefined && (
                  <div className="text-center">
                    <span className="text-[#05F2F2] font-bold">
                      {skills.accuracy}%
                    </span>
                    <p className="text-white/50 text-xs">Accuracy</p>
                  </div>
                )}
                {skills.speed !== undefined && (
                  <div className="text-center">
                    <span className="text-[#05F2F2] font-bold">
                      {skills.speed}%
                    </span>
                    <p className="text-white/50 text-xs">Speed</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl text-center"
          style={{
            background: 'rgba(1, 40, 64, 0.5)',
            border: '1px solid rgba(101, 147, 166, 0.3)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-[#05F2F2]" />
            <span className="text-white font-semibold">AIM Academy</span>
          </div>
          <p className="text-white/60 text-sm mb-4">
            แพลตฟอร์มเรียนรู้ AI Prompting แบบ Gamification
          </p>
          <Button
            className="w-full"
            onClick={() => navigate('/')}
          >
            เริ่มเรียนรู้ AI Prompting ฟรี
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
