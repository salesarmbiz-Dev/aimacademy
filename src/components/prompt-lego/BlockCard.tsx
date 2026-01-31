import React from 'react';
import { GripVertical, Trash2, Pencil } from 'lucide-react';
import { PromptBlock, BLOCK_COLORS } from './types';

interface BlockCardProps {
  block: PromptBlock;
  onEdit: (block: PromptBlock) => void;
  onDelete: (block: PromptBlock) => void;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, block: PromptBlock) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetBlock: PromptBlock) => void;
}

const getPriorityLabel = (priority: PromptBlock['priority']) => {
  switch (priority) {
    case 'critical': return { icon: '⚡', label: 'Critical', color: 'text-turquoise' };
    case 'high': return { icon: '▲', label: 'High', color: 'text-rackley' };
    case 'medium': return { icon: '●', label: 'Medium', color: 'text-tennessee' };
    case 'low': return { icon: '○', label: 'Low', color: 'text-rackley/50' };
  }
};

const BlockCard: React.FC<BlockCardProps> = ({
  block,
  onEdit,
  onDelete,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const colorClass = BLOCK_COLORS[block.type];
  const priority = getPriorityLabel(block.priority);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, block)}
      className={`
        w-full md:w-[calc(50%-8px)] bg-root-beer rounded-xl p-4 cursor-grab
        border-l-4 transition-all duration-200
        ${colorClass === 'turquoise' ? 'border-l-turquoise' : ''}
        ${colorClass === 'tennessee' ? 'border-l-tennessee' : ''}
        ${colorClass === 'rackley' ? 'border-l-rackley' : ''}
        ${isDragging ? 'opacity-50 scale-102 rotate-1 shadow-xl' : 'hover:shadow-lg hover:border-opacity-100'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`
          px-3 py-1 rounded-full text-xs font-bold uppercase
          ${colorClass === 'turquoise' ? 'bg-turquoise/20 text-turquoise' : ''}
          ${colorClass === 'tennessee' ? 'bg-tennessee/20 text-tennessee' : ''}
          ${colorClass === 'rackley' ? 'bg-rackley/20 text-rackley' : ''}
        `}>
          {block.type}
        </span>
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-rackley cursor-grab" />
          <button
            onClick={() => onDelete(block)}
            className="text-rackley hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground text-sm mt-3 line-clamp-2">{block.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs ${priority.color}`}>
          {priority.icon} {priority.label}
        </span>
        <button
          onClick={() => onEdit(block)}
          className="flex items-center gap-1 text-turquoise text-xs hover:underline"
        >
          <Pencil className="h-3 w-3" />
          แก้ไข
        </button>
      </div>
    </div>
  );
};

export default BlockCard;
