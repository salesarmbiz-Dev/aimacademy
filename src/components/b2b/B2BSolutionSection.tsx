import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts';

const preTestData = [
  { skill: 'Role', pre: 55, post: 80 },
  { skill: 'Context', pre: 60, post: 85 },
  { skill: 'Format', pre: 50, post: 78 },
  { skill: 'Tone', pre: 45, post: 75 },
  { skill: 'Clarity', pre: 30, post: 72 },
  { skill: 'Efficiency', pre: 40, post: 70 },
];

const engagementData = [
  { day: 'Mon', value: 18 },
  { day: 'Tue', value: 22 },
  { day: 'Wed', value: 20 },
  { day: 'Thu', value: 24 },
  { day: 'Fri', value: 19 },
  { day: 'Sat', value: 8 },
  { day: 'Sun', value: 5 },
];

const B2BSolutionSection: React.FC = () => {
  return (
    <section 
      className="py-12 md:py-20"
      style={{
        background: 'linear-gradient(180deg, #012840 0%, rgba(5, 242, 242, 0.03) 50%, #012840 100%)'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-white text-center mb-16">
          ทำไม AIM Academy ถึงต่างจากการอบรมทั่วไป
        </h2>

        {/* Block 1: Game-based Learning (Text Left, Visual Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pb-16 border-b border-rackley/10">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-white">
              เรียนรู้ผ่านเกม ไม่ใช่วิดีโอ
            </h3>
            <p className="text-base text-rackley leading-relaxed mt-3">
              พนักงานฝึก AI Prompting ผ่านเกมที่ออกแบบมาให้สนุก เช่น Spot the Difference 
              ที่เปรียบเทียบ Prompt ดีกับไม่ดี หรือ Prompt Lego ที่ประกอบ Prompt จากชิ้นส่วน 
              ทำให้อยากกลับมาเล่นซ้ำ
            </p>
            <div className="mt-5 bg-turquoise/[0.08] border-l-[3px] border-turquoise rounded-xl px-5 py-3 inline-block">
              <span className="text-white text-[15px]">
                <span className="font-bold text-turquoise">92%</span> Completion Rate 
                vs 5-15% ของคอร์สวิดีโอทั่วไป
              </span>
            </div>
          </div>

          {/* Visual: Spot the Difference Mockup */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="bg-oxford-blue/80 border border-turquoise/15 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-rackley mb-3">Spot the Difference</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-3">
                  <div className="text-red-400 text-xs mb-1">❌ Bad Prompt</div>
                  <p className="text-[11px] text-white leading-relaxed">
                    ช่วยเขียนอีเมล
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 text-xs mb-1">✅ Good Prompt</div>
                  <p className="text-[11px] text-white leading-relaxed">
                    คุณเป็นผู้เชี่ยวชาญด้านการสื่อสาร เขียนอีเมลถึง...
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <span className="bg-tennessee-orange/20 text-tennessee-orange text-xs px-3 py-1 rounded-full font-medium">
                  +10 XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Measurable Results (Visual Left, Text Right) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12 py-16 border-b border-rackley/10">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-white">
              วัดผลพัฒนาการได้จริง
            </h3>
            <p className="text-base text-rackley leading-relaxed mt-3">
              ระบบ Pre-test / Post-test ครอบคลุม 6 ทักษะ AI Prompting ให้ HR เห็นข้อมูลชัดเจน
              ว่าพนักงานเก่งขึ้นกี่ % ทักษะไหนต้องพัฒนาเพิ่ม ไม่ต้องเดาอีกต่อไป
            </p>
            <div className="mt-5 bg-turquoise/[0.08] border-l-[3px] border-turquoise rounded-xl px-5 py-3 inline-block">
              <span className="text-white text-[15px]">
                เฉลี่ย <span className="font-bold text-turquoise">+23%</span> Skill Improvement 
                หลังเรียน 2 สัปดาห์
              </span>
            </div>
          </div>

          {/* Visual: Pre/Post Test Radar */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="bg-oxford-blue/80 border border-turquoise/15 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-rackley mb-3">Skill Assessment</div>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={preTestData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="#6593A630" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fill: '#6593A6', fontSize: 10 }}
                      tickLine={false}
                    />
                    <Radar
                      dataKey="pre"
                      stroke="#6593A6"
                      fill="#6593A6"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                    <Radar
                      dataKey="post"
                      stroke="#05F2F2"
                      fill="#05F2F2"
                      fillOpacity={0.2}
                      strokeWidth={1.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rackley" />
                  <span className="text-rackley">Pre-test</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-turquoise" />
                  <span className="text-turquoise">Post-test</span>
                </div>
              </div>
              <div className="text-center mt-3 text-turquoise text-[13px] font-medium">
                +23% Average Improvement
              </div>
            </div>
          </div>
        </div>

        {/* Block 3: HR Dashboard (Text Left, Visual Right) */}
        <div id="demo-section" className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-16">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-white">
              HR Dashboard ดูทุกอย่างได้ในที่เดียว
            </h3>
            <p className="text-base text-rackley leading-relaxed mt-3">
              Dashboard สำหรับ HR แสดง Completion Rate, ความถี่ในการเข้าใช้, 
              คะแนนเปรียบเทียบ Pre/Post ของทุกคนในทีม Export เป็น PDF/CSV 
              ส่งให้ผู้บริหารได้ทันที
            </p>
            <div className="mt-5 bg-turquoise/[0.08] border-l-[3px] border-turquoise rounded-xl px-5 py-3 inline-block">
              <span className="text-white text-[15px]">
                ใช้เวลา <span className="font-bold text-turquoise">&lt; 5 นาที</span> ดูความก้าวหน้าทั้งทีม
              </span>
            </div>
          </div>

          {/* Visual: HR Dashboard Mockup */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="bg-oxford-blue/80 border border-turquoise/15 rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-rackley mb-3">Team Engagement</div>
              
              {/* Mini Line Chart */}
              <div className="h-[100px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#6593A6', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 25]} 
                      tick={{ fill: '#6593A6', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#05F2F2"
                      fill="#05F2F2"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Member Table */}
              <div className="text-xs text-rackley mb-2">Member Progress</div>
              <div className="space-y-1.5">
                {[
                  { name: 'สมชาย', pre: '65%', post: '88%', growth: '+23%', status: 'up' },
                  { name: 'สมหญิง', pre: '70%', post: '85%', growth: '+15%', status: 'up' },
                  { name: 'วิชัย', pre: '55%', post: '—', growth: '⚠️', status: 'pending' },
                ].map((member, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 text-[11px] py-1.5 px-2 bg-rackley/5 rounded">
                    <span className="text-white">{member.name}</span>
                    <span className="text-rackley">Pre {member.pre}</span>
                    <span className="text-rackley">Post {member.post}</span>
                    <span className={member.status === 'up' ? 'text-green-400' : 'text-yellow-400'}>
                      {member.growth} {member.status === 'up' && '⬆️'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2 mt-4 justify-end">
                <button className="text-[10px] text-rackley border border-rackley/30 rounded px-2 py-1 hover:bg-rackley/10 transition-colors">
                  CSV
                </button>
                <button className="text-[10px] text-rackley border border-rackley/30 rounded px-2 py-1 hover:bg-rackley/10 transition-colors">
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BSolutionSection;
