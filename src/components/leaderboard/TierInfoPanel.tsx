import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TIER_SYSTEM, type TierType } from './types';

const TierInfoPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tiers: TierType[] = ['legend', 'master', 'expert', 'skilled', 'beginner'];

  return (
    <Card className="bg-secondary border-muted-foreground/30 mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          <span className="text-white font-semibold">ℹ️ ระบบ Tier อธิบาย</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <CardContent className="pt-0 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tiers.map(tierKey => {
              const tier = TIER_SYSTEM[tierKey];
              return (
                <div
                  key={tierKey}
                  className="rounded-xl p-4 text-center border"
                  style={{
                    backgroundColor: `${tier.color}10`,
                    borderColor: tier.color
                  }}
                >
                  <span className="text-4xl">{tier.icon}</span>
                  <h4 
                    className="mt-2 font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </h4>
                  <p className="text-white text-sm mt-1">
                    {tier.minXp.toLocaleString()}+ XP
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {tier.rankRange}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TierInfoPanel;
