import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { BlockType, BLOCK_LIBRARY, BLOCK_COLORS, BLOCK_PRIORITIES } from './types';

interface BlockLibraryProps {
  onAddBlock: (type: BlockType, content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const BLOCK_TYPES: BlockType[] = ['ROLE', 'TASK', 'TARGET', 'TONE', 'FORMAT', 'EXAMPLE', 'CONSTRAINT', 'CONTEXT'];

const BlockLibrary: React.FC<BlockLibraryProps> = ({ onAddBlock, isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = ['all', 'ROLE', 'TONE', 'FORMAT', 'อื่นๆ'];

  const getFilteredBlocks = () => {
    const result: { type: BlockType; content: string }[] = [];
    
    const typesToShow = activeFilter === 'all' 
      ? BLOCK_TYPES
      : activeFilter === 'อื่นๆ'
      ? BLOCK_TYPES.filter(t => !['ROLE', 'TONE', 'FORMAT'].includes(t))
      : [activeFilter as BlockType];

    typesToShow.forEach(type => {
      const blocks = BLOCK_LIBRARY[type] || [];
      blocks.forEach(block => {
        if (!search || block.content.toLowerCase().includes(search.toLowerCase())) {
          result.push({ type, content: block.content });
        }
      });
    });

    return result;
  };

  const filteredBlocks = getFilteredBlocks();

  if (!isOpen) return null;

  return (
    <div className="bg-card rounded-2xl p-5 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-lg font-semibold">📦 Block Library</h2>
        <button onClick={onClose} className="md:hidden text-rackley hover:text-foreground">
          ✕
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rackley" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหา block..."
          className="w-full pl-10 pr-4 py-2 bg-root-beer border border-rackley/30 rounded-lg text-foreground text-sm placeholder:text-rackley focus:outline-none focus:ring-1 focus:ring-turquoise"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-full transition-colors ${
              activeFilter === filter
                ? 'bg-turquoise/20 text-turquoise'
                : 'text-rackley hover:text-foreground'
            }`}
          >
            {filter === 'all' ? 'ทั้งหมด' : filter}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {filteredBlocks.map((block, index) => {
          const colorClass = BLOCK_COLORS[block.type];
          
          return (
            <div
              key={`${block.type}-${index}`}
              className="bg-root-beer border border-rackley/30 rounded-lg p-3 cursor-grab hover:border-turquoise/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold uppercase
                  ${colorClass === 'turquoise' ? 'bg-turquoise/20 text-turquoise' : ''}
                  ${colorClass === 'tennessee' ? 'bg-tennessee/20 text-tennessee' : ''}
                  ${colorClass === 'rackley' ? 'bg-rackley/20 text-rackley' : ''}
                `}>
                  {block.type}
                </span>
              </div>
              <p className="text-foreground text-sm mb-2 line-clamp-2">{block.content}</p>
              <button
                onClick={() => onAddBlock(block.type, block.content)}
                className="flex items-center gap-1 text-turquoise text-xs hover:underline"
              >
                <Plus className="h-3 w-3" />
                เพิ่ม
              </button>
            </div>
          );
        })}

        {filteredBlocks.length === 0 && (
          <p className="text-rackley text-sm text-center py-4">ไม่พบ block ที่ค้นหา</p>
        )}
      </div>
    </div>
  );
};

export default BlockLibrary;
