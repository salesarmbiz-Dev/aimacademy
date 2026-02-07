import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="bg-root-beer border-t border-border/20 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <p className="text-foreground font-bold text-lg">AIM Academy</p>
            <p className="text-muted-foreground text-sm mt-2">
              Learn by Playing × Build by Learning × Prove by Using
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-foreground font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onScrollTo('game-system')}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  เกมทั้งหมด
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollTo('dashboard')}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  HR Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollTo('deliverables')}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  AI Asset Library
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollTo('pricing')}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  ราคา
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  เกี่ยวกับเรา
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  ติดต่อ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  ร่วมงานกับเรา
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 AIM Academy — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
