import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Puzzle, Zap, Target, FlaskConical, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GameProgressCardsProps {
  spotStats: {
    completed: number;
    accuracy: number;
    streak: number;
    xp: number;
  };
  legoStats: {
    experiments: number;
    challenges: number;
    xp: number;
  };
}

const GameProgressCards: React.FC<GameProgressCardsProps> = ({ spotStats, legoStats }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Spot the Difference Card */}
      <Card className="bg-card border-turquoise/30 hover:border-turquoise transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-turquoise/20 rounded-lg">
              <Eye className="w-6 h-6 text-turquoise" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">🎯 Spot the Difference</h3>
              <p className="text-xs text-rackley">ฝึกตาดู Prompt</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <p className="text-lg font-bold text-turquoise">{spotStats.completed}</p>
              <p className="text-xs text-rackley">ข้อที่ทำ</p>
            </div>
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <p className="text-lg font-bold text-foreground">{spotStats.accuracy}%</p>
              <p className="text-xs text-rackley">ความแม่น</p>
            </div>
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <p className="text-lg font-bold text-tennessee">{spotStats.xp}</p>
              <p className="text-xs text-rackley">XP</p>
            </div>
          </div>

          {spotStats.streak > 0 && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-turquoise/10 rounded-lg">
              <Target className="w-4 h-4 text-turquoise" />
              <span className="text-sm text-turquoise">🔥 {spotStats.streak} ถูกติด!</span>
            </div>
          )}

          <Link 
            to="/spot"
            className="block w-full py-2.5 bg-turquoise/20 text-turquoise font-semibold rounded-lg text-center hover:bg-turquoise hover:text-oxford-blue transition-all"
          >
            เล่นต่อ
          </Link>
        </CardContent>
      </Card>

      {/* Prompt Lego Card */}
      <Card className="bg-card border-tennessee/30 hover:border-tennessee transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-tennessee/20 rounded-lg">
              <Puzzle className="w-6 h-6 text-tennessee" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">🧱 Prompt Lego</h3>
              <p className="text-xs text-rackley">ประกอบ Prompt</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <FlaskConical className="w-3 h-3 text-rackley" />
                <p className="text-lg font-bold text-foreground">{legoStats.experiments}</p>
              </div>
              <p className="text-xs text-rackley">Experiments</p>
            </div>
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-rackley" />
                <p className="text-lg font-bold text-foreground">{legoStats.challenges}</p>
              </div>
              <p className="text-xs text-rackley">Challenges</p>
            </div>
            <div className="text-center p-2 bg-oxford-blue rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-rackley" />
                <p className="text-lg font-bold text-tennessee">{legoStats.xp}</p>
              </div>
              <p className="text-xs text-rackley">XP</p>
            </div>
          </div>

          <Link 
            to="/prompt-lego"
            className="block w-full py-2.5 bg-tennessee/20 text-tennessee font-semibold rounded-lg text-center hover:bg-tennessee hover:text-foreground transition-all"
          >
            เล่นต่อ
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameProgressCards;
