import React, { useState, useMemo, useEffect } from 'react';
import { Library, Blocks, Heart, Sparkles, Search, X, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LibraryBlockCard } from '@/components/library/LibraryBlockCard';
import { BlockDetailModal } from '@/components/library/BlockDetailModal';
import { CreateBlockModal } from '@/components/library/CreateBlockModal';
import {
  MOCK_LIBRARY_BLOCKS,
  filterBlocks,
  sortBlocks,
  TYPE_IMPACTS,
  type LibraryBlock,
  type LibraryFilters,
  type TabFilter,
  type ViewMode,
  type SortOption,
} from '@/components/library/types';
import type { BlockType } from '@/components/prompt-lego/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'promptlego_library';

const LibraryPage: React.FC = () => {
  const { toast } = useToast();
  
  // Load custom blocks and favorites from localStorage
  const [blocks, setBlocks] = useState<LibraryBlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { customBlocks, favorites } = JSON.parse(saved);
        const updatedBlocks = MOCK_LIBRARY_BLOCKS.map(block => ({
          ...block,
          isFavorite: favorites?.includes(block.id) || block.isFavorite,
        }));
        return [...updatedBlocks, ...(customBlocks || [])];
      }
    } catch (e) {
      console.error('Failed to load library data:', e);
    }
    return MOCK_LIBRARY_BLOCKS;
  });

  const [filters, setFilters] = useState<LibraryFilters>({
    search: '',
    type: 'all',
    priority: 'all',
    sort: 'popular',
    tab: 'all',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedBlock, setSelectedBlock] = useState<LibraryBlock | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const customBlocks = blocks.filter(b => b.isCustom);
    const favorites = blocks.filter(b => b.isFavorite).map(b => b.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customBlocks, favorites }));
  }, [blocks]);

  // Compute stats
  const stats = useMemo(() => ({
    total: blocks.length,
    favorites: blocks.filter(b => b.isFavorite).length,
    custom: blocks.filter(b => b.isCustom).length,
  }), [blocks]);

  // Filter and sort blocks
  const filteredBlocks = useMemo(() => {
    const filtered = filterBlocks(blocks, filters);
    return sortBlocks(filtered, filters.sort);
  }, [blocks, filters]);

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: blocks.length,
    critical: blocks.filter(b => b.priority === 'critical').length,
    high: blocks.filter(b => b.priority === 'high').length,
    medium: blocks.filter(b => b.priority === 'medium' || b.priority === 'low').length,
    favorites: blocks.filter(b => b.isFavorite).length,
    custom: blocks.filter(b => b.isCustom).length,
  }), [blocks]);

  const handleToggleFavorite = (id: string) => {
    setBlocks(prev => prev.map(block =>
      block.id === id ? { ...block, isFavorite: !block.isFavorite } : block
    ));
    const block = blocks.find(b => b.id === id);
    if (block) {
      toast({
        title: block.isFavorite ? 'Removed from Favorites' : '♥ เพิ่มใน Favorites แล้ว',
      });
    }
  };

  const handleViewBlock = (block: LibraryBlock) => {
    setSelectedBlock(block);
    setShowDetailModal(true);
  };

  const handleCreateBlock = (data: {
    type: BlockType;
    content: string;
    description: string;
    tags: string[];
  }) => {
    const newBlock: LibraryBlock = {
      id: `custom-${Date.now()}`,
      type: data.type,
      content: data.content,
      description: data.description || `Custom ${data.type} block`,
      tags: data.tags,
      priority: data.type === 'ROLE' || data.type === 'TASK' ? 'critical' :
                data.type === 'TARGET' || data.type === 'CONTEXT' ? 'high' : 'medium',
      impact: TYPE_IMPACTS[data.type],
      usageCount: 0,
      isFavorite: false,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const tabs: { id: TabFilter; label: string; icon?: string; color?: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'critical', label: '⚡ Critical', color: 'text-turquoise' },
    { id: 'high', label: '▲ High Priority', color: 'text-rackley' },
    { id: 'medium', label: '● Medium', color: 'text-tennessee' },
    { id: 'favorites', label: '♥ Favorites', color: 'text-tennessee' },
    { id: 'custom', label: '✨ Custom', color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Library className="h-8 w-8 text-turquoise" />
            <h1 className="text-white text-3xl font-bold">Block Library</h1>
          </div>
          <p className="text-rackley text-lg">คลัง Blocks สำหรับประกอบ Prompt</p>
        </div>

        {/* Stats cards */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-oxford border border-turquoise/30 rounded-xl px-5 py-3 flex items-center gap-3">
            <Blocks className="h-5 w-5 text-turquoise" />
            <div>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
              <p className="text-rackley text-xs">Total Blocks</p>
            </div>
          </div>
          <div className="bg-oxford border border-tennessee/30 rounded-xl px-5 py-3 flex items-center gap-3">
            <Heart className="h-5 w-5 text-tennessee" />
            <div>
              <p className="text-white text-2xl font-bold">{stats.favorites}</p>
              <p className="text-rackley text-xs">Favorites</p>
            </div>
          </div>
          <div className="bg-oxford border border-rackley/30 rounded-xl px-5 py-3 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-white text-2xl font-bold">{stats.custom}</p>
              <p className="text-rackley text-xs">Custom Blocks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-oxford rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rackley" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="ค้นหา block... (เช่น 'expert', 'กันเอง')"
              className="w-full pl-12 pr-10 py-3 bg-rootbeer border-2 border-rackley/50 rounded-xl text-white placeholder:text-rackley focus:outline-none focus:border-turquoise transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-rackley hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="w-40">
            <p className="text-rackley text-xs mb-1">ประเภท</p>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as BlockType | 'all' }))}
            >
              <SelectTrigger className="bg-rootbeer border-rackley text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-oxford border-rackley">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="ROLE">ROLE</SelectItem>
                <SelectItem value="TASK">TASK</SelectItem>
                <SelectItem value="TARGET">TARGET</SelectItem>
                <SelectItem value="CONTEXT">CONTEXT</SelectItem>
                <SelectItem value="TONE">TONE</SelectItem>
                <SelectItem value="FORMAT">FORMAT</SelectItem>
                <SelectItem value="EXAMPLE">EXAMPLE</SelectItem>
                <SelectItem value="CONSTRAINT">CONSTRAINT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-40">
            <p className="text-rackley text-xs mb-1">เรียงตาม</p>
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value as SortOption }))}
            >
              <SelectTrigger className="bg-rootbeer border-rackley text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-oxford border-rackley">
                <SelectItem value="popular">ยอดนิยม</SelectItem>
                <SelectItem value="impact">Impact สูงสุด</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="recent">ล่าสุด</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View toggle */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2.5 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-turquoise text-oxford' : 'bg-rootbeer text-rackley hover:text-white'
              )}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2.5 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-turquoise text-oxford' : 'bg-rootbeer text-rackley hover:text-white'
              )}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Create button */}
          <div className="flex items-end">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-tennessee text-white hover:bg-tennessee/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              สร้าง Block ใหม่
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-rackley/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilters(prev => ({ ...prev, tab: tab.id }))}
            className={cn(
              'px-5 py-3 rounded-t-lg whitespace-nowrap transition-all flex items-center gap-2',
              filters.tab === tab.id
                ? 'text-white border-b-[3px] border-turquoise bg-oxford'
                : 'text-rackley hover:text-white hover:bg-rackley/10'
            )}
          >
            <span className={tab.color}>{tab.label}</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs',
              filters.tab === tab.id ? 'bg-turquoise/20 text-turquoise' : 'bg-rackley/20 text-rackley'
            )}>
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Block Grid */}
      {filteredBlocks.length > 0 ? (
        <div className={cn(
          'gap-5',
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col'
        )}>
          {filteredBlocks.map((block, index) => (
            <div
              key={block.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <LibraryBlockCard
                block={block}
                onToggleFavorite={handleToggleFavorite}
                onView={handleViewBlock}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          {filters.tab === 'favorites' ? (
            <>
              <Heart className="h-16 w-16 text-rackley mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">ยังไม่มี Favorites</h3>
              <p className="text-rackley mb-4">กด ♡ บน Block ที่ชอบเพื่อเพิ่มที่นี่</p>
            </>
          ) : filters.tab === 'custom' ? (
            <>
              <Sparkles className="h-16 w-16 text-rackley mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">ยังไม่มี Custom Blocks</h3>
              <p className="text-rackley mb-4">สร้าง Block ของคุณเองได้เลย!</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-tennessee text-white">
                <Plus className="h-4 w-4 mr-2" />
                สร้าง Block แรก
              </Button>
            </>
          ) : (
            <>
              <Search className="h-16 w-16 text-rackley mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">ไม่พบ Block ที่ค้นหา</h3>
              <p className="text-rackley mb-4">ลองใช้คำค้นอื่น หรือ สร้าง Block ใหม่</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-tennessee text-white">
                <Plus className="h-4 w-4 mr-2" />
                สร้าง Block นี้
              </Button>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <BlockDetailModal
        block={selectedBlock}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onToggleFavorite={handleToggleFavorite}
      />

      <CreateBlockModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBlock={handleCreateBlock}
      />
    </div>
  );
};

export default LibraryPage;