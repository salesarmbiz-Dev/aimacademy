import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ConsentCheckbox } from '@/components/register/ConsentCheckbox';
import { LegalModal } from '@/components/register/LegalModal';
import { supabase } from '@/integrations/supabase/client';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Consent states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    consent?: string;
    general?: string;
  }>({});

  const isConsentValid = termsAccepted && privacyAccepted;

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name) {
      newErrors.name = 'กรุณากรอกชื่อ';
    } else if (name.length < 2) {
      newErrors.name = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    
    if (!email) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }

    if (!isConsentValid) {
      newErrors.consent = 'กรุณายอมรับข้อกำหนดและนโยบายก่อนสมัคร';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    const { error, data } = await signUp(email, password, name);
    
    if (error) {
      setErrors({ general: error });
      setLoading(false);
    } else {
      // Save consent after successful signup
      if (data?.user?.id) {
        await saveConsent(data.user.id);
      }
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-oxford rounded-xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">สมัครสมาชิกสำเร็จ!</h2>
          <p className="text-rackley mb-6">
            กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัครสมาชิก
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-tennessee text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-oxford rounded-xl p-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-turquoise font-bold text-2xl mb-2">Prompt Lego</h1>
          <p className="text-rackley text-sm">สร้างบัญชีใหม่</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-tennessee text-sm">
              {errors.general}
            </div>
          )}

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
              className="w-full px-4 py-3 bg-rootbeer border border-rackley rounded-md text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-tennessee text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-rootbeer border border-rackley rounded-md text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-tennessee text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-rootbeer border border-rackley rounded-md text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rackley hover:text-turquoise transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-tennessee text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-rootbeer border border-rackley rounded-md text-white placeholder-rackley focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rackley hover:text-turquoise transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-tennessee text-sm">{errors.confirmPassword}</p>
            )}
          </div>

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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isConsentValid}
            className="w-full h-12 bg-tennessee text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'สมัครสมาชิก'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-rackley text-sm">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-turquoise hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
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
