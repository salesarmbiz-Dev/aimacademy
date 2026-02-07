import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import ProfileHistory from '@/components/profile/ProfileHistory';
import ProfileInsights from '@/components/profile/ProfileInsights';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileActivity from '@/components/profile/ProfileActivity';
import PostGameSurvey from '@/components/survey/PostGameSurvey';
import { MOCK_BADGES, MOCK_INSIGHTS } from '@/components/profile/types';

const Profile: React.FC = () => {
  const { profile, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState('stats');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const earnedBadgesCount = MOCK_BADGES.filter(b => b.earnedAt).length;
  const insightsCount = MOCK_INSIGHTS.length;

  const avatarOptions = [
    '🧑‍💻', '👨‍🔬', '👩‍🎨', '🧙‍♂️', '🦸‍♀️', '🤖', 
    '🎮', '🚀', '🎯', '💡', '🔥', '⚡',
    '🦊', '🐱', '🐶', '🦁', '🐼', '🐨'
  ];

  const handleSaveAvatar = () => {
    if (selectedAvatar) {
      // In real app, would save to backend
      setShowAvatarModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header with Feedback Button */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <ProfileHeader 
            onEditAvatar={() => setShowAvatarModal(true)}
            onEditProfile={() => setShowEditProfileModal(true)}
          />
          <Button
            variant="outline"
            onClick={() => setShowSurvey(true)}
            className="gap-2 mt-4 md:mt-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            📝 ให้ Feedback
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-secondary p-2 rounded-xl h-auto flex-wrap gap-2">
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              📊 Stats
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              ⚡ Activity
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              🏆 Achievements
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                {earnedBadgesCount}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              🧪 History
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              💡 Insights
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent">
                {insightsCount}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-accent data-[state=active]:text-secondary px-6 py-3 rounded-lg"
            >
              ⚙️ Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="stats" className="m-0">
              <ProfileStats />
            </TabsContent>
            <TabsContent value="activity" className="m-0">
              <ProfileActivity />
            </TabsContent>
            <TabsContent value="achievements" className="m-0">
              <ProfileAchievements />
            </TabsContent>
            <TabsContent value="history" className="m-0">
              <ProfileHistory />
            </TabsContent>
            <TabsContent value="insights" className="m-0">
              <ProfileInsights />
            </TabsContent>
            <TabsContent value="settings" className="m-0">
              <ProfileSettings onEditAvatar={() => setShowAvatarModal(true)} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Avatar Selection Modal */}
        <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
          <DialogContent className="bg-secondary border-muted-foreground/30 max-w-md">
            <DialogHeader>
              <DialogTitle>เลือก Avatar ของคุณ</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-6 gap-3 py-4">
              {avatarOptions.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-12 h-12 rounded-full bg-background flex items-center justify-center text-2xl transition-all ${
                    selectedAvatar === emoji 
                      ? 'ring-2 ring-accent scale-110' 
                      : 'hover:ring-2 ring-muted-foreground'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-muted-foreground/50"
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
                  setSelectedAvatar(avatarOptions[randomIndex]);
                }}
              >
                🎲 Random
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAvatarModal(false)}>
                  ยกเลิก
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSaveAvatar}
                  disabled={!selectedAvatar}
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Modal */}
        <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
          <DialogContent className="bg-secondary border-muted-foreground/30">
            <DialogHeader>
              <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground">Display Name</label>
                <input
                  type="text"
                  defaultValue={profile?.name || ''}
                  className="w-full mt-1 px-3 py-2 bg-background border border-muted-foreground/50 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Bio</label>
                <textarea
                  rows={3}
                  className="w-full mt-1 px-3 py-2 bg-background border border-muted-foreground/50 rounded-lg text-white resize-none"
                  placeholder="เล่าเกี่ยวกับตัวคุณ..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditProfileModal(false)}>
                ยกเลิก
              </Button>
              <Button 
                className="bg-accent text-secondary hover:bg-accent/90"
                onClick={() => setShowEditProfileModal(false)}
              >
                บันทึก
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Post-Game Survey Modal */}
        <PostGameSurvey
          isOpen={showSurvey}
          onClose={() => setShowSurvey(false)}
          triggerContext="manual"
        />
      </div>
    </div>
  );
};

export default Profile;
