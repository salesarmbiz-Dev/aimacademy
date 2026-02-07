import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

interface LandingNavProps {
  onScrollTo: (id: string) => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'วิธีการทำงาน', id: 'game-system' },
    { label: 'ผลลัพธ์ที่ได้', id: 'deliverables' },
    { label: 'HR Dashboard', id: 'dashboard' },
    { label: 'ราคา', id: 'pricing' },
  ];

  const handleNavClick = (id: string) => {
    onScrollTo(id);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-oxford-blue/95 backdrop-blur-sm border-border/20' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-foreground">
            AIM Academy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="btn-ghost text-sm"
            >
              เข้าสู่ระบบ
            </Link>
            <button
              onClick={() => handleNavClick('pricing')}
              className="btn-primary text-sm px-4 py-2"
            >
              นัดสาธิต
            </button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden text-foreground p-2 min-h-touch min-w-touch flex items-center justify-center">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-oxford-blue border-border/30 w-[280px]">
              <div className="flex flex-col gap-6 pt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-base text-left py-2"
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
                <div className="border-t border-border/30 pt-6 space-y-4">
                  <SheetClose asChild>
                    <Link 
                      to="/login" 
                      className="block text-muted-foreground hover:text-foreground transition-colors text-base py-2"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      onClick={() => handleNavClick('pricing')}
                      className="btn-primary w-full text-base"
                    >
                      นัดสาธิต
                    </button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
