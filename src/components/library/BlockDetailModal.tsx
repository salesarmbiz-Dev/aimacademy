import React from 'react';
import { X, Heart, Copy, Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LibraryBlock } from './types';
import { TYPE_COLORS, MOCK_LIBRARY_BLOCKS } from './types';
import { useToast } from '@/hooks/use-toast';

interface BlockDetailModalProps {
  block: LibraryBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({
  block,
  isOpen,
  onClose,
  onToggleFavorite,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isOpen || !block) return null;

  const colorKey = TYPE_COLORS[block.type];

  const colorClasses = {
    turquoise: {
      header: 'bg-turquoise/10 border-turquoise/30',
      badge: 'bg-turquoise/20 text-turquoise',
      text: 'text-turquoise',
    },
    tennessee: {
      header: 'bg-tennessee/10 border-tennessee/30',
      badge: 'bg-tennessee/20 text-tennessee',
      text: 'text-tennessee',
    },
    rackley: {
      header: 'bg-rackley/10 border-rackley/30',
      badge: 'bg-rackley/20 text-rackley',
      text: 'text-rackley',
    },
    purple: {
      header: 'bg-purple-400/10 border-purple-400/30',
      badge: 'bg-purple-400/20 text-purple-400',
      text: 'text-purple-400',
    },
  }[colorKey];

  const getPriorityInfo = () => {
    switch (block.priority) {
      case 'critical':
        return { icon: '⚡', text: 'นี่คือ Block ที่สำคัญที่สุด ลบไม่ได้!', color: 'text-turquoise' };
      case 'high':
        return { icon: '▲', text: 'Block ที่มีผลกระทบสูง ควรมีไว้', color: 'text-rackley' };
      case 'medium':
        return { icon: '●', text: 'Block ที่ช่วยปรับแต่ง output', color: 'text-tennessee' };
      case 'low':
        return { icon: '○', text: 'Optional แต่ช่วยให้ดีขึ้น', color: 'text-rackley/70' };
    }
  };

  const priorityInfo = getPriorityInfo();

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content);
    toast({
      title: '📋 Copy แล้ว!',
      description: block.content.slice(0, 50) + (block.content.length > 50 ? '...' : ''),
    });
  };

  const handleUseInExperiment = () => {
    // Navigate to prompt-lego with block data in state
    navigate('/prompt-lego', { state: { preAddBlock: block } });
    onClose();
  };

  // Find related blocks (same type or similar tags)
  const relatedBlocks = MOCK_LIBRARY_BLOCKS
    .filter(b => b.id !== block.id && (b.type === block.type || b.tags.some(t => block.tags.includes(t))))
    .slice(0, 3);

  const impactPercent = Math.min((Math.abs(block.impact) / 40) * 100, 100);
  const isPositiveImpact = block.impact < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-rootbeer/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-oxford rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={cn('p-6 border-b', colorClasses.header)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase', colorClasses.badge)}>
                {block.type}
              </span>
              <p className="text-white text-xl font-semibold mt-3">{block.content}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(block.id)}
                className={cn(
                  'p-2 rounded-full transition-all hover:scale-110',
                  block.isFavorite ? 'text-tennessee' : 'text-rackley hover:text-tennessee'
                )}
              >
                <Heart className={cn('h-6 w-6', block.isFavorite && 'fill-current')} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-rackley hover:text-white hover:bg-rootbeer transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          <div>
            <h4 className="text-rackley text-sm font-semibold mb-2">📝 คำอธิบาย</h4>
            <p className="text-white">{block.description}</p>
          </div>

          {/* Impact Analysis */}
          <div className="mt-6">
            <h4 className="text-rackley text-sm font-semibold mb-3">📊 Impact Analysis</h4>
            <div className="bg-rootbeer rounded-xl p-4">
              <p className="text-rackley text-sm mb-2">เมื่อลบ Block นี้ออก:</p>
              <p className={cn('text-3xl font-bold', isPositiveImpact ? 'text-turquoise' : 'text-tennessee')}>
                {isPositiveImpact ? '+' : '-'}{Math.abs(block.impact)} points
              </p>
              <div className="w-full h-2.5 bg-oxford rounded-full mt-3 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    block.impact > 25 ? 'bg-gradient-to-r from-red-500 to-tennessee' :
                    block.impact > 15 ? 'bg-tennessee' : 'bg-rackley'
                  )}
                  style={{ width: `${impactPercent}%` }}
                />
              </div>
              <p className={cn('text-sm mt-3', priorityInfo.color)}>
                {priorityInfo.icon} {priorityInfo.text}
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-6">
            <h4 className="text-rackley text-sm font-semibold mb-3">📈 สถิติการใช้งาน</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-rootbeer rounded-lg p-3">
                <p className="text-rackley text-xs">ใช้แล้ว</p>
                <p className="text-white font-semibold">{block.usageCount} ครั้ง</p>
              </div>
              <div className="bg-rootbeer rounded-lg p-3">
                <p className="text-rackley text-xs">Favorite โดย</p>
                <p className="text-white font-semibold">{Math.floor(block.usageCount * 0.3)} คน</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {block.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-rackley text-sm font-semibold mb-3">🏷️ Tags</h4>
              <div className="flex flex-wrap gap-2">
                {block.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-rootbeer text-rackley rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Blocks */}
          {relatedBlocks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-rackley text-sm font-semibold mb-3">🔗 Blocks ที่ใช้คู่กันบ่อย</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {relatedBlocks.map(related => {
                  const relatedColorKey = TYPE_COLORS[related.type];
                  const relatedBadge = {
                    turquoise: 'bg-turquoise/20 text-turquoise',
                    tennessee: 'bg-tennessee/20 text-tennessee',
                    rackley: 'bg-rackley/20 text-rackley',
                    purple: 'bg-purple-400/20 text-purple-400',
                  }[relatedColorKey];

                  return (
                    <div
                      key={related.id}
                      className="flex-shrink-0 w-48 bg-rootbeer rounded-lg p-3 cursor-pointer hover:bg-rootbeer/80 transition-colors"
                    >
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', relatedBadge)}>
                        {related.type}
                      </span>
                      <p className="text-white text-sm mt-2 line-clamp-2">{related.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-rackley/30 p-4 flex justify-between">
          <div className="flex gap-2">
            {block.isCustom && (
              <>
                <Button variant="outline" size="sm" className="border-rackley text-rackley">
                  แก้ไข
                </Button>
                <Button variant="outline" size="sm" className="border-red-500 text-red-500">
                  ลบ
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-turquoise text-turquoise hover:bg-turquoise/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              onClick={handleUseInExperiment}
              className="bg-tennessee text-white hover:bg-tennessee/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              ใช้ใน Experiment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
