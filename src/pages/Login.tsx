import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { AuthDivider } from '@/components/auth/AuthDivider';

type AuthStep = 'phone' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string }>({});

  const validatePhone = () => {
    const newErrors: typeof errors = {};
    
    if (!phoneNumber) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (phoneNumber.length < 9 || phoneNumber.length > 10) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = () => {
    if (!validatePhone()) return;
    
    setLoading(true);
    // Mock OTP request
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('ส่งรหัส OTP แล้ว');
    }, 1000);
  };

  const handleVerifyOTP = (otp: string) => {
    setLoading(true);
    // Mock OTP verification
    console.log('Verifying OTP:', otp);
    setTimeout(() => {
      setLoading(false);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate('/dashboard');
    }, 1500);
  };

  const handleResendOTP = () => {
    toast.success('ส่งรหัส OTP ใหม่แล้ว');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-oxford rounded-xl p-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-turquoise font-bold text-[32px] mb-2">AIM Academy</h1>
          <p className="text-rackley text-[15px]">เรียนรู้ AI Prompting แบบ Gamification</p>
        </div>

        {step === 'phone' ? (
          <>
            {/* Google Sign-in */}
            <GoogleSignInButton variant="login" loading={loading} />

            {/* Divider */}
            <AuthDivider />

            {/* Phone Input */}
            <div className="space-y-5">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={errors.phone}
                disabled={loading}
              />

              {/* OTP Request Button */}
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading}
                className="w-full h-12 bg-tennessee text-white font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'ขอรหัส OTP'
                )}
              </button>
            </div>

            {/* Register Link */}
            <p className="mt-6 text-center text-rackley text-sm">
              ยังไม่มีบัญชี?{' '}
              <Link to="/register" className="text-turquoise hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </>
        ) : (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={() => setStep('phone')}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
