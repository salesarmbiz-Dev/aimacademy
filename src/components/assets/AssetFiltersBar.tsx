import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search, List, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssetFilters, AssetCategory } from './types';
import { categoryConfig } from './types';

interface AssetFiltersBarProps {
  filters: AssetFilters;
  onFiltersChange: (filters: AssetFilters) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  categoryCounts: Record<AssetCategory | 'all', number>;
}

const categories: { value: AssetCategory | 'all'; label: string; icon?: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'prompt', label: '📝 Prompts', icon: '📝' },
  { value: 'sop', label: '📋 SOPs', icon: '📋' },
  { value: 'pattern', label: '🔍 Patterns', icon: '🔍' },
];

export const AssetFiltersBar: React.FC<AssetFiltersBarProps> = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  categoryCounts,
}) => {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm shadow-sm py-3 px-4 border-b border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา assets..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 rounded-xl"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFiltersChange({ ...filters, category: cat.value })}
              className={cn(
                'whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                filters.category === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat.label}
              {categoryCounts[cat.value] > 0 && (
                <span className="ml-1 opacity-70">({categoryCounts[cat.value]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort & View Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as AssetFilters['sortBy'] })}
          >
            <SelectTrigger className="w-[130px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">ล่าสุด</SelectItem>
              <SelectItem value="oldest">เก่าสุด</SelectItem>
              <SelectItem value="score">คะแนนสูงสุด</SelectItem>
              <SelectItem value="title">ชื่อ A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9 rounded-r-none', viewMode === 'list' && 'bg-muted')}
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9 rounded-l-none', viewMode === 'grid' && 'bg-muted')}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
