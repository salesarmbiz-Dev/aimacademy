import React from 'react';
import { Minus, Plus, Pencil, ArrowRightLeft } from 'lucide-react';

export interface Change {
  type: 'removed' | 'added' | 'modified' | 'reordered';
  blockType: string;
  content: string;
  oldContent?: string;
  impact: number;
}

interface ChangesSummaryProps {
  changes: Change[];
}

const getChangeConfig = (type: Change['type']) => {
  switch (type) {
    case 'removed':
      return { label: 'ลบออก', color: 'border-l-red-500', bgColor: 'bg-red-500/20', textColor: 'text-red-500', icon: Minus };
    case 'added':
      return { label: 'เพิ่มใหม่', color: 'border-l-green-500', bgColor: 'bg-green-500/20', textColor: 'text-green-500', icon: Plus };
    case 'modified':
      return { label: 'แก้ไข', color: 'border-l-tennessee', bgColor: 'bg-tennessee/20', textColor: 'text-tennessee', icon: Pencil };
    case 'reordered':
      return { label: 'สลับที่', color: 'border-l-rackley', bgColor: 'bg-rackley/20', textColor: 'text-rackley', icon: ArrowRightLeft };
  }
};

const ChangesSummary: React.FC<ChangesSummaryProps> = ({ changes }) => {
  if (changes.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 mt-8">
        <h3 className="text-foreground text-xl font-semibold mb-4">🔄 สิ่งที่เปลี่ยนแปลง</h3>
        <p className="text-rackley text-center py-4">ไม่มีการเปลี่ยนแปลง</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground text-xl font-semibold">🔄 สิ่งที่เปลี่ยนแปลง</h3>
        <span className="text-rackley text-sm">{changes.length} การเปลี่ยนแปลง</span>
      </div>

      <div className="space-y-3">
        {changes.map((change, index) => {
          const config = getChangeConfig(change.type);
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`bg-root-beer border-l-4 ${config.color} rounded-r-xl p-4 animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-foreground font-semibold text-sm">{change.blockType} Block</span>
                  </div>
                  <p className="text-rackley text-sm truncate">{change.content}</p>
                  {change.oldContent && (
                    <p className="text-rackley/60 text-xs mt-1 line-through truncate">
                      เดิม: {change.oldContent}
                    </p>
                  )}
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${
                  change.impact > 0 ? 'text-turquoise' : change.impact < 0 ? 'text-tennessee' : 'text-rackley'
                }`}>
                  {change.impact > 0 ? '+' : ''}{change.impact} points
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChangesSummary;
