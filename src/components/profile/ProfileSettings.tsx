import React, { useState } from 'react';
import { User, Palette, Settings, Bell, Shield, Key, LogOut, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import type { UserPreferences } from './types';

interface ProfileSettingsProps {
  onEditAvatar: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onEditAvatar }) => {
  const { signOut, user } = useAuth();
  const { profile, updateProfile } = useUser();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(profile?.name || '');
  const [bio, setBio] = useState('เรียนรู้และฝึกฝน Prompt Engineering ผ่านการเล่นเกม 🎮');
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    showHints: true,
    playSounds: false,
    showAnimations: true,
    darkMode: true,
    notifyDailyChallenge: true,
    notifyStreakWarning: true,
    notifyWeeklySummary: false,
    receiveUpdates: true
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name: displayName });
    toast({
      title: "บันทึกสำเร็จ",
      description: "อัปเดตข้อมูลส่วนตัวแล้ว"
    });
  };

  const handleTogglePreference = (key: keyof UserPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Avatar presets (simple emoji-based for now)
  const avatarPresets = ['🧑‍💻', '👨‍🔬', '👩‍🎨', '🧙‍♂️', '🦸‍♀️', '🤖', '🎮', '🚀', '🎯', '💡', '🔥', '⚡'];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Settings */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            ข้อมูลส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 bg-background border-muted-foreground/50 text-white"
              placeholder="ชื่อที่แสดง"
            />
          </div>
          
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <Input
              value={user?.email || ''}
              disabled
              className="mt-1 bg-background/50 border-muted-foreground/30 text-muted-foreground"
            />
            <p className="text-muted-foreground text-xs mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 bg-background border-muted-foreground/50 text-white resize-none"
              placeholder="เล่าเกี่ยวกับตัวคุณ..."
              rows={3}
              maxLength={200}
            />
            <p className="text-muted-foreground text-xs mt-1 text-right">{bio.length}/200</p>
          </div>
          
          <Button onClick={handleSaveProfile} className="bg-accent text-secondary hover:bg-accent/90">
            <Save className="w-4 h-4 mr-2" />
            บันทึกการเปลี่ยนแปลง
          </Button>
        </CardContent>
      </Card>

      {/* Avatar Selection */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="w-5 h-5" />
            เลือก Avatar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {avatarPresets.map((emoji, i) => (
              <button
                key={i}
                onClick={onEditAvatar}
                className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-2xl hover:ring-2 ring-accent transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="mt-4 border-muted-foreground/50 text-muted-foreground"
            disabled
          >
            Upload custom (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5" />
            การตั้งค่า
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'showHints' as const, label: 'แสดง Hints ใน Challenge' },
            { key: 'playSounds' as const, label: 'เล่นเสียงเมื่อได้ XP' },
            { key: 'showAnimations' as const, label: 'แสดง Animation' },
            { key: 'darkMode' as const, label: 'โหมด Dark Mode', disabled: true }
          ].map(({ key, label, disabled }) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="text-white">{label}</Label>
              <Switch
                checked={preferences[key]}
                onCheckedChange={() => handleTogglePreference(key)}
                disabled={disabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            การแจ้งเตือน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'notifyDailyChallenge' as const, label: 'แจ้งเตือน Daily Challenge' },
            { key: 'notifyStreakWarning' as const, label: 'แจ้งเตือนเมื่อ Streak ใกล้หมด' },
            { key: 'notifyWeeklySummary' as const, label: 'แจ้งเตือน Weekly Summary' },
            { key: 'receiveUpdates' as const, label: 'รับข่าวสารและอัปเดต' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                id={key}
                checked={preferences[key]}
                onCheckedChange={() => handleTogglePreference(key)}
              />
              <Label htmlFor={key} className="text-white cursor-pointer">{label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5" />
            ข้อมูลและความเป็นส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-muted-foreground/50 text-muted-foreground">
            ดาวน์โหลดข้อมูลของฉัน
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => setShowResetConfirm(true)}
          >
            รีเซ็ต Progress ทั้งหมด
          </Button>
          <Button 
            variant="outline"
            className="w-full justify-start bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30"
            onClick={() => setShowDeleteConfirm(true)}
          >
            ลบบัญชี
          </Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="bg-secondary border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5" />
            บัญชี
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-muted-foreground/50 text-muted-foreground">
            เปลี่ยนรหัสผ่าน
          </Button>
          <Button 
            variant="outline"
            className="w-full justify-start border-primary/50 text-primary hover:bg-primary/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="bg-secondary border-muted-foreground/30">
          <DialogHeader>
            <DialogTitle>รีเซ็ต Progress ทั้งหมด?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              การกระทำนี้จะลบ XP, badges, และประวัติการทดลองทั้งหมด ไม่สามารถกู้คืนได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={() => setShowResetConfirm(false)}>
              รีเซ็ต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-secondary border-muted-foreground/30">
          <DialogHeader>
            <DialogTitle>ลบบัญชี?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              การกระทำนี้จะลบบัญชีและข้อมูลทั้งหมดอย่างถาวร ไม่สามารถกู้คืนได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(false)}>
              ลบบัญชี
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
