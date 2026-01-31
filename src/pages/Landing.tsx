import React, { useRef } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ChallengeModes from '@/components/landing/ChallengeModes';
import GamificationPreview from '@/components/landing/GamificationPreview';
import PricingSection from '@/components/landing/PricingSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

const Landing: React.FC = () => {
  const howItWorksRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    if (id === 'how-it-works' && howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToHowItWorks = () => {
    scrollToSection('how-it-works');
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav onScrollTo={scrollToSection} />
      <HeroSection onScrollToHowItWorks={handleScrollToHowItWorks} />
      <ProblemSolutionSection />
      <HowItWorksSection sectionRef={howItWorksRef} />
      <FeaturesSection />
      <ChallengeModes />
      <GamificationPreview />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
