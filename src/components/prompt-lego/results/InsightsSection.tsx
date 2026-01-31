import React from 'react';
import { User, ListTodo, Target, MessageCircle, Layout, Sparkles } from 'lucide-react';

export interface DiscoveredInsight {
  id: string;
  blockType: string;
  title: string;
  description: string;
  xp: number;
  isNew: boolean;
}

interface InsightsSectionProps {
  insights: DiscoveredInsight[];
  onSaveInsight: (insight: DiscoveredInsight) => void;
  savedInsights: string[];
}

const getBlockIcon = (blockType: string) => {
  switch (blockType) {
    case 'ROLE': return User;
    case 'TASK': return ListTodo;
    case 'TARGET': return Target;
    case 'TONE': return MessageCircle;
    case 'FORMAT': return Layout;
    default: return Sparkles;
  }
};

const InsightsSection: React.FC<InsightsSectionProps> = ({ insights, onSaveInsight, savedInsights }) => {
  const newInsights = insights.filter(i => i.isNew);

  if (newInsights.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-card to-turquoise/10 border-2 border-turquoise rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-turquoise animate-pulse" />
        <h3 className="text-turquoise text-xl font-bold">💡 Insight ใหม่ที่ค้นพบ!</h3>
      </div>

      <div className="space-y-4">
        {newInsights.map((insight) => {
          const Icon = getBlockIcon(insight.blockType);
          const isSaved = savedInsights.includes(insight.id);

          return (
            <div
              key={insight.id}
              className="bg-card rounded-xl p-5 text-center animate-scale-in"
            >
              <div className="w-12 h-12 bg-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-turquoise" />
              </div>
              
              <h4 className="text-foreground text-lg font-medium mb-2">{insight.title}</h4>
              <p className="text-rackley text-sm mb-4">{insight.description}</p>
              
              <div className="flex items-center justify-center gap-4">
                <span className="text-tennessee text-2xl font-bold animate-bounce">
                  +{insight.xp} XP
                </span>
                
                <button
                  onClick={() => onSaveInsight(insight)}
                  disabled={isSaved}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isSaved
                      ? 'bg-turquoise/20 text-turquoise cursor-not-allowed'
                      : 'bg-turquoise text-oxford-blue hover:opacity-90'
                  }`}
                >
                  {isSaved ? '✓ บันทึกแล้ว' : 'บันทึก Insight'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsSection;
