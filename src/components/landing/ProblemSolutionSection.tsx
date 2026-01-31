import React from 'react';

const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="bg-root-beer py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Problem Column */}
          <div className="animate-fade-in">
            <span className="text-tennessee text-sm font-semibold uppercase tracking-wide">ปัญหา</span>
            <h2 className="text-foreground text-2xl md:text-3xl font-bold mt-2">
              Reverse Engineer = Black Box
            </h2>

            {/* Visual - Black Box */}
            <div className="relative w-48 h-48 mx-auto md:mx-0 mt-8 mb-6">
              <div className="w-full h-full bg-oxford-blue border border-rackley rounded-lg flex items-center justify-center">
                <span className="text-rackley text-4xl">?</span>
              </div>
              {/* Floating question marks */}
              <span className="absolute -top-2 -left-2 text-rackley text-2xl animate-float-slow">?</span>
              <span className="absolute top-4 -right-4 text-rackley text-lg animate-float-medium">?</span>
              <span className="absolute -bottom-2 left-8 text-rackley text-xl animate-float-fast">?</span>
              <span className="absolute bottom-8 -right-2 text-rackley text-sm animate-float-slow">?</span>
            </div>

            {/* Problem List */}
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3 text-rackley">
                <span>❌</span>
                <span>การเดา Prompt ทั้งก้อน ต้องคิดเองทั้งหมด</span>
              </div>
              <div className="flex items-start gap-3 text-rackley">
                <span>❌</span>
                <span>ไม่เห็นโครงสร้างภายใน</span>
              </div>
              <div className="flex items-start gap-3 text-rackley">
                <span>❌</span>
                <span>ไม่รู้ว่าส่วนไหนสำคัญแค่ไหน</span>
              </div>
            </div>
          </div>

          {/* Solution Column */}
          <div className="animate-fade-in">
            <span className="text-turquoise text-sm font-semibold uppercase tracking-wide">ทางออก</span>
            <h2 className="text-foreground text-2xl md:text-3xl font-bold mt-2">
              Prompt Lego = Modular Blocks
            </h2>

            {/* Visual - Lego Blocks */}
            <div className="flex flex-col items-center md:items-start mt-8 mb-6">
              <div className="relative">
                <div className="bg-tennessee text-foreground px-6 py-3 rounded-lg font-semibold shadow-lg relative">
                  <div className="flex gap-1.5 absolute -top-1.5 left-3">
                    <div className="w-2.5 h-2.5 bg-tennessee rounded-full border border-foreground/20"></div>
                    <div className="w-2.5 h-2.5 bg-tennessee rounded-full border border-foreground/20"></div>
                  </div>
                  Context Set
                </div>
                <div className="bg-turquoise text-oxford-blue px-6 py-3 rounded-lg font-semibold shadow-lg -mt-0.5 ml-3 relative">
                  <div className="flex gap-1.5 absolute -top-1.5 left-3">
                    <div className="w-2.5 h-2.5 bg-turquoise rounded-full border border-oxford-blue/20"></div>
                    <div className="w-2.5 h-2.5 bg-turquoise rounded-full border border-oxford-blue/20"></div>
                  </div>
                  Core Instruction
                </div>
                <div className="bg-turquoise/70 text-oxford-blue px-6 py-3 rounded-lg font-semibold shadow-lg -mt-0.5 ml-6 relative">
                  <div className="flex gap-1.5 absolute -top-1.5 left-3">
                    <div className="w-2.5 h-2.5 bg-turquoise/70 rounded-full border border-oxford-blue/20"></div>
                    <div className="w-2.5 h-2.5 bg-turquoise/70 rounded-full border border-oxford-blue/20"></div>
                  </div>
                  Parameter Tune
                </div>
              </div>
            </div>

            {/* Solution List */}
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3 text-turquoise">
                <span>✅</span>
                <span>เห็นแยกเป็นชิ้นๆ ทดลองสลับที่ได้</span>
              </div>
              <div className="flex items-start gap-3 text-turquoise">
                <span>✅</span>
                <span>เพิ่มหรือลด Block แล้วเห็นผลลัพธ์ทันที</span>
              </div>
              <div className="flex items-start gap-3 text-turquoise">
                <span>✅</span>
                <span>เปลี่ยนการเรียนรู้จาก 'ท่องจำ' เป็น 'ทำความเข้าใจ'</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="text-foreground text-lg md:text-xl font-medium text-center mt-12">
          ระบบ Modular ที่ทำให้คุณ 'เล่น' กับ Prompt ได้อย่างอิสระ
        </p>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
