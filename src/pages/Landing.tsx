import React from 'react';
import { Helmet } from 'react-helmet-async';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import PainPointSection from '@/components/landing/PainPointSection';
import TripleValueSection from '@/components/landing/TripleValueSection';
import PlatformPreviewSection from '@/components/landing/PlatformPreviewSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import Footer from '@/components/landing/Footer';

const Landing: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AIM Academy — AI Training ที่จบแล้วได้มากกว่า Certificate</title>
        <meta
          name="description"
          content="Platform ที่ทำให้พนักงานเรียนรู้ AI จริง — สนุกจนทำจบ ได้เครื่องมือกลับไปใช้ และ HR เห็นผลลัพธ์ชัดเจนทุกมิติ"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <LandingNav />
        <main>
          <HeroSection />
          <PainPointSection />
          <TripleValueSection />
          <PlatformPreviewSection />
          <HowItWorksSection />
          <SocialProofSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Landing;
