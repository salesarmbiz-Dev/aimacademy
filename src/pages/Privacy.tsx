import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PrivacyContent } from '@/components/register/PrivacyContent';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-[800px] mx-auto">
        {/* Back Button */}
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-rackley hover:text-turquoise transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>กลับ</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-rackley">AIM Academy - Privacy Policy</p>
        </div>

        {/* Content */}
        <div className="bg-oxford rounded-xl p-6 md:p-8">
          <PrivacyContent />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
