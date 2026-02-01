import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  loading?: boolean;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  loading = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask phone number: 081-XXX-XXXX
  const maskedPhone = phoneNumber.length >= 10
    ? `${phoneNumber.slice(0, 3)}-XXX-${phoneNumber.slice(-4)}`
    : phoneNumber;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      onVerify(pastedData);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    setOtp(Array(6).fill(''));
    onResend();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-white text-xl font-bold mb-2">ยืนยันเบอร์โทรศัพท์</h2>
        <p className="text-rackley text-sm">
          ส่งรหัส OTP ไปที่ {maskedPhone}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            disabled={loading}
            className="w-12 h-12 text-center text-xl font-bold bg-rootbeer/50 border border-rackley rounded-[10px] text-white focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="button"
        onClick={() => onVerify(otp.join(''))}
        disabled={loading || otp.some(d => !d)}
        className="w-full h-12 bg-tennessee text-white font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'ยืนยัน'
        )}
      </button>

      {/* Resend Link */}
      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-turquoise text-sm hover:underline"
          >
            ไม่ได้รับรหัส? ส่งอีกครั้ง
          </button>
        ) : (
          <p className="text-rackley text-sm">
            ส่งรหัสอีกครั้งใน {countdown} วินาที
          </p>
        )}
      </div>

      {/* Back Link */}
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full text-rackley text-sm hover:text-turquoise transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        เปลี่ยนเบอร์โทรศัพท์
      </button>
    </div>
  );
};
