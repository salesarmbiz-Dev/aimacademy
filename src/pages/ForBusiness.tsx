import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, TrendingUp, Database, Link, Users } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import Footer from '@/components/landing/Footer';

const ForBusiness: React.FC = () => {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToDemo = () => scrollToSection('cta');

  return (
    <>
      <Helmet>
        <title>AIM Academy สำหรับองค์กร — Consulting Outcomes ในราคา Training</title>
        <meta 
          name="description" 
          content="เติมช่องว่างระหว่าง McKinsey กับ Online Course — Gamified training + Deliverables มูลค่า ฿50-500K + HR Dashboard สำหรับองค์กรไทย budget ฿300K-3M" 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <LandingNav />

        {/* Hero Section */}
        <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-4">
              สำหรับองค์กร
            </p>
            <h1 className="text-foreground text-4xl md:text-5xl font-bold mb-6">
              Consulting Outcomes ในราคา Training
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              AIM Academy เติมช่องว่างระหว่าง McKinsey กับ Online Course — สำหรับองค์กรไทยที่มี budget ฿300K-3M
            </p>
            <button 
              onClick={scrollToDemo}
              className="btn-primary text-lg px-10 py-4"
            >
              นัดสาธิตฟรี
            </button>
          </div>
        </section>

        {/* McKinsey Gap Visualization */}
        <section id="gap" className="bg-oxford-blue py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* Left - McKinsey */}
              <div className="bg-card/30 rounded-2xl p-6 text-center border border-border/20 opacity-60 flex-1 w-full">
                <p className="text-muted-foreground text-sm">McKinsey / Big 4</p>
                <p className="text-foreground text-2xl font-bold mt-2">฿15-50M+</p>
                <p className="text-muted-foreground text-xs mt-1">ราคาสูงเกินไป</p>
              </div>

              {/* Center - AIM Academy */}
              <div className="bg-card rounded-2xl p-8 text-center border-2 border-tennessee flex-1 relative w-full">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tennessee text-white px-4 py-1 rounded-full text-sm font-semibold">
                  AIM Academy
                </span>
                <p className="text-tennessee text-3xl font-bold mt-4">฿150K-1.5M</p>
                <p className="text-foreground text-sm mt-2 font-medium">
                  Consulting outcomes<br/>at training prices
                </p>
              </div>

              {/* Right - Online Course */}
              <div className="bg-card/30 rounded-2xl p-6 text-center border border-border/20 opacity-60 flex-1 w-full">
                <p className="text-muted-foreground text-sm">Online Course / DIY</p>
                <p className="text-foreground text-2xl font-bold mt-2">฿5-50K</p>
                <p className="text-muted-foreground text-xs mt-1">ไม่ได้ deliverables</p>
              </div>
            </div>

            <p className="text-center text-muted-foreground text-lg mt-8">
              12,300+ บริษัทไทยที่มี revenue ฿300M-5B — <span className="text-tennessee font-semibold">ไม่มีใครให้บริการ AI training อย่างเป็นระบบ</span>
            </p>
          </div>
        </section>

        {/* Segment Cards */}
        <section id="segments" className="bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
                ออกแบบมาสำหรับ
              </p>
              <h2 className="text-foreground text-3xl md:text-4xl font-bold">
                องค์กรเหล่านี้
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Family Business */}
              <div className="bg-card rounded-2xl p-8 border border-border/30">
                <Building2 size={32} className="text-tennessee mb-4" />
                <h3 className="text-foreground text-xl font-bold mb-2">
                  Family Business กำลัง Professionalize
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  ~5,000 บริษัทในไทย | Budget ฿300K-2M
                </p>
                <p className="text-muted-foreground">
                  Gen 2-3 ต้องการ modernize — เปลี่ยนจาก 'รู้กันเอง' เป็น system
                </p>
                <p className="text-sm mt-4">
                  <span className="text-tennessee font-semibold">Best Games:</span> SOP Machine, Decision Playbook
                </p>
                <button 
                  onClick={() => scrollToSection('cta')}
                  className="btn-secondary w-full mt-4 text-sm"
                >
                  ดูแพ็กเกจ Starter →
                </button>
              </div>

              {/* Regional Champions */}
              <div className="bg-card rounded-2xl p-8 border border-border/30 border-l-4 border-l-tennessee">
                <MapPin size={32} className="text-tennessee mb-4" />
                <h3 className="text-foreground text-xl font-bold mb-2">
                  Regional Champions
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  ~2,000 บริษัท | Budget ฿500K-3M
                </p>
                <p className="text-muted-foreground">
                  เบอร์ 1 ในภูมิภาค แต่แข่งกับ national players — ต้องใช้ AI สร้าง efficiency
                </p>
                <p className="text-sm mt-4">
                  <span className="text-tennessee font-semibold">Best Games:</span> Workflow Forge, Content Factory
                </p>
                <button 
                  onClick={() => scrollToSection('cta')}
                  className="btn-primary w-full mt-4 text-sm"
                >
                  ดูแพ็กเกจ Professional →
                </button>
              </div>

              {/* PE/VC Portfolio */}
              <div className="bg-card rounded-2xl p-8 border border-border/30">
                <TrendingUp size={32} className="text-tennessee mb-4" />
                <h3 className="text-foreground text-xl font-bold mb-2">
                  PE/VC Portfolio Companies
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  ~500 บริษัท | Budget ฿500K-2M
                </p>
                <p className="text-muted-foreground">
                  PE/VC กดดันให้ professionalize fast — ต้องการ efficiency ที่วัดได้
                </p>
                <p className="text-sm mt-4">
                  <span className="text-tennessee font-semibold">Best Games:</span> Workflow Forge, Analytics Dashboard
                </p>
                <button 
                  onClick={() => scrollToSection('cta')}
                  className="btn-secondary w-full mt-4 text-sm"
                >
                  ดูแพ็กเกจ Enterprise →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Proof */}
        <section id="roi" className="bg-oxford-blue py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-foreground text-3xl md:text-4xl font-bold text-center mb-12">
              ROI ที่ HR โชว์ board ได้
            </h2>

            {/* Quote Box */}
            <div className="max-w-3xl mx-auto bg-card/30 border-l-4 border-l-tennessee rounded-r-2xl p-8 mb-12">
              <p className="text-foreground text-xl md:text-2xl leading-relaxed italic">
                "จาก training investment ฿500K เราได้ AI assets มูลค่า ฿1.2M กลับมา พนักงาน 85% ใช้งานต่อเนื่อง productivity เพิ่ม 30% และ compliance rate 98%"
              </p>
              <p className="text-muted-foreground text-sm mt-4">
                — ตัวอย่าง ROI Report จาก AIM Academy Dashboard
              </p>
            </div>

            {/* ROI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: '฿1.2M', label: 'Asset Value Created' },
                { number: '+30%', label: 'Productivity Increase' },
                { number: '85%', label: 'Active Adoption Rate' },
                { number: '98%', label: 'Compliance Status' },
              ].map((metric, index) => (
                <div key={index} className="bg-card rounded-xl p-6 text-center border border-border/30">
                  <p className="text-tennessee text-2xl font-bold">{metric.number}</p>
                  <p className="text-muted-foreground text-sm mt-1">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Switching Cost */}
        <section id="switching" className="bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-foreground text-3xl md:text-4xl font-bold text-center mb-12">
              ยิ่งใช้นาน ยิ่งมีค่ามากขึ้น
            </h2>

            {/* Timeline */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-16">
              {/* Month 1 */}
              <div className="bg-card rounded-2xl p-6 text-center border border-border/30 w-full md:w-64">
                <p className="text-muted-foreground text-sm">Month 1</p>
                <p className="text-tennessee text-xl font-bold mt-2">50 assets</p>
                <p className="text-foreground text-sm mt-1">→ Useful</p>
              </div>

              {/* Connector */}
              <div className="hidden md:block w-12 h-0.5 bg-border/50" />

              {/* Month 6 */}
              <div className="bg-card rounded-2xl p-6 text-center border border-tennessee/30 w-full md:w-64">
                <p className="text-muted-foreground text-sm">Month 6</p>
                <p className="text-tennessee text-xl font-bold mt-2">200 assets + usage data</p>
                <p className="text-foreground text-sm mt-1">→ Valuable</p>
              </div>

              {/* Connector */}
              <div className="hidden md:block w-12 h-0.5 bg-border/50" />

              {/* Month 12 */}
              <div className="bg-card rounded-2xl p-6 text-center border-2 border-tennessee w-full md:w-64">
                <p className="text-muted-foreground text-sm">Month 12</p>
                <p className="text-tennessee text-xl font-bold mt-2">500 assets + patterns + benchmarks</p>
                <p className="text-foreground text-sm mt-1">→ Irreplaceable</p>
              </div>
            </div>

            {/* Switching Cost Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border/30 text-center">
                <Database size={32} className="text-tennessee mx-auto mb-4" />
                <h3 className="text-foreground font-bold mb-2">Data Accumulation</h3>
                <p className="text-muted-foreground text-sm">Assets + usage patterns สะสมมากขึ้น</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border/30 text-center">
                <Link size={32} className="text-tennessee mx-auto mb-4" />
                <h3 className="text-foreground font-bold mb-2">Asset Interconnection</h3>
                <p className="text-muted-foreground text-sm">Assets เชื่อมโยงกันเป็น ecosystem</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border/30 text-center">
                <Users size={32} className="text-tennessee mx-auto mb-4" />
                <h3 className="text-foreground font-bold mb-2">Cultural Embedding</h3>
                <p className="text-muted-foreground text-sm">AI workflows ฝังเข้าวิธีทำงาน</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="gradient-hero py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6">
              พร้อมเปลี่ยน AI Training<br />
              ให้เป็นการลงทุน?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              นัดสาธิตฟรี 30 นาที — ดูระบบจริง ถามทุกคำถาม ไม่มีข้อผูกมัด
            </p>
            <button className="btn-primary text-lg px-10 py-4">
              นัดสาธิตฟรี
            </button>
            <p className="text-muted-foreground text-sm mt-8">
              หรือส่งอีเมลมาที่{' '}
              <a 
                href="mailto:hello@aimacademy.co.th" 
                className="text-tennessee hover:underline"
              >
                hello@aimacademy.co.th
              </a>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForBusiness;
