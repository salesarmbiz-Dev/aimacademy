import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-root-beer">
      {/* Soft CTA Section */}
      <div className="pt-16 pb-12 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            อยากดูว่า platform จริงเป็นยังไง?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            ทดลองใช้ฟรี — เล่นเกมจริง ดู Dashboard จริง ไม่มีข้อผูกมัด
          </p>
          <Link
            to="/register"
            className="inline-block bg-tennessee text-white rounded-2xl px-10 py-4 text-lg font-bold hover:bg-tennessee/90 transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise focus:ring-offset-2 focus:ring-offset-root-beer"
          >
            เริ่มทดลองฟรี
          </Link>
          <p className="text-white/40 text-sm mt-6">
            หรือต้องการข้อมูลเพิ่ม →{' '}
            <a
              href="mailto:theera.stw@gmail.com"
              className="text-tennessee hover:underline"
            >
              theera.stw@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <p className="text-white font-bold text-lg">AIM Academy</p>
              <p className="text-white/40 text-sm mt-2">
                Learn by Playing × Build by Learning × Prove by Using
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/games"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    เกมทั้งหมด
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assets"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    Asset Library
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team/dashboard"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    HR Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-3">ติดต่อ</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:theera.stw@gmail.com"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    theera.stw@gmail.com
                  </a>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/40 text-sm">
              © 2026 AIM Academy — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
