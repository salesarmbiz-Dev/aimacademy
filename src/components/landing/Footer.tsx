import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, GraduationCap, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-root-beer border-t border-border/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-6 h-6 text-tennessee" />
              <Sparkles className="w-4 h-4 text-tennessee" />
              <span className="text-foreground font-bold text-xl">AIM Academy</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">AI Learning by Gamification</p>
            <p className="text-muted-foreground text-xs mt-4">© 2025 AIM Academy. All rights reserved.</p>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Games</h4>
            <ul className="space-y-2">
              <li><Link to="/spot" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Spot the Difference</Link></li>
              <li><Link to="/prompt-lego" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Prompt Lego</Link></li>
              <li><Link to="/challenges" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Challenges</Link></li>
              <li><Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/for-business" className="text-muted-foreground hover:text-foreground transition-colors text-sm">สำหรับองค์กร</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="border-t border-border/20 mt-8 pt-6">
          <div className="flex justify-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
