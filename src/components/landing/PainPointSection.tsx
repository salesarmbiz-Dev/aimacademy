import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PainPointSection: React.FC = () => {
  const headerRef = useScrollReveal();
  const card1Ref = useScrollReveal();
  const card2Ref = useScrollReveal();
  const card3Ref = useScrollReveal();
  const bridgeRef = useScrollReveal();

  const painPoints = [
    {
      emoji: '😴',
      title: 'เรียนจบ แต่ใช้ไม่เป็น',
      description:
        'พนักงานนั่งดู video 2 ชม. ได้ certificate แต่พอต้องใช้ AI จริง กลับเขียน prompt ไม่ออก — เพราะเรียนแบบ passive ไม่ได้ลงมือทำ',
    },
    {
      emoji: '📄',
      title: 'จบ training แล้วได้อะไรกลับไป?',
      description:
        "ได้แค่ 'ความรู้' กับ slide deck — ไม่มี SOP ไม่มี prompt library ไม่มีอะไรจับต้องได้ที่เอาไปใช้งานจริงในวันจันทร์",
    },
    {
      emoji: '🤷',
      title: 'HR ตอบ board ไม่ได้ว่าคุ้มไหม',
      description:
        'จ่ายไปแล้ว ฿300K-3M แต่วัดไม่ได้ว่าพนักงานเก่งขึ้นจริงหรือเปล่า — justify budget ครั้งถัดไปยิ่งยาก',
    },
  ];

  const cardRefs = [card1Ref, card2Ref, card3Ref];

  return (
    <section id="pain-points" className="bg-background py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 scroll-reveal">
          <h2 className="text-foreground text-2xl md:text-4xl font-bold mb-4">
            AI Training แบบเดิม
            <br />
            <span className="text-tennessee">มีปัญหาอะไร?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            องค์กรไทยกำลังเจอ 3 ปัญหาเดียวกัน
          </p>
        </div>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <div
              key={index}
              ref={cardRefs[index]}
              className={`bg-card rounded-2xl p-8 border border-border/30 text-center scroll-reveal scroll-reveal-delay-${index + 1}`}
            >
              <div className="text-5xl mb-4">{point.emoji}</div>
              <h3 className="text-foreground text-xl font-bold mb-4">
                {point.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bridge */}
        <div ref={bridgeRef} className="text-center scroll-reveal">
          <p className="text-muted-foreground text-lg">
            AIM Academy ออกแบบมาเพื่อแก้ทั้ง 3 ปัญหานี้{' '}
            <span className="text-tennessee font-semibold">พร้อมกัน</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPointSection;
