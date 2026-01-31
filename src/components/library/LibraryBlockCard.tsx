import React from 'react';
import { Heart, Copy, Eye, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LibraryBlock } from './types';
import { TYPE_COLORS } from './types';
import { useToast } from '@/hooks/use-toast';

interface LibraryBlockCardProps {
  block: LibraryBlock;
  onToggleFavorite: (id: string) => void;
  onView: (block: LibraryBlock) => void;
}

const COLOR_STYLES = {
  turquoise: {
    border: 'hover:border-turquoise',
    badge: 'bg-turquoise/20 text-turquoise',
    shadow: 'hover:shadow-turquoise/20',
  },
  tennessee: {
    border: 'hover:border-tennessee',
    badge: 'bg-tennessee/20 text-tennessee',
    shadow: 'hover:shadow-tennessee/20',
  },
  rackley: {
    border: 'hover:border-rackley',
    badge: 'bg-rackley/20 text-rackley',
    shadow: 'hover:shadow-rackley/20',
  },
  purple: {
    border: 'hover:border-purple-400',
    badge: 'bg-purple-400/20 text-purple-400',
    shadow: 'hover:shadow-purple-400/20',
  },
};

export const LibraryBlockCard: React.FC<LibraryBlockCardProps> = ({
  block,
  onToggleFavorite,
  onView,
}) => {
  const { toast } = useToast();
  const colorKey = TYPE_COLORS[block.type];
  const colorClasses = COLOR_STYLES[colorKey as keyof typeof COLOR_STYLES] || COLOR_STYLES.turquoise;

  const getPriorityDot = () => {
    switch (block.priority) {
      case 'critical':
        return <span className="w-2 h-2 rounded-full bg-turquoise animate-pulse" />;
      case 'high':
        return <span className="w-2 h-2 rounded-full bg-rackley" />;
      case 'medium':
        return <span className="w-2 h-2 rounded-full bg-tennessee" />;
      case 'low':
        return <span className="w-2 h-2 rounded-full bg-rackley/50" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(block.content);
    toast({
      title: '📋 Copy แล้ว!',
      description: block.content.slice(0, 50) + (block.content.length > 50 ? '...' : ''),
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(block.id);
  };

  const impactPercent = Math.min((Math.abs(block.impact) / 40) * 100, 100);
  const isPositiveImpact = block.impact < 0;

  return (
    <div
      onClick={() => onView(block)}
      className={cn(
        'bg-oxford border-2 border-transparent rounded-2xl p-5 cursor-pointer',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-xl',
        colorClasses.border,
        colorClasses.shadow
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase', colorClasses.badge)}>
            {block.type}
          </span>
          {getPriorityDot()}
        </div>
        <button
          onClick={handleToggleFavorite}
          className={cn(
            'p-1 rounded-full transition-all hover:scale-110',
            block.isFavorite ? 'text-tennessee' : 'text-rackley hover:text-tennessee'
          )}
        >
          <Heart className={cn('h-5 w-5', block.isFavorite && 'fill-current')} />
        </button>
      </div>

      {/* Content */}
      <p className="text-white text-base font-medium mt-4 line-clamp-3 min-h-[72px]">
        {block.content}
      </p>

      {/* Impact Section */}
      <div className="bg-rootbeer rounded-lg p-3 mt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-rackley">Impact เมื่อลบออก:</span>
          <span className={cn('font-bold', isPositiveImpact ? 'text-turquoise' : 'text-tennessee')}>
            {isPositiveImpact ? '+' : '-'}{Math.abs(block.impact)} pts
          </span>
        </div>
        <div className="w-full h-1.5 bg-oxford rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              block.impact > 25 ? 'bg-gradient-to-r from-red-500 to-tennessee' :
              block.impact > 15 ? 'bg-tennessee' : 'bg-rackley'
            )}
            style={{ width: `${impactPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-rackley text-xs">
          <BarChart3 className="h-3 w-3" />
          <span>ใช้แล้ว {block.usageCount} ครั้ง</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-rackley hover:text-turquoise hover:bg-turquoise/10 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onView(block); }}
            className="p-1.5 rounded-lg text-rackley hover:text-turquoise hover:bg-turquoise/10 transition-colors"
            title="ดูรายละเอียด"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
