import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'ต้องมีความรู้ด้าน AI มาก่อนไหม?',
    answer: 'ไม่จำเป็นเลย AIM Academy ออกแบบมาสำหรับทุกระดับ ตั้งแต่ไม่เคยใช้ AI เลย จนถึงใช้อยู่แล้วแต่อยากเก่งขึ้น ระบบ Pre-test จะประเมินระดับเริ่มต้นให้อัตโนมัติ',
  },
  {
    question: 'ใช้เวลาเรียนนานเท่าไหร่?',
    answer: 'แนะนำ 10-15 นาทีต่อวัน เป็นเวลา 2-4 สัปดาห์ เนื่องจากเป็นเกม พนักงานสามารถเล่นตอนพักเบรคหรือหลังเลิกงานก็ได้ ไม่กระทบเวลาทำงาน',
  },
  {
    question: 'HR สามารถดูความก้าวหน้าของทีมได้อย่างไร?',
    answer: 'HR Dashboard แสดงข้อมูลทุกอย่าง ทั้ง Completion Rate, คะแนน Pre/Post test, ความถี่ในการเข้าใช้ และสามารถ Export เป็น PDF หรือ CSV ได้',
  },
  {
    question: 'ใบรับรองมีความน่าเชื่อถือแค่ไหน?',
    answer: 'ทุกใบรับรองมี QR Code ที่ตรวจสอบได้บนเว็บไซต์ แสดงทักษะที่ผ่านเกณฑ์ วันที่ออก และข้อมูลผู้ได้รับ สามารถแชร์บน LinkedIn ได้โดยตรง',
  },
  {
    question: 'ราคา Team Plan คิดอย่างไร?',
    answer: 'คิดตามจำนวนคนที่ใช้งานจริง เริ่มต้นที่ 199 บาท/คน/เดือน ขั้นต่ำ 10 คน สามารถเพิ่ม-ลดจำนวนได้ทุกเดือน ทดลองฟรี 14 วัน สำหรับ 5 คนแรก',
  },
];

const B2BFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0); // First one open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="bg-oxford-blue/50 py-12 md:py-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-white text-center mb-12">
          คำถามที่พบบ่อย
        </h2>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-rackley/20"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-rackley flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'max-h-[500px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[15px] text-rackley leading-relaxed pb-5">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BFAQSection;
