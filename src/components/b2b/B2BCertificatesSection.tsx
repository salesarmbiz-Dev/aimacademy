import React from 'react';
import { Search, Linkedin, Award } from 'lucide-react';

const features = [
  { icon: Search, text: 'QR Code ตรวจสอบได้' },
  { icon: Linkedin, text: 'แชร์บน LinkedIn ได้' },
  { icon: Award, text: 'ระบุทักษะที่ผ่านเกณฑ์' },
];

const B2BCertificatesSection: React.FC = () => {
  return (
    <section 
      className="py-12 md:py-20"
      style={{
        background: 'linear-gradient(180deg, rgba(242, 116, 5, 0.05) 0%, #012840 100%)'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-white text-center">
          ใบรับรองทักษะที่ตรวจสอบได้
        </h2>
        <p className="text-base text-rackley text-center max-w-[600px] mx-auto mt-3">
          พนักงานได้รับใบรับรองที่มี QR Code ตรวจสอบได้ แชร์บน LinkedIn ได้ ใช้ประกอบ Performance Review ได้
        </p>

        {/* Certificate Mockup */}
        <div className="mt-12 max-w-[600px] mx-auto">
          <div 
            className="relative aspect-[1.414/1] rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-transform duration-400 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #012840 0%, #0a1929 100%)',
            }}
          >
            {/* Gradient border using pseudo element effect */}
            <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-turquoise to-tennessee-orange -z-10" />
            <div 
              className="absolute inset-[2px] rounded-[14px]"
              style={{
                background: 'linear-gradient(135deg, #012840 0%, #0a1929 100%)',
              }}
            />

            {/* Certificate Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between text-center">
              {/* Top */}
              <div>
                <div className="text-xs text-turquoise tracking-[3px] font-medium">
                  AIM ACADEMY
                </div>
              </div>

              {/* Middle */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Certificate of Completion</h3>
                  <p className="text-xs text-rackley mt-1">ใบรับรองทักษะ AI Prompting</p>
                </div>

                {/* Divider */}
                <div className="w-3/5 h-0.5 mx-auto bg-gradient-to-r from-turquoise to-tennessee-orange" />

                {/* Name */}
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-white">สมชาย ตัวอย่าง</div>
                  <div className="text-sm text-tennessee-orange mt-1">Prompt Builder</div>
                </div>

                {/* Skill Badges */}
                <div className="flex justify-center gap-2 flex-wrap">
                  {['Structure ✓', 'Context ✓', 'Output ✓'].map((skill, i) => (
                    <span 
                      key={i}
                      className="text-[10px] bg-turquoise/10 text-turquoise px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="w-full flex items-end justify-between">
                <div className="text-left">
                  <div className="text-[11px] text-rackley">ออกเมื่อ 1 กุมภาพันธ์ 2026</div>
                </div>
                
                {/* QR Code Placeholder */}
                <div className="w-12 h-12 bg-white rounded p-1">
                  <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1px]">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`${[0, 4, 6, 8, 12, 16, 18, 20, 24].includes(i) ? 'bg-oxford-blue' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Points */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <feature.icon className="w-5 h-5 text-turquoise" />
              <span className="text-[15px] text-white">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BCertificatesSection;
