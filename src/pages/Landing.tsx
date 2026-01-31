import React from 'react';
import { Link } from 'react-router-dom';
import { Blocks, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Blocks className="h-8 w-8 text-turquoise" />
          <span className="text-turquoise font-bold text-2xl">Prompt Lego</span>
        </div>
        <Link
          to="/login"
          className="px-6 py-2 bg-tennessee text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          เข้าสู่ระบบ
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          <div className="inline-block px-4 py-2 bg-tennessee/20 text-tennessee text-sm font-semibold rounded-full mb-6">
            Coming Soon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            เรียนรู้ AI{' '}
            <span className="text-turquoise">แบบ Interactive</span>
          </h1>
          
          <p className="text-rackley text-lg md:text-xl mb-10 max-w-xl mx-auto">
            สร้าง Prompt อย่างมืออาชีพด้วยระบบ Gamification 
            ที่จะทำให้การเรียนรู้ AI เป็นเรื่องสนุกและง่าย
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 bg-tennessee text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              เริ่มต้นใช้งาน
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-turquoise text-turquoise font-semibold rounded-md hover:bg-turquoise/10 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </main>

      <footer className="container py-6 text-center text-rackley text-sm">
        © 2024 Prompt Lego. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
