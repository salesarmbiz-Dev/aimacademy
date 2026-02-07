import React from 'react';
import { Gamepad2, Wrench, BarChart3 } from 'lucide-react';

const TripleValueSection: React.FC = () => {
  const values = [
    {
      icon: Gamepad2,
      title: 'Completion rate 85%+ เพราะสนุกจนหยุดไม่ได้',
      description: 'เปลี่ยน training ที่น่าเบื่อเป็นเกมแข่งขัน — แข่งกันระหว่างทีม มี leaderboard มีคะแนน มี achievement ทุกอย่างที่ทำให้ไม่อยากหยุด',
      statNumber: '85%+',
      statLabel: 'Completion Rate',
    },
    {
      icon: Wrench,
      title: 'ทุกเกมจบ ได้ deliverables มูลค่า ฿50-500K',
      description: "ไม่ใช่แค่เรียนรู้ 'ความรู้' — ทุก game สร้าง SOPs, Workflow, Prompt Library ที่ใช้งานได้จริง เหมือนจ้าง consultant แต่ราคา training",
      statNumber: '฿50-500K',
      statLabel: 'มูลค่า Deliverables ต่อเกม',
    },
    {
      icon: BarChart3,
      title: 'Dashboard แสดง ROI ชัดเจน โชว์ board ได้',
      description: "ไม่ต้อง 'เชื่อ' ว่า training มีประโยชน์ — เห็น data จริง ใครใช้ AI บ่อย ใครเก่งขึ้น ROI เท่าไหร่ ครบจบในที่เดียว",
      statNumber: '6',
      statLabel: 'Dashboard Modules',
    },
  ];

  return (
    <section id="triple-value" className="bg-oxford-blue py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-tennessee text-sm font-semibold uppercase tracking-wide mb-2">
            ทำไมต้อง AIM Academy
          </p>
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            3 สิ่งที่ไม่มีใครทำครบ
          </h2>
        </div>

        {/* Value Blocks */}
        <div className="space-y-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-tennessee/10 flex items-center justify-center flex-shrink-0">
                <value.icon className="w-8 h-8 text-tennessee" />
              </div>

              {/* Content */}
              <div className="border-l-4 border-l-tennessee pl-8">
                <h3 className="text-foreground text-xl md:text-2xl font-bold mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                  {value.description}
                </p>
                <div className="inline-flex items-center gap-3 bg-tennessee/10 rounded-xl px-6 py-3">
                  <span className="text-tennessee text-2xl md:text-3xl font-bold">
                    {value.statNumber}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {value.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TripleValueSection;
