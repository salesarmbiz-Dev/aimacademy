import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { BlockType } from '@/components/prompt-lego/types';
import { TYPE_COLORS, TYPE_IMPACTS } from './types';
import { useToast } from '@/hooks/use-toast';

interface CreateBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlock: (block: {
    type: BlockType;
    content: string;
    description: string;
    tags: string[];
  }) => void;
}

const BLOCK_TYPES: { type: BlockType; label: string; description: string }[] = [
  { type: 'ROLE', label: 'ROLE', description: 'กำหนดบทบาทของ AI' },
  { type: 'TASK', label: 'TASK', description: 'สั่งงานให้ AI ทำ' },
  { type: 'TARGET', label: 'TARGET', description: 'กลุ่มเป้าหมาย' },
  { type: 'CONTEXT', label: 'CONTEXT', description: 'บริบทการใช้งาน' },
  { type: 'TONE', label: 'TONE', description: 'น้ำเสียงและสไตล์' },
  { type: 'FORMAT', label: 'FORMAT', description: 'รูปแบบ output' },
  { type: 'EXAMPLE', label: 'EXAMPLE', description: 'ตัวอย่างที่ต้องการ' },
  { type: 'CONSTRAINT', label: 'CONSTRAINT', description: 'ข้อจำกัด/เงื่อนไข' },
];

export const CreateBlockModal: React.FC<CreateBlockModalProps> = ({
  isOpen,
  onClose,
  onCreateBlock,
}) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!selectedType || !content.trim()) return;

    onCreateBlock({
      type: selectedType,
      content: content.trim(),
      description: description.trim(),
      tags,
    });

    toast({
      title: '✨ สร้าง Block ใหม่แล้ว!',
      description: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
    });

    // Reset form
    setSelectedType(null);
    setContent('');
    setDescription('');
    setTags([]);
    onClose();
  };

  const canSubmit = selectedType && content.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-rootbeer/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-oxford rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-rackley/30 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">✨ สร้าง Block ใหม่</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-rackley hover:text-white hover:bg-rootbeer transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Type Selector */}
          <div className="mb-6">
            <label className="text-rackley text-sm font-medium mb-3 block">
              ประเภท Block <span className="text-tennessee">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map(({ type, label, description }) => {
                const colorKey = TYPE_COLORS[type];
                const isSelected = selectedType === type;
                
                const colorClasses = {
                  turquoise: {
                    selected: 'border-turquoise bg-turquoise/10',
                    badge: 'bg-turquoise/20 text-turquoise',
                  },
                  tennessee: {
                    selected: 'border-tennessee bg-tennessee/10',
                    badge: 'bg-tennessee/20 text-tennessee',
                  },
                  rackley: {
                    selected: 'border-rackley bg-rackley/10',
                    badge: 'bg-rackley/20 text-rackley',
                  },
                  purple: {
                    selected: 'border-purple-400 bg-purple-400/10',
                    badge: 'bg-purple-400/20 text-purple-400',
                  },
                }[colorKey];

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      isSelected ? colorClasses.selected : 'border-rackley/30 hover:border-rackley'
                    )}
                  >
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', colorClasses.badge)}>
                      {label}
                    </span>
                    <p className="text-rackley text-xs mt-1">{description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="text-rackley text-sm font-medium mb-2 block">
              เนื้อหา Block <span className="text-tennessee">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="เช่น 'คุณคือ marketing expert' หรือ 'โทนเป็นกันเอง'"
              className="bg-rootbeer border-rackley text-white placeholder:text-rackley/50"
              rows={3}
              maxLength={200}
            />
            <p className="text-rackley text-xs mt-1 text-right">{content.length}/200</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="text-rackley text-sm font-medium mb-2 block">
              คำอธิบาย (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายว่า Block นี้ใช้ทำอะไร"
              className="bg-rootbeer border-rackley text-white placeholder:text-rackley/50"
              rows={2}
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="text-rackley text-sm font-medium mb-2 block">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="พิมพ์แล้วกด Enter"
              className="w-full px-4 py-2 bg-rootbeer border border-rackley rounded-lg text-white placeholder:text-rackley/50 focus:outline-none focus:ring-1 focus:ring-turquoise"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-turquoise/20 text-turquoise rounded-full text-xs"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {selectedType && content && (
            <div className="mb-6">
              <label className="text-rackley text-sm font-medium mb-2 block">
                Preview
              </label>
              <div className="bg-rootbeer rounded-xl p-4 border border-rackley/30">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  TYPE_COLORS[selectedType] === 'turquoise' && 'bg-turquoise/20 text-turquoise',
                  TYPE_COLORS[selectedType] === 'tennessee' && 'bg-tennessee/20 text-tennessee',
                  TYPE_COLORS[selectedType] === 'rackley' && 'bg-rackley/20 text-rackley'
                )}>
                  {selectedType}
                </span>
                <p className="text-white mt-2">{content}</p>
                <p className="text-rackley text-xs mt-2">
                  Impact: -{TYPE_IMPACTS[selectedType]} pts
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-rackley/30 p-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-rackley text-rackley"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-tennessee text-white hover:bg-tennessee/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            สร้าง Block
          </Button>
        </div>
      </div>
    </div>
  );
};
