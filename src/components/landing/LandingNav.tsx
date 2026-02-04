import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react';

interface LandingNavProps {
  onScrollTo: (id: string) => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-oxford-blue shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-turquoise" />
            <Sparkles className="w-4 h-4 text-tennessee" />
            <span className="text-turquoise font-bold text-xl">AIM Academy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick('features')}
              className="text-foreground hover:text-turquoise transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-foreground hover:text-turquoise transition-colors text-sm"
            >
              How it Works
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-foreground hover:text-turquoise transition-colors text-sm"
            >
              Pricing
            </button>
            <Link 
              to="/for-business" 
              className="text-foreground hover:text-turquoise transition-colors text-sm"
            >
              สำหรับองค์กร
            </Link>
            <Link to="/login" className="text-foreground hover:text-turquoise transition-colors text-sm">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-tennessee text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              เริ่มเลย
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-oxford-blue border-t border-rackley/30 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => handleNavClick('features')}
              className="block w-full text-left text-foreground hover:text-turquoise transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left text-foreground hover:text-turquoise transition-colors py-2"
            >
              How it Works
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="block w-full text-left text-foreground hover:text-turquoise transition-colors py-2"
            >
              Pricing
            </button>
            <Link 
              to="/for-business" 
              className="block w-full text-left text-foreground hover:text-turquoise transition-colors py-2"
            >
              สำหรับองค์กร
            </Link>
            <Link to="/login" className="block text-foreground hover:text-turquoise transition-colors py-2">
              Login
            </Link>
            <Link
              to="/register"
              className="block bg-tennessee text-foreground font-semibold px-4 py-3 rounded-lg text-center hover:opacity-90 transition-opacity"
            >
              เริ่มเลย
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
