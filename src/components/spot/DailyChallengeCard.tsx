import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSpot } from '@/contexts/SpotContext';
import { SPOT_CHALLENGES } from '@/data/spotChallenges';

const DailyChallengeCard: React.FC = () => {
  const navigate = useNavigate();
  const { dailyChallengeCompleted, dailyChallengeDate, completeDailyChallenge } = useSpot();
  const [timeRemaining, setTimeRemaining] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = dailyChallengeCompleted && dailyChallengeDate === today;

  // Get daily challenge based on date (pseudo-random)
  const getDailyChallenge = () => {
    const dateNum = parseInt(today.replace(/-/g, ''));
    const index = dateNum % SPOT_CHALLENGES.length;
    return SPOT_CHALLENGES[index];
  };

  const dailyChallenge = getDailyChallenge();

  // Calculate time until midnight
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartChallenge = () => {
    navigate(`/spot/play/daily`);
  };

  return (
    <Card className="bg-gradient-to-r from-oxford-blue to-root-beer border-tennessee/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isCompleted ? 'bg-accent/20' : 'bg-tennessee/20'}`}>
              {isCompleted ? (
                <CheckCircle className="w-8 h-8 text-accent" />
              ) : (
                <Trophy className="w-8 h-8 text-tennessee" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-foreground text-lg">
                  {isCompleted ? '✅ DAILY COMPLETE!' : '🏆 DAILY CHALLENGE'}
                </h3>
                <Badge className="bg-tennessee text-foreground border-0">2x XP!</Badge>
              </div>
              <p className="text-rackley text-sm">
                {isCompleted 
                  ? 'ทำสำเร็จแล้ววันนี้! พรุ่งนี้มาใหม่นะ'
                  : `วันนี้: "${dailyChallenge.context.slice(0, 40)}..."`
                }
              </p>
              {isCompleted && (
                <p className="text-accent text-sm mt-1">
                  +150 XP (รวม bonus)
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-rackley">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{timeRemaining}</span>
            </div>
            
            {!isCompleted ? (
              <Button 
                className="bg-tennessee text-foreground hover:bg-tennessee/90"
                onClick={handleStartChallenge}
              >
                <Zap className="w-4 h-4 mr-2" />
                เริ่ม Daily
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-accent/50 text-accent hover:bg-accent/10"
                disabled
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                เสร็จแล้ว
              </Button>
            )}
          </div>
        </div>

        {/* Bonus info */}
        {!isCompleted && (
          <div className="mt-4 p-3 bg-tennessee/10 rounded-lg border border-tennessee/30">
            <p className="text-tennessee text-sm">
              🎁 <strong>Rewards:</strong> 2x XP Bonus + 50 XP พิเศษถ้าถูกรอบแรก!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChallengeCard;
