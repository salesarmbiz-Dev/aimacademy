import React from 'react';

interface FinalCTAProps {
  onDemoClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onDemoClick }) => {
  return (
    <section className="gradient-hero py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6">
          พร้อมเปลี่ยน AI Training<br />
          ให้เป็นการลงทุนที่วัดผลได้?
        </h2>

        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          นัดสาธิตฟรี 30 นาที — ดูระบบจริง ถามทุกคำถาม ไม่มีข้อผูกมัด
        </p>

        <button
          onClick={onDemoClick}
          className="btn-primary text-lg px-10 py-4"
        >
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
  );
};

export default FinalCTA;
