import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-root-beer border-t border-rackley/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-turquoise font-bold text-xl">Prompt Lego</span>
            <p className="text-rackley text-sm mt-2">AI Learning by Gamification</p>
            <p className="text-rackley text-xs mt-4">© 2025 Prompt Lego. All rights reserved.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-rackley hover:text-turquoise transition-colors text-sm">Features</a></li>
              <li><a href="#pricing" className="text-rackley hover:text-turquoise transition-colors text-sm">Pricing</a></li>
              <li><Link to="/challenges" className="text-rackley hover:text-turquoise transition-colors text-sm">Challenges</Link></li>
              <li><Link to="/library" className="text-rackley hover:text-turquoise transition-colors text-sm">Block Library</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-rackley hover:text-turquoise transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="border-t border-rackley/20 mt-8 pt-6">
          <div className="flex justify-center gap-4">
            <a href="#" className="text-rackley hover:text-turquoise transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-rackley hover:text-turquoise transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-rackley hover:text-turquoise transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-rackley hover:text-turquoise transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
