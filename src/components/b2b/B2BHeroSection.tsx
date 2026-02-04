import React from 'react';
import { Link } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const radarData = [
  { skill: 'Role', value: 75 },
  { skill: 'Context', value: 67 },
  { skill: 'Format', value: 100 },
  { skill: 'Tone', value: 75 },
  { skill: 'Clarity', value: 33 },
  { skill: 'Efficiency', value: 50 },
];

const B2BHeroSection: React.FC = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('demo-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <div className="flex-[55] text-center lg:text-left">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="px-4 py-1.5 text-sm text-turquoise bg-turquoise/10 border border-turquoise/30 rounded-full">
                สำหรับองค์กร
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              ยกระดับทักษะ AI
              <br />
              ของทีมคุณ
              <br />
              <span className="text-tennessee-orange">วัดผลได้จริง</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-rackley leading-relaxed mt-4 max-w-lg mx-auto lg:mx-0">
              แพลตฟอร์ม AI Prompting Training แบบ Gamification
              <br />
              ที่พนักงานอยากเรียน และ HR วัดผลได้
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-turquoise">92%</div>
                <div className="text-sm text-white">Completion Rate</div>
              </div>
              <div className="h-8 w-px bg-rackley/30" />
              <div className="text-center">
                <div className="text-xl font-bold text-turquoise">23%</div>
                <div className="text-sm text-white">Skill Improvement</div>
              </div>
              <div className="h-8 w-px bg-rackley/30" />
              <div className="text-center">
                <div className="text-xl font-bold text-turquoise">&lt; 15</div>
                <div className="text-sm text-white">นาที/วัน</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-tennessee-orange text-white font-semibold rounded-xl hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                ทดลองใช้ฟรี สำหรับ 5 คน
              </Link>
              <button
                onClick={scrollToDemo}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-turquoise text-turquoise font-semibold rounded-xl hover:bg-turquoise/10 transition-all duration-200"
              >
                ดูตัวอย่าง Dashboard
              </button>
            </div>
          </div>

          {/* Right Column - Dashboard Mockup (hidden on mobile) */}
          <div className="hidden lg:block flex-[45]">
            <div 
              className="bg-oxford-blue/90 border border-turquoise/15 rounded-2xl p-5 shadow-2xl transition-transform duration-500 hover:shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
              style={{ 
                transform: 'perspective(1000px) rotateY(-5deg)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg)'}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rackley/20">
                <span className="text-sm font-medium text-white">HR Dashboard</span>
                <div className="w-8 h-8 rounded-full bg-turquoise/20 flex items-center justify-center">
                  <span className="text-xs text-turquoise">HR</span>
                </div>
              </div>

              {/* Mini Stat Cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-turquoise/10 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-rackley">พนักงาน</div>
                  <div className="text-sm font-semibold text-white">👥 24 คน</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-rackley">Completion</div>
                  <div className="text-sm font-semibold text-white">✅ 62.5%</div>
                </div>
                <div className="bg-tennessee-orange/10 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-rackley">Avg Score</div>
                  <div className="text-sm font-semibold text-white">📊 75%</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-rackley">Growth</div>
                  <div className="text-sm font-semibold text-white">📈 +23%</div>
                </div>
              </div>

              {/* Mini Radar Chart */}
              <div className="bg-oxford-blue/50 rounded-lg p-3 mb-4">
                <div className="text-xs text-rackley mb-2">Team Skills Overview</div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <PolarGrid stroke="#6593A630" strokeDasharray="3 3" />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: '#6593A6', fontSize: 9 }}
                        tickLine={false}
                      />
                      <Radar
                        dataKey="value"
                        stroke="#05F2F2"
                        fill="#05F2F2"
                        fillOpacity={0.2}
                        strokeWidth={1.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Member Table */}
              <div className="space-y-1.5">
                <div className="text-xs text-rackley mb-2">Top Performers</div>
                {[
                  { name: 'สมชาย', level: 8, growth: '+23%' },
                  { name: 'สมหญิง', level: 6, growth: '+15%' },
                  { name: 'วิชัย', level: 4, growth: '...' },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 bg-rackley/5 rounded">
                    <span className="text-white">{member.name}</span>
                    <span className="text-rackley">Lv.{member.level}</span>
                    <span className={member.growth === '...' ? 'text-rackley' : 'text-green-400'}>
                      {member.growth} {member.growth !== '...' && '⬆️'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BHeroSection;
