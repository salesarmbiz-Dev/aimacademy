import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowLeft, Eye, Puzzle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { useSpot } from '@/contexts/SpotContext';

const Insights: React.FC = () => {
  const { insights } = useProgress();
  const { patternsDiscovered } = useSpot();

  const allInsights = [
    ...insights.map(i => ({ ...i, source: 'lego' as const })),
    ...patternsDiscovered.map((p, idx) => ({
      id: `spot-${idx}`,
      content: p,
      discovered_at: new Date().toISOString(),
      source: 'spot' as const,
    })),
  ];

  const hasInsights = allInsights.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-rackley" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tennessee/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-tennessee" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                💡 Insights Library
              </h1>
              <p className="text-rackley">รวม Pattern ที่คุณเรียนรู้จากทุกเกม</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-turquoise/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-turquoise/20 rounded-lg">
                <Eye className="w-5 h-5 text-turquoise" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patternsDiscovered.length}</p>
                <p className="text-xs text-rackley">จาก Spot the Difference</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-tennessee/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-tennessee/20 rounded-lg">
                <Puzzle className="w-5 h-5 text-tennessee" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{insights.length}</p>
                <p className="text-xs text-rackley">จาก Prompt Lego</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights List or Empty State */}
        {hasInsights ? (
          <div className="space-y-4">
            {allInsights.map((insight) => (
              <Card key={insight.id} className="bg-card border-rackley/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${insight.source === 'spot' ? 'bg-turquoise/20' : 'bg-tennessee/20'}`}>
                      {insight.source === 'spot' ? (
                        <Eye className="w-5 h-5 text-turquoise" />
                      ) : (
                        <Puzzle className="w-5 h-5 text-tennessee" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{insight.content}</p>
                      <p className="text-xs text-rackley mt-2">
                        {insight.source === 'spot' ? 'Spot the Difference' : 'Prompt Lego'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-rackley/30">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rackley/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-rackley" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">ยังไม่มี Insights</h2>
              <p className="text-rackley mb-6">เล่นเกมเพื่อค้นพบ Patterns และ Insights ใหม่ๆ</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-turquoise text-oxford-blue hover:bg-turquoise/90">
                  <Link to="/spot">
                    <Eye className="w-4 h-4 mr-2" />
                    เล่น Spot the Difference
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-tennessee text-tennessee hover:bg-tennessee/10">
                  <Link to="/prompt-lego">
                    <Puzzle className="w-4 h-4 mr-2" />
                    เล่น Prompt Lego
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Insights;
