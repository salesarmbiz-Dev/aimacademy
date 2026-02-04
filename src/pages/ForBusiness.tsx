import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import B2BNav from '@/components/b2b/B2BNav';
import B2BHeroSection from '@/components/b2b/B2BHeroSection';
import B2BPainPointsSection from '@/components/b2b/B2BPainPointsSection';
import B2BSolutionSection from '@/components/b2b/B2BSolutionSection';
import B2BHowItWorksSection from '@/components/b2b/B2BHowItWorksSection';
import B2BCertificatesSection from '@/components/b2b/B2BCertificatesSection';
import B2BPricingSection from '@/components/b2b/B2BPricingSection';
import B2BFAQSection from '@/components/b2b/B2BFAQSection';
import B2BFinalCTASection from '@/components/b2b/B2BFinalCTASection';
import Footer from '@/components/landing/Footer';

const ForBusiness: React.FC = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = sectionsRef.current?.querySelectorAll('.animate-on-scroll');
    sections?.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>AIM Academy สำหรับองค์กร | AI Prompting Training ที่วัดผลได้</title>
        <meta 
          name="description" 
          content="แพลตฟอร์มอบรม AI Prompting แบบ Gamification สำหรับทีม พร้อม HR Dashboard วัดผลพัฒนาการได้จริง ทดลองฟรี" 
        />
      </Helmet>

      <div ref={sectionsRef} className="min-h-screen bg-oxford-blue">
        {/* Minimal Navigation */}
        <B2BNav />

        {/* Hero Section */}
        <B2BHeroSection />

        {/* Pain Points Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BPainPointsSection />
        </div>

        {/* Solution Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BSolutionSection />
        </div>

        {/* How It Works Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BHowItWorksSection />
        </div>

        {/* Certificates Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BCertificatesSection />
        </div>

        {/* Pricing Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BPricingSection />
        </div>

        {/* FAQ Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BFAQSection />
        </div>

        {/* Final CTA Section */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-600">
          <B2BFinalCTASection />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default ForBusiness;
