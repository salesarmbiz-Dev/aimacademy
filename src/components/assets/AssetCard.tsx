import React from 'react';
import { cn } from '@/lib/utils';
import { Wand2, FileCheck, Eye, Copy, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserAsset, AssetCategory } from './types';
import { categoryConfig, sourceGameLabels } from './types';

interface AssetCardProps {
  asset: UserAsset;
  viewMode: 'list' | 'grid';
  onView: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const CategoryIcon: React.FC<{ category: AssetCategory; size?: number }> = ({ category, size = 24 }) => {
  const config = categoryConfig[category];
  const icons: Record<string, React.ReactNode> = {
    Wand2: <Wand2 size={size} />,
    FileCheck: <FileCheck size={size} />,
    Eye: <Eye size={size} />,
  };
  
  return (
    <div className={cn('flex items-center justify-center', config.color)}>
      {icons[config.icon] || <FileCheck size={size} />}
    </div>
  );
};

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  viewMode,
  onView,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const config = categoryConfig[asset.category];
  const formattedDate = new Date(asset.created_at).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (viewMode === 'list') {
    return (
      <div
        onClick={onView}
        className={cn(
          'group bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer',
          'border-l-4',
          config.borderColor
        )}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bgColor)}>
            <CategoryIcon category={asset.category} size={20} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {asset.title}
            </h3>
            {asset.description && (
              <p className="text-sm text-muted-foreground truncate">
                {asset.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                จาก {sourceGameLabels[asset.source_game] || asset.source_game}
              </span>
              {asset.quality_score && (
                <span className="text-xs text-muted-foreground">
                  ⭐ {asset.quality_score}/100
                </span>
              )}
              <span className="text-xs text-muted-foreground/60">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 md:transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onCopy(); }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={onView}
      className="group bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 cursor-pointer border border-border"
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-xs font-medium rounded-full px-2 py-1', config.bgColor, config.color)}>
          {categoryConfig[asset.category].label}
        </span>
        {asset.quality_score && (
          <span className="text-xs text-muted-foreground">
            ⭐ {asset.quality_score}
          </span>
        )}
      </div>

      {/* Middle */}
      <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">
        {asset.title}
      </h3>
      {asset.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {asset.description}
        </p>
      )}

      {/* Bottom */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {sourceGameLabels[asset.source_game] || asset.source_game}
          </span>
          <span className="text-xs text-muted-foreground/60">
            • {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
