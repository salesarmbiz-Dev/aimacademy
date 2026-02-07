import React, { useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import PainPointSection from '@/components/landing/PainPointSection';
import TripleValueSection from '@/components/landing/TripleValueSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import GameSystemSection from '@/components/landing/GameSystemSection';
import DeliverablesSection from '@/components/landing/DeliverablesSection';
import DashboardPreviewSection from '@/components/landing/DashboardPreviewSection';
import PricingSection from '@/components/landing/PricingSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

const Landing: React.FC = () => {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScrollToDemo = () => {
    scrollToSection('pricing');
  };

  const handleScrollToGames = () => {
    scrollToSection('game-system');
  };

  return (
    <>
      <Helmet>
        <title>AIM Academy — AI Training ที่สนุก ได้เครื่องมือจริง และวัดผลได้</title>
        <meta 
          name="description" 
          content="เปลี่ยน AI Training จากค่าใช้จ่ายเป็นการลงทุน — ทุกเกมสร้าง deliverables มูลค่า ฿50-500K กลับไปใช้งานจริง Completion rate 85%+" 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <LandingNav onScrollTo={scrollToSection} />
        <HeroSection 
          onScrollToDemo={handleScrollToDemo} 
          onScrollToGames={handleScrollToGames} 
        />
        <PainPointSection />
        <TripleValueSection />
        <SocialProofSection />
        <GameSystemSection />
        <DeliverablesSection />
        <DashboardPreviewSection />
        <PricingSection onContactClick={handleScrollToDemo} />
        <FinalCTA onDemoClick={handleScrollToDemo} />
        <Footer onScrollTo={scrollToSection} />
      </div>
    </>
  );
};

export default Landing;
