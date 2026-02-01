import React from 'react';

export const TermsContent: React.FC = () => {
  return (
    <div className="text-gray-200/85 space-y-6">
      <p className="text-rackley text-sm">อัปเดตล่าสุด: 1 กุมภาพันธ์ 2568</p>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">1. การยอมรับข้อกำหนด</h2>
        <p>
          เมื่อคุณเข้าใช้งานหรือสมัครสมาชิก AIM Academy คุณตกลงที่จะปฏิบัติตามข้อกำหนดการใช้งานนี้ 
          หากคุณไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาอย่าใช้บริการของเรา
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">2. คำอธิบายบริการ</h2>
        <p className="mb-2">AIM Academy เป็นแพลตฟอร์มการเรียนรู้ AI Prompting แบบ Gamification ประกอบด้วย:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>เกม Spot the Difference - ฝึกทักษะการวิเคราะห์ Prompt</li>
          <li>เกม Prompt Lego - ฝึกทักษะการสร้าง Prompt</li>
          <li>ระบบ XP, Level และ Badges</li>
          <li>Leaderboard และ Community features</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">3. การลงทะเบียนและบัญชีผู้ใช้</h2>
        <ul className="space-y-2">
          <li>3.1 คุณต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบันในการลงทะเบียน</li>
          <li>3.2 คุณต้องรักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ</li>
          <li>3.3 คุณต้องมีอายุ 13 ปีขึ้นไปในการใช้บริการ</li>
          <li>3.4 บัญชีหนึ่งบัญชีสำหรับผู้ใช้หนึ่งคนเท่านั้น</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">4. การใช้งานที่ยอมรับได้</h2>
        <p className="mb-2">คุณตกลงที่จะ:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>ใช้บริการเพื่อวัตถุประสงค์ที่ถูกกฎหมายเท่านั้น</li>
          <li>ไม่พยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต</li>
          <li>ไม่แชร์บัญชีหรือรหัสผ่านกับผู้อื่น</li>
          <li>ไม่ใช้บอทหรือโปรแกรมอัตโนมัติเพื่อโกงระบบ</li>
          <li>ไม่โพสต์เนื้อหาที่ไม่เหมาะสม ลามก หรือผิดกฎหมาย</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">5. ทรัพย์สินทางปัญญา</h2>
        <ul className="space-y-2">
          <li>5.1 เนื้อหา เกม และระบบทั้งหมดใน AIM Academy เป็นทรัพย์สินของเรา</li>
          <li>5.2 คุณได้รับสิทธิ์ในการใช้งานส่วนบุคคลเท่านั้น ไม่สามารถนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต</li>
          <li>5.3 Insights และ Patterns ที่คุณค้นพบสามารถนำไปใช้ในงานของคุณได้</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">6. ข้อมูลและความเป็นส่วนตัว</h2>
        <p>
          การเก็บและใช้ข้อมูลส่วนบุคคลของคุณเป็นไปตามนโยบายความเป็นส่วนตัวของเรา 
          กรุณาอ่านนโยบายความเป็นส่วนตัวเพื่อทำความเข้าใจ
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">7. การยกเลิกบัญชี</h2>
        <ul className="space-y-2">
          <li>7.1 คุณสามารถยกเลิกบัญชีได้ตลอดเวลาผ่านหน้า Settings</li>
          <li>7.2 เราอาจระงับหรือยกเลิกบัญชีของคุณหากละเมิดข้อกำหนดนี้</li>
          <li>7.3 เมื่อยกเลิกบัญชี ข้อมูลของคุณจะถูกลบภายใน 30 วัน</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">8. การจำกัดความรับผิดชอบ</h2>
        <ul className="space-y-2">
          <li>8.1 บริการให้ "ตามสภาพ" โดยไม่มีการรับประกันใดๆ</li>
          <li>8.2 เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้บริการ</li>
          <li>8.3 เราไม่รับประกันว่าบริการจะไม่มีข้อผิดพลาดหรือหยุดชะงัก</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">9. การแก้ไขข้อกำหนด</h2>
        <p>
          เราอาจแก้ไขข้อกำหนดนี้เป็นครั้งคราว การใช้บริการต่อหลังการแก้ไขถือว่าคุณยอมรับข้อกำหนดใหม่
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">10. การติดต่อ</h2>
        <p>หากมีคำถามเกี่ยวกับข้อกำหนดนี้ ติดต่อเราได้ที่:</p>
        <ul className="mt-2 space-y-1">
          <li>Email: support@aimacademy.co</li>
          <li>Website: aimacademy.co</li>
        </ul>
      </section>
    </div>
  );
};
