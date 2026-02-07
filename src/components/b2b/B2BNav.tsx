import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';

const B2BNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-oxford-blue/95 backdrop-blur-sm border-b border-border/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-tennessee" />
              <Sparkles className="w-3 h-3 text-tennessee absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
              AIM Academy
            </span>
          </Link>

          {/* Login Button */}
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-muted-foreground border border-border/30 rounded-lg hover:text-foreground hover:border-tennessee/40 transition-all duration-200"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </header>
  );
};

export default B2BNav;
