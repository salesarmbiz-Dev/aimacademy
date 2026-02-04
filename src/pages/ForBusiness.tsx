import React, { useEffect, useRef } from 'react';
import B2BHeroSection from '@/components/b2b/B2BHeroSection';
import B2BPainPointsSection from '@/components/b2b/B2BPainPointsSection';
import B2BSolutionSection from '@/components/b2b/B2BSolutionSection';
import B2BHowItWorksSection from '@/components/b2b/B2BHowItWorksSection';
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
    <div ref={sectionsRef} className="min-h-screen bg-oxford-blue">
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

      {/* Placeholder for future sections (Part B) */}
      {/* <B2BCertificatesSection /> */}
      {/* <B2BPricingSection /> */}
      {/* <B2BFAQSection /> */}
      {/* <B2BCTASection /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ForBusiness;
