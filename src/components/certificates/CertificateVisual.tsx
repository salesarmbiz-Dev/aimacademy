import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GraduationCap } from 'lucide-react';
import { getCertificateByType, formatThaiDate } from '@/data/certificateCriteria';

interface CertificateVisualProps {
  certificateType: string;
  userName: string;
  issuedAt: string;
  verifyCode: string;
  skillsSnapshot?: {
    accuracy?: number;
    speed?: number;
    analysis?: number;
    building?: number;
  } | null;
}

export const CertificateVisual = forwardRef<HTMLDivElement, CertificateVisualProps>(
  ({ certificateType, userName, issuedAt, verifyCode, skillsSnapshot }, ref) => {
    const certInfo = getCertificateByType(certificateType);
    const verifyUrl = `https://aimacademy.lovable.app/verify/${verifyCode}`;

    if (!certInfo) {
      return <div>Certificate type not found</div>;
    }

    const skills = skillsSnapshot || {};

    return (
      <div
        ref={ref}
        className="w-full"
        style={{
          aspectRatio: '1.414',
          background: 'linear-gradient(135deg, #012840 0%, #0a1929 100%)',
          padding: '24px',
          fontFamily: '"Noto Sans Thai", system-ui, sans-serif',
        }}
      >
        {/* Inner Frame */}
        <div
          className="h-full w-full flex flex-col items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, #012840 0%, #0d2137 50%, #012840 100%)',
            border: '2px solid rgba(5, 242, 242, 0.3)',
            padding: '32px 48px',
            position: 'relative',
          }}
        >
          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[rgba(5,242,242,0.3)]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[rgba(5,242,242,0.3)]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[rgba(5,242,242,0.3)]" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[rgba(5,242,242,0.3)]" />

          {/* Top Border */}
          <div
            className="absolute top-6 left-12 right-12 h-[3px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #05F2F2, #F27405, #05F2F2, transparent)',
            }}
          />

          {/* Header */}
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="w-7 h-7 text-[#05F2F2]" />
              <span className="text-[28px] font-extrabold text-[#05F2F2]">
                AIM Academy
              </span>
            </div>
            <h2
              className="text-[18px] font-semibold text-[#6593A6] tracking-[4px] uppercase"
            >
              CERTIFICATE OF COMPLETION
            </h2>
            <p className="text-[14px] text-[#6593A6]">ใบรับรองการผ่านหลักสูตร</p>
          </div>

          {/* Divider */}
          <div className="w-3/4 border-t border-dashed border-[#6593A6] opacity-50 my-2" />

          {/* Certification Text */}
          <div className="text-center">
            <p className="text-[14px] text-[#6593A6] mb-1">This is to certify that</p>
            <p className="text-[12px] text-[#6593A6] mb-4">ขอรับรองว่า</p>
            
            {/* User Name */}
            <div className="inline-block">
              <h1
                className="text-[32px] font-bold text-white pb-2 px-8"
                style={{ borderBottom: '2px solid #F27405' }}
              >
                {userName}
              </h1>
            </div>

            <p className="text-[14px] text-[#6593A6] mt-4 mb-1">
              has successfully completed the requirements for
            </p>
            <p className="text-[12px] text-[#6593A6] mb-4">ได้ผ่านเกณฑ์และสำเร็จหลักสูตร</p>
          </div>

          {/* Certificate Title */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[28px]">{certInfo.icon}</span>
              <span
                className="text-[24px] font-bold"
                style={{ color: certInfo.color }}
              >
                {certInfo.title}
              </span>
            </div>
            <p className="text-[16px] text-[#E5E7EB]">{certInfo.titleTh}</p>
          </div>

          {/* Skills Section */}
          {Object.keys(skills).length > 0 && (
            <div className="flex gap-6 justify-center flex-wrap">
              {skills.analysis !== undefined && (
                <div className="text-center">
                  <span className="text-[12px] text-[#6593A6]">Analysis: </span>
                  <span className="text-[14px] font-bold text-[#05F2F2]">{skills.analysis}%</span>
                </div>
              )}
              {skills.building !== undefined && (
                <div className="text-center">
                  <span className="text-[12px] text-[#6593A6]">Building: </span>
                  <span className="text-[14px] font-bold text-[#05F2F2]">{skills.building}%</span>
                </div>
              )}
              {skills.accuracy !== undefined && (
                <div className="text-center">
                  <span className="text-[12px] text-[#6593A6]">Accuracy: </span>
                  <span className="text-[14px] font-bold text-[#05F2F2]">{skills.accuracy}%</span>
                </div>
              )}
              {skills.speed !== undefined && (
                <div className="text-center">
                  <span className="text-[12px] text-[#6593A6]">Speed: </span>
                  <span className="text-[14px] font-bold text-[#05F2F2]">{skills.speed}%</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="w-full flex items-end justify-between mt-auto">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={verifyUrl}
                size={70}
                bgColor="transparent"
                fgColor="#05F2F2"
                level="M"
              />
            </div>

            {/* Issue Info */}
            <div className="text-center flex-1">
              <p className="text-[12px] text-[#6593A6]">
                Issued: {formatThaiDate(issuedAt)}
              </p>
              <p className="text-[11px] text-[#6593A6] opacity-75 mt-1">
                Verify: aimacademy.lovable.app/verify/{verifyCode}
              </p>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-1">
              <GraduationCap className="w-6 h-6 text-[#05F2F2]" />
              <span className="text-[14px] font-bold text-[#05F2F2]">AIM</span>
            </div>
          </div>

          {/* Bottom Border */}
          <div
            className="absolute bottom-6 left-12 right-12 h-[3px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #05F2F2, #F27405, #05F2F2, transparent)',
            }}
          />
        </div>
      </div>
    );
  }
);

CertificateVisual.displayName = 'CertificateVisual';
