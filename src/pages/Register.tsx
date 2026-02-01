import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { ConsentCheckbox } from '@/components/register/ConsentCheckbox';
import { LegalModal } from '@/components/register/LegalModal';
import { supabase } from '@/integrations/supabase/client';

type AuthStep = 'form' | 'otp';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<AuthStep>('form');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Consent states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    consent?: string;
  }>({});

  const isConsentValid = termsAccepted && privacyAccepted;

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name) {
      newErrors.name = 'กรุณากรอกชื่อ';
    } else if (name.length < 2) {
      newErrors.name = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    
    if (!phoneNumber) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (phoneNumber.length < 9 || phoneNumber.length > 10) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    if (!isConsentValid) {
      newErrors.consent = 'กรุณายอมรับข้อกำหนดและนโยบายก่อนสมัคร';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Mock OTP request
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('ส่งรหัส OTP แล้ว');
    }, 1000);
  };

  const saveConsent = async (userId: string) => {
    const now = new Date().toISOString();
    await supabase.from('user_consents').insert({
      user_id: userId,
      terms_accepted: true,
      terms_accepted_at: now,
      privacy_accepted: true,
      privacy_accepted_at: now,
      marketing_consent: marketingConsent,
      marketing_consent_at: marketingConsent ? now : null,
      user_agent: navigator.userAgent
    });
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    // Mock OTP verification and user creation
    console.log('Verifying OTP:', otp, 'for phone:', phoneNumber, 'name:', name);
    
    setTimeout(async () => {
      // In real implementation, this would create user and get user ID
      // For now, we'll just mock it
      const mockUserId = crypto.randomUUID();
      await saveConsent(mockUserId);
      
      setLoading(false);
      toast.success('สมัครสมาชิกสำเร็จ!');
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
          <p className="text-rackley text-[15px]">เริ่มต้นการเรียนรู้ AI ที่สนุกที่สุด</p>
        </div>

        {step === 'form' ? (
          <>
            {/* Google Sign-up */}
            <GoogleSignInButton variant="register" loading={loading} />

            {/* Divider */}
            <AuthDivider />

            {/* Form */}
            <div className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  ชื่อที่แสดง
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อของคุณ"
                  disabled={loading}
                  className="w-full h-12 px-4 bg-rootbeer/50 border border-rackley rounded-[10px] text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.name && (
                  <p className="mt-1 text-tennessee text-sm">{errors.name}</p>
                )}
              </div>

              {/* Phone Input */}
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={errors.phone}
                disabled={loading}
              />

              {/* Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <ConsentCheckbox
                  id="terms"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  error={!!errors.consent && !termsAccepted}
                >
                  ฉันยอมรับ{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-turquoise underline hover:text-turquoise/80 transition-colors"
                  >
                    ข้อกำหนดการใช้งาน
                  </button>{' '}
                  และ{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-turquoise underline hover:text-turquoise/80 transition-colors"
                  >
                    นโยบายความเป็นส่วนตัว
                  </button>
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={setPrivacyAccepted}
                  error={!!errors.consent && !privacyAccepted}
                >
                  ฉันยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลของฉันตามที่ระบุในนโยบายความเป็นส่วนตัว{' '}
                  <span className="text-tennessee">(จำเป็น)</span>
                </ConsentCheckbox>

                <ConsentCheckbox
                  id="marketing"
                  checked={marketingConsent}
                  onChange={setMarketingConsent}
                >
                  ฉันต้องการรับข่าวสาร โปรโมชัน และอัปเดตจาก AIM Academy{' '}
                  <span className="text-rackley">(ไม่บังคับ)</span>
                </ConsentCheckbox>

                {errors.consent && (
                  <p className="text-tennessee text-sm">{errors.consent}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading || !isConsentValid}
                className="w-full h-12 bg-tennessee text-white font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'สมัครสมาชิก'
                )}
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-rackley text-sm">
              มีบัญชีแล้ว?{' '}
              <Link to="/login" className="text-turquoise hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </>
        ) : (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={() => setStep('form')}
            loading={loading}
          />
        )}
      </div>

      {/* Legal Modals */}
      <LegalModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        type="terms"
      />
      <LegalModal
        open={showPrivacyModal}
        onOpenChange={setShowPrivacyModal}
        type="privacy"
      />
    </div>
  );
};

export default Register;
