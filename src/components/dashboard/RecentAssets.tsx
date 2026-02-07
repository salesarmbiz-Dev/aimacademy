import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wand2, FileCheck, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAssets } from '@/hooks/useAssets';
import { categoryConfig, sourceGameLabels } from '@/components/assets/types';
import type { AssetCategory } from '@/components/assets/types';

const CategoryIcon: React.FC<{ category: AssetCategory; size?: number }> = ({ category, size = 16 }) => {
  const config = categoryConfig[category];
  const icons: Record<string, React.ReactNode> = {
    Wand2: <Wand2 size={size} />,
    FileCheck: <FileCheck size={size} />,
    Eye: <Eye size={size} />,
  };
  
  return (
    <span className={cn(config.color)}>
      {icons[config.icon] || <FileCheck size={size} />}
    </span>
  );
};

export const RecentAssets: React.FC = () => {
  const { assets, loading, stats } = useAssets();
  const recentAssets = assets.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-16 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">AI Asset Library</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {stats.total} ชิ้น
        </span>
      </div>

      {recentAssets.length === 0 ? (
        <div className="text-center py-6">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            ยังไม่มี assets — เล่นเกมเพื่อสร้าง!
          </p>
          <Link
            to="/games"
            className="text-sm text-primary hover:underline"
          >
            เริ่มเล่นเกม →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {recentAssets.map((asset) => (
              <Link
                key={asset.id}
                to="/assets"
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', categoryConfig[asset.category].bgColor)}>
                  <CategoryIcon category={asset.category} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {asset.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sourceGameLabels[asset.source_game] || asset.source_game}
                  </p>
                </div>
                {asset.quality_score && (
                  <span className="text-xs text-muted-foreground">
                    ⭐ {asset.quality_score}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <Link
            to="/assets"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-primary hover:underline"
          >
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </div>
  );
};
