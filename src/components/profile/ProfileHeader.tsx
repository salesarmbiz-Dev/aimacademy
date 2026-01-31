import React from 'react';
import { Camera, Pencil, CheckCircle, Calendar, Star, Flame, Trophy, FlaskConical } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { getRankTitle } from './types';

interface ProfileHeaderProps {
  onEditAvatar: () => void;
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditAvatar, onEditProfile }) => {
  const { profile, stats, badges } = useUser();
  
  const { title, emoji } = getRankTitle(stats.level);
  const xpPercentage = Math.round((stats.currentXp / stats.totalXpForNextLevel) * 100);
  const remainingXp = stats.totalXpForNextLevel - stats.currentXp;
  
  // Mock data for demo
  const joinDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })
    : 'มกราคม 2025';
  
  const streak = 12;
  const experimentsCount = stats.experimentsCount || 23;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-secondary to-accent/10 p-8 mb-6">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-accent" />
        <div className="absolute bottom-10 left-20 w-24 h-24 rounded-full border border-accent" />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Avatar Section */}
        <div className="relative">
          <div className="relative w-36 h-36 rounded-full border-4 border-accent bg-secondary overflow-hidden shadow-[0_0_30px_rgba(5,242,242,0.3)]">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent text-4xl font-bold">
                {getInitials(profile?.name || 'User')}
              </div>
            )}
          </div>
          
          {/* Edit avatar button */}
          <button
            onClick={onEditAvatar}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary border-3 border-secondary flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
          
          {/* Level badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full border-3 border-secondary flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-sm font-bold">Level {stats.level}</span>
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <h1 className="text-3xl font-bold text-white">{profile?.name || 'Demo User'}</h1>
            <button onClick={onEditProfile} className="text-muted-foreground hover:text-accent transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          
          <div className="mt-2 flex items-center justify-center lg:justify-start gap-2 text-accent">
            <span className="text-lg">{emoji}</span>
            <span className="text-lg font-medium">{title}</span>
          </div>
          
          <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-muted-foreground text-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>เข้าร่วมเมื่อ: {joinDate}</span>
          </div>
          
          {profile?.name && (
            <p className="mt-3 text-muted-foreground text-sm max-w-md">
              เรียนรู้และฝึกฝน Prompt Engineering ผ่านการเล่นเกม 🎮
            </p>
          )}
        </div>

        {/* XP Progress Section */}
        <div className="bg-background/50 rounded-2xl p-6 min-w-[280px]">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Experience Points</p>
          
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-primary text-4xl font-bold">{stats.currentXp}</span>
            <span className="text-muted-foreground text-lg">/ {stats.totalXpForNextLevel} XP</span>
          </div>
          
          <div className="mt-4 relative">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white">{xpPercentage}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-white">Level {stats.level} → Level {stats.level + 1}</span>
            <span className="text-muted-foreground">เหลืออีก {remainingXp} XP</span>
          </div>
          
          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t border-muted-foreground/20 flex gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-white text-sm">{streak} day</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-white text-sm">{badges.length} badges</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-accent" />
              <span className="text-white text-sm">{experimentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
