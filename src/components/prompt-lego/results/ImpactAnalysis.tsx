import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface ImpactData {
  blockType: string;
  impact: number;
  isRemoved: boolean;
}

interface ImpactAnalysisProps {
  impacts: ImpactData[];
  keyInsight: string;
}

const ImpactAnalysis: React.FC<ImpactAnalysisProps> = ({ impacts, keyInsight }) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(impacts.map(() => 0));
  const maxImpact = Math.max(...impacts.map(i => Math.abs(i.impact)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(impacts.map(i => (Math.abs(i.impact) / maxImpact) * 100));
    }, 300);
    return () => clearTimeout(timer);
  }, [impacts, maxImpact]);

  const sortedImpacts = [...impacts].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return (
    <div className="bg-card rounded-2xl p-6 mt-8">
      <div className="mb-6">
        <h3 className="text-foreground text-xl font-semibold">📊 Impact Analysis</h3>
        <p className="text-rackley text-sm mt-1">วิทยาศาสตร์เบื้องหลัง Prompt</p>
      </div>

      <div className="space-y-4">
        {sortedImpacts.map((item, index) => {
          const isHighest = index === 0;
          const width = animatedWidths[impacts.findIndex(i => i.blockType === item.blockType)] || 0;

          return (
            <div key={item.blockType} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium text-sm">{item.blockType}</span>
                  {isHighest && (
                    <span className="text-xs bg-tennessee/20 text-tennessee px-2 py-0.5 rounded">
                      สำคัญที่สุด
                    </span>
                  )}
                  {item.isRemoved && (
                    <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded">
                      ลบออก
                    </span>
                  )}
                </div>
                <span className="text-tennessee font-semibold text-sm">
                  {item.impact} Points
                </span>
              </div>
              <div className="h-6 bg-root-beer rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-700 ease-out ${
                    isHighest ? 'bg-gradient-to-r from-tennessee to-red-500' : 'bg-tennessee/70'
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Takeaway */}
      <div className="bg-turquoise/10 border border-turquoise rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-turquoise flex-shrink-0 mt-0.5" />
          <p className="text-foreground text-sm">{keyInsight}</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactAnalysis;
