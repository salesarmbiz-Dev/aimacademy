import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
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
  const [xpPulse, setXpPulse] = useState(false);
  const prevXp = useRef<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, stats } = useUser();

  // Detect XP changes and trigger pulse animation
  useEffect(() => {
    if (prevXp.current > 0 && stats.currentXp !== prevXp.current) {
      setXpPulse(true);
      setTimeout(() => setXpPulse(false), 1000);
    }
    prevXp.current = stats.currentXp;
  }, [stats.currentXp]);

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
      <header className="fixed top-0 left-0 right-0 h-16 bg-secondary z-50 border-b border-muted-foreground/30">
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="text-accent font-bold text-xl hover:opacity-90 transition-opacity duration-200 hover-scale"
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
                    'relative flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-white hover:text-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* XP Progress */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className={cn(
                  "w-4 h-4 text-accent transition-all duration-300",
                  xpPulse && "text-primary scale-125"
                )} />
                <span className="text-accent text-sm font-semibold">
                  Lv.{stats.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-24 h-2 bg-background rounded-full overflow-hidden transition-all duration-300",
                  xpPulse && "shadow-[0_0_10px_theme(colors.primary)]"
                )}>
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {stats.currentXp}/{stats.totalXpForNextLevel}
                </span>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-muted-foreground/30 text-white text-sm font-semibold hover:bg-muted-foreground/50 transition-all hover-scale"
              >
                {profile ? getInitials(profile.name) : 'U'}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-muted-foreground/30 rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-background transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>โปรไฟล์</span>
                      </Link>
                      <div className="border-t border-muted-foreground/30" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-3 text-white hover:bg-background transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-secondary z-50 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-muted-foreground/30">
                <span className="text-accent font-bold text-xl">Prompt Lego</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col py-4">
                {navItems.map(({ path, label, icon: Icon }, index) => {
                  const isActive = location.pathname === path;
                  return (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={path}
                        className={cn(
                          'flex items-center gap-3 px-6 py-4 transition-colors',
                          isActive
                            ? 'text-primary bg-background/50 border-l-4 border-primary'
                            : 'text-white hover:text-accent hover:bg-background/30'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted-foreground/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted-foreground/30 flex items-center justify-center text-white font-semibold">
                    {profile ? getInitials(profile.name) : 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{profile?.name || 'User'}</p>
                    <p className="text-muted-foreground text-sm">Level {stats.level}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-3 text-white bg-background rounded-lg hover:opacity-90 transition-opacity btn-press"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
