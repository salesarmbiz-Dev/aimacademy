import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MOCK_INSIGHTS, TYPE_COLORS, type InsightItem } from './types';

const ProfileInsights: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const blockTypes = [...new Set(MOCK_INSIGHTS.map(i => i.blockType))];

  const filteredInsights = selectedType 
    ? MOCK_INSIGHTS.filter(i => i.blockType === selectedType)
    : MOCK_INSIGHTS;

  const groupedInsights = filteredInsights.reduce((acc, insight) => {
    if (!acc[insight.blockType]) {
      acc[insight.blockType] = [];
    }
    acc[insight.blockType].push(insight);
    return acc;
  }, {} as Record<string, InsightItem[]>);

  const InsightCard = ({ insight }: { insight: InsightItem }) => {
    const color = TYPE_COLORS[insight.blockType] || '#6593A6';

    return (
      <Card 
        className="bg-secondary border-l-4 rounded-l-none"
        style={{ borderLeftColor: color }}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div 
                className="text-2xl"
                style={{ color }}
              >
                💡
              </div>
              <div>
                <Badge 
                  className="mb-2"
                  style={{ 
                    backgroundColor: `${color}20`,
                    color 
                  }}
                >
                  {insight.blockType}
                </Badge>
                <p className="text-white font-medium">{insight.text}</p>
                <p className="text-muted-foreground text-sm mt-1">{insight.description}</p>
              </div>
            </div>
            <span className="text-primary font-bold whitespace-nowrap">+{insight.xpEarned} XP</span>
          </div>
          
          <p className="mt-3 text-muted-foreground text-xs">
            Discovered: {new Date(insight.discoveredAt).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </CardContent>
      </Card>
    );
  };

  if (MOCK_INSIGHTS.length === 0) {
    return (
      <div className="text-center py-16">
        <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-xl text-white">ยังไม่มี Insights</h3>
        <p className="mt-2 text-muted-foreground">ทดลอง Prompt เพื่อค้นพบ Insights ใหม่ๆ</p>
        <Button 
          onClick={() => navigate('/prompt-lego')}
          className="mt-4 bg-primary hover:bg-primary/90"
        >
          เริ่มทดลอง
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          💡 Insights Collection
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {MOCK_INSIGHTS.length} insights ที่ค้นพบ
        </p>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !selectedType 
              ? 'bg-accent text-secondary font-medium' 
              : 'bg-secondary text-muted-foreground hover:text-white'
          }`}
        >
          ทั้งหมด ({MOCK_INSIGHTS.length})
        </button>
        {blockTypes.map(type => {
          const count = MOCK_INSIGHTS.filter(i => i.blockType === type).length;
          const color = TYPE_COLORS[type] || '#6593A6';
          
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedType === type 
                  ? 'font-medium' 
                  : 'bg-secondary text-muted-foreground hover:text-white'
              }`}
              style={selectedType === type ? {
                backgroundColor: `${color}20`,
                color
              } : undefined}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights by Category */}
      {!selectedType ? (
        <div className="space-y-8">
          {Object.entries(groupedInsights).map(([blockType, insights]) => {
            const color = TYPE_COLORS[blockType] || '#6593A6';
            
            return (
              <div key={blockType}>
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color }}
                >
                  ⚡ {blockType} Insights
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {insights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileInsights;
