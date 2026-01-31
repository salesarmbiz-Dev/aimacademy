import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Trophy, Puzzle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSpot } from '@/contexts/SpotContext';

const QuickLinksCard: React.FC = () => {
  const { patternsDiscovered } = useSpot();

  const links = [
    {
      to: '/spot/patterns',
      icon: Lightbulb,
      title: 'Patterns',
      subtitle: `${patternsDiscovered.length} learned`,
      color: 'turquoise',
    },
    {
      to: '/spot/leaderboard',
      icon: Trophy,
      title: 'Leaderboard',
      subtitle: 'Rank #42',
      color: 'tennessee',
    },
    {
      to: '/prompt-lego',
      icon: Puzzle,
      title: 'Prompt Lego',
      subtitle: 'ลองเกมอื่น',
      color: 'rackley',
    },
  ];

  return (
    <Card className="bg-card border-rackley/30">
      <CardContent className="p-5">
        <h3 className="font-semibold text-foreground mb-4">🔗 QUICK LINKS</h3>
        <div className="grid grid-cols-3 gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-4 rounded-xl bg-oxford-blue hover:scale-105 transition-all text-center border border-transparent hover:border-${link.color}/50`}
            >
              <link.icon 
                className={`w-6 h-6 mx-auto mb-2 ${
                  link.color === 'turquoise' ? 'text-turquoise' :
                  link.color === 'tennessee' ? 'text-tennessee' :
                  'text-rackley'
                }`} 
              />
              <p className="text-foreground text-sm font-medium">{link.title}</p>
              <p className="text-rackley text-xs">{link.subtitle}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
