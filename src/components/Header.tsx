import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Blocks,
  Trophy,
  Library,
  Medal,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/prompt-lego', label: 'Prompt Lego', icon: Blocks },
  { path: '/challenges', label: 'Challenges', icon: Trophy },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/leaderboard', label: 'Leaderboard', icon: Medal },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, stats } = useUser();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const xpProgress = stats.totalXpForNextLevel > 0 
    ? (stats.currentXp / stats.totalXpForNextLevel) * 100 
    : 0;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-oxford z-50 border-b border-rackley/30">
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="text-turquoise font-bold text-xl hover:opacity-90 transition-opacity duration-200"
          >
            Prompt Lego
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
                    isActive
                      ? 'text-tennessee border-b-2 border-tennessee'
                      : 'text-white hover:text-turquoise'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* XP Progress */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-turquoise text-sm font-semibold">
                Level {stats.level}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-rootbeer rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-tennessee rounded-full transition-all duration-300"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-rackley text-xs">
                  {stats.currentXp}/{stats.totalXpForNextLevel}
                </span>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-rackley text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {profile ? getInitials(profile.name) : 'U'}
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-oxford border border-rackley rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-white hover:bg-rootbeer transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>โปรไฟล์</span>
                    </Link>
                    <div className="border-t border-rackley/30" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-3 text-white hover:bg-rootbeer transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-turquoise transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-oxford z-50 md:hidden animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-rackley/30">
              <span className="text-turquoise font-bold text-xl">Prompt Lego</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:text-turquoise transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col py-4">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 transition-colors',
                      isActive
                        ? 'text-tennessee bg-rootbeer/50'
                        : 'text-white hover:text-turquoise hover:bg-rootbeer/30'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rackley/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rackley flex items-center justify-center text-white font-semibold">
                  {profile ? getInitials(profile.name) : 'U'}
                </div>
                <div>
                  <p className="text-white font-medium">{profile?.name || 'User'}</p>
                  <p className="text-rackley text-sm">Level {stats.level}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-3 text-white bg-rootbeer rounded-md hover:opacity-90 transition-opacity"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
