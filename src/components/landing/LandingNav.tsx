import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const LandingNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'หลักการ', id: 'triple-value' },
    { label: 'ดู Platform', id: 'platform-preview' },
    { label: 'วิธีใช้งาน', id: 'how-it-works' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-oxford-blue/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-tennessee" />
          <span className="text-xl font-bold text-white">AIM Academy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-white/70 hover:text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise rounded"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            to="/register"
            className="bg-tennessee text-white rounded-xl px-5 py-2 text-sm font-semibold hover:bg-tennessee/90 transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise"
          >
            ทดลองฟรี
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-turquoise rounded"
          aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-oxford-blue/98 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-white/70 hover:text-white py-2 text-base transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <Link
                to="/login"
                className="block text-white/70 hover:text-white py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/register"
                className="block bg-tennessee text-white rounded-xl px-5 py-3 text-base font-semibold text-center hover:bg-tennessee/90 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ทดลองฟรี
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
