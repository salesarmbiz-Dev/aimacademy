import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PromptBlock, BlockType, BLOCK_COLORS, BLOCK_PRIORITIES, BLOCK_LIBRARY } from './types';

interface EditBlockModalProps {
  block: PromptBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: PromptBlock) => void;
}

export const EditBlockModal: React.FC<EditBlockModalProps> = ({ block, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(block?.content || '');

  React.useEffect(() => {
    if (block) setContent(block.content);
  }, [block]);

  if (!isOpen || !block) return null;

  const handleSave = () => {
    onSave({ ...block, content });
    onClose();
  };

  const colorClass = BLOCK_COLORS[block.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-root-beer/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-rackley hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-foreground text-xl font-bold mb-6">แก้ไข Block</h2>

        <div className="mb-4">
          <label className="text-rackley text-sm mb-2 block">ประเภท</label>
          <span className={`
            inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
            ${colorClass === 'turquoise' ? 'bg-turquoise/20 text-turquoise' : ''}
            ${colorClass === 'tennessee' ? 'bg-tennessee/20 text-tennessee' : ''}
            ${colorClass === 'rackley' ? 'bg-rackley/20 text-rackley' : ''}
          `}>
            {block.type}
          </span>
        </div>

        <div className="mb-6">
          <label className="text-rackley text-sm mb-2 block">เนื้อหา</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-root-beer border border-rackley/30 rounded-lg text-foreground placeholder:text-rackley focus:outline-none focus:ring-1 focus:ring-turquoise resize-none"
            placeholder="ใส่เนื้อหาของ block..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-rackley text-rackley rounded-lg hover:bg-rackley/10 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-turquoise text-oxford-blue font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: BlockType, content: string) => void;
}

const BLOCK_TYPES: BlockType[] = ['ROLE', 'TASK', 'TARGET', 'CONTEXT', 'TONE', 'FORMAT', 'EXAMPLE', 'CONSTRAINT'];

export const AddBlockModal: React.FC<AddBlockModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedType, setSelectedType] = useState<BlockType>('ROLE');
  const [content, setContent] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (content.trim()) {
      onAdd(selectedType, content);
      setContent('');
      onClose();
    }
  };

  const libraryItems = BLOCK_LIBRARY[selectedType] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-root-beer/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-rackley hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-foreground text-xl font-bold mb-6">เพิ่ม Block ใหม่</h2>

        <div className="mb-4">
          <label className="text-rackley text-sm mb-2 block">เลือกประเภท</label>
          <div className="grid grid-cols-2 gap-2">
            {BLOCK_TYPES.map(type => {
              const colorClass = BLOCK_COLORS[type];
              const isSelected = selectedType === type;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? colorClass === 'turquoise' ? 'border-2 border-turquoise bg-turquoise/10 text-turquoise' :
                        colorClass === 'tennessee' ? 'border-2 border-tennessee bg-tennessee/10 text-tennessee' :
                        'border-2 border-rackley bg-rackley/10 text-rackley'
                      : 'border border-rackley/30 text-rackley hover:border-rackley'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-rackley text-sm">เนื้อหา</label>
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="text-turquoise text-xs hover:underline"
            >
              {showLibrary ? 'พิมพ์เอง' : 'เลือกจาก Library'}
            </button>
          </div>

          {showLibrary ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {libraryItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setContent(item.content);
                    setShowLibrary(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-root-beer border border-rackley/30 rounded-lg text-foreground text-sm hover:border-turquoise/50 transition-colors"
                >
                  {item.content}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-root-beer border border-rackley/30 rounded-lg text-foreground placeholder:text-rackley focus:outline-none focus:ring-1 focus:ring-turquoise resize-none"
              placeholder="ใส่เนื้อหาของ block..."
            />
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!content.trim()}
          className="w-full py-3 bg-tennessee text-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          เพิ่ม Block
        </button>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  block: PromptBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ block, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-root-beer/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-sm animate-scale-in text-center">
        <div className="w-12 h-12 bg-tennessee/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>

        <h2 className="text-foreground text-xl font-bold mb-2">ลบ Block นี้?</h2>
        <p className="text-rackley text-sm mb-2">
          Block "{block.type}: {block.content.substring(0, 30)}..." จะถูกลบออก
        </p>
        <p className="text-tennessee text-sm mb-6">
          ⚠️ อาจส่งผลต่อคะแนน {block.impact} points
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-rackley text-rackley rounded-lg hover:bg-rackley/10 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 text-foreground font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
};
