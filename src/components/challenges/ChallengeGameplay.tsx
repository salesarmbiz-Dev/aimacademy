import React, { useState, useEffect, useCallback } from 'react';
import { calculateScore, BLOCK_PRIORITIES, BLOCK_COLORS, BLOCK_LIBRARY, type PromptBlock, type BlockType } from '@/components/prompt-lego/types';
import { ChallengeHeader } from './ChallengeHeader';
import { ChallengeInstructions } from './ChallengeInstructions';
import { ChallengeResult } from './ChallengeResult';
import { Button } from '@/components/ui/button';
import { Check, X, AlertTriangle, Plus, GripVertical, Pencil, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Challenge, ChallengeResult as ChallengeResultType } from './types';
import { MODE_COLORS } from './types';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ChallengeGameplayProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: (result: ChallengeResultType) => void;
}

// Inline Block Card for Challenge
const ChallengeBlockCard: React.FC<{
  block: PromptBlock;
  index: number;
  canDelete: boolean;
  onEdit: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}> = ({ block, index, canDelete, onEdit, onDelete, onDragStart, onDragOver, onDrop, onDragEnd, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  
  const colorClass = BLOCK_COLORS[block.type];
  
  const getPriorityLabel = (priority: PromptBlock['priority']) => {
    switch (priority) {
      case 'critical': return { icon: '⚡', label: 'Critical', color: 'text-turquoise' };
      case 'high': return { icon: '▲', label: 'High', color: 'text-rackley' };
      case 'medium': return { icon: '●', label: 'Medium', color: 'text-tennessee' };
      case 'low': return { icon: '○', label: 'Low', color: 'text-rackley/50' };
    }
  };

  const priority = getPriorityLabel(block.priority);

  const handleSaveEdit = () => {
    onEdit(block.id, editContent);
    setIsEditing(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
        className={cn(
          'w-full md:w-[calc(50%-8px)] bg-rootbeer rounded-xl p-4 cursor-grab',
          'border-l-4 transition-all duration-200',
          colorClass === 'turquoise' && 'border-l-turquoise',
          colorClass === 'tennessee' && 'border-l-tennessee',
          colorClass === 'rackley' && 'border-l-rackley',
          isDragging ? 'opacity-50 scale-102 rotate-1 shadow-xl' : 'hover:shadow-lg'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold uppercase',
            colorClass === 'turquoise' && 'bg-turquoise/20 text-turquoise',
            colorClass === 'tennessee' && 'bg-tennessee/20 text-tennessee',
            colorClass === 'rackley' && 'bg-rackley/20 text-rackley'
          )}>
            {block.type}
          </span>
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-rackley cursor-grab" />
            {canDelete && onDelete && (
              <button
                onClick={() => onDelete(block.id)}
                className="text-rackley hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-white text-sm mt-3 line-clamp-2">{block.content}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <span className={cn('text-xs', priority.color)}>
            {priority.icon} {priority.label}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-turquoise text-xs hover:underline"
          >
            <Pencil className="h-3 w-3" />
            แก้ไข
          </button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-oxford border-rackley">
          <DialogHeader>
            <DialogTitle className="text-white">แก้ไข Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-rackley text-sm">ประเภท</label>
              <div className={cn(
                'mt-1 px-3 py-2 rounded-lg text-sm font-medium',
                colorClass === 'turquoise' && 'bg-turquoise/20 text-turquoise',
                colorClass === 'tennessee' && 'bg-tennessee/20 text-tennessee',
                colorClass === 'rackley' && 'bg-rackley/20 text-rackley'
              )}>
                {block.type}
              </div>
            </div>
            <div>
              <label className="text-rackley text-sm">เนื้อหา</label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mt-1 bg-rootbeer border-rackley text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-rackley text-rackley"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-turquoise text-oxford hover:bg-turquoise/90"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Inline Block Library for Challenge
const ChallengeBlockLibrary: React.FC<{
  onAddBlock: (type: BlockType, content: string) => void;
}> = ({ onAddBlock }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const BLOCK_TYPES: BlockType[] = ['ROLE', 'TASK', 'TARGET', 'TONE', 'FORMAT', 'EXAMPLE', 'CONSTRAINT', 'CONTEXT'];
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

  return (
    <div className="bg-oxford rounded-2xl p-5 h-fit sticky top-24">
      <h2 className="text-white text-lg font-semibold mb-4">📦 Block Library</h2>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rackley" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหา block..."
          className="w-full pl-10 pr-4 py-2 bg-rootbeer border border-rackley/30 rounded-lg text-white text-sm placeholder:text-rackley focus:outline-none focus:ring-1 focus:ring-turquoise"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-3 py-1 text-xs whitespace-nowrap rounded-full transition-colors',
              activeFilter === filter
                ? 'bg-turquoise/20 text-turquoise'
                : 'text-rackley hover:text-white'
            )}
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
              className="bg-rootbeer border border-rackley/30 rounded-lg p-3 hover:border-turquoise/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold uppercase',
                  colorClass === 'turquoise' && 'bg-turquoise/20 text-turquoise',
                  colorClass === 'tennessee' && 'bg-tennessee/20 text-tennessee',
                  colorClass === 'rackley' && 'bg-rackley/20 text-rackley'
                )}>
                  {block.type}
                </span>
              </div>
              <p className="text-white text-sm mb-2 line-clamp-2">{block.content}</p>
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

export const ChallengeGameplay: React.FC<ChallengeGameplayProps> = ({
  challenge,
  onClose,
  onComplete,
}) => {
  const { addXp, unlockBadge } = useUser();
  const { completeChallenge } = useProgress();
  const { toast } = useToast();

  const [blocks, setBlocks] = useState<PromptBlock[]>([...challenge.startingBlocks]);
  const [currentScore, setCurrentScore] = useState(calculateScore(challenge.startingBlocks));
  const [attempts, setAttempts] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(challenge.timeLimit || null);
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ChallengeResultType | null>(null);
  const [bestAttempt, setBestAttempt] = useState<number>(0);
  const [showLibrary, setShowLibrary] = useState(challenge.mode === 'maximize' || challenge.mode === 'build');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining]);

  // Recalculate score when blocks change
  useEffect(() => {
    setCurrentScore(calculateScore(blocks));
  }, [blocks]);

  const handleDeleteBlock = useCallback((id: string) => {
    if (challenge.mode === 'maximize') return;
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, [challenge.mode]);

  const handleEditBlock = useCallback((id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  }, []);

  const handleAddBlock = useCallback((type: BlockType, content: string) => {
    if (challenge.mode === 'minimize') return;
    
    const newBlock: PromptBlock = {
      id: `block-${Date.now()}`,
      type,
      content,
      priority: BLOCK_PRIORITIES[type],
      impact: 0,
    };
    setBlocks(prev => [...prev, newBlock]);
  }, [challenge.mode]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) return;
    
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(dragIndex, 1);
      newBlocks.splice(targetIndex, 0, removed);
      return newBlocks;
    });
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const calculateResult = (): ChallengeResultType => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const passed = currentScore >= challenge.targetScore;
    
    let stars = 0;
    if (passed) {
      const exceeds = currentScore - challenge.targetScore;
      if (exceeds >= 10) stars = 3;
      else if (exceeds >= 0) stars = 2;
      else stars = 1;
    }

    const bonuses: { label: string; xp: number }[] = [];
    let totalXp = 0;

    if (passed) {
      totalXp = challenge.rewards.base;
      
      if (challenge.timeLimit && timeSpent < challenge.timeLimit * 0.5 && challenge.rewards.speedBonus) {
        bonuses.push({ label: 'Speed bonus', xp: challenge.rewards.speedBonus });
        totalXp += challenge.rewards.speedBonus;
      }

      if (challenge.mode === 'minimize' && challenge.targetBlocks && blocks.length <= challenge.targetBlocks && challenge.rewards.minimalBonus) {
        bonuses.push({ label: 'Minimal blocks bonus', xp: challenge.rewards.minimalBonus });
        totalXp += challenge.rewards.minimalBonus;
      }
    }

    let badge: string | undefined;
    if (passed && challenge.mode === 'minimize' && blocks.length <= 3 && currentScore >= 90) {
      badge = 'Minimalist';
    } else if (passed && challenge.mode === 'maximize' && currentScore >= 98) {
      badge = 'Maximizer';
    }

    return {
      passed,
      score: currentScore,
      blocksUsed: blocks.length,
      timeSpent,
      stars,
      xpEarned: totalXp,
      bonuses,
      badge,
    };
  };

  const handleSubmit = () => {
    const challengeResult = calculateResult();
    setResult(challengeResult);
    
    if (challengeResult.score > bestAttempt) {
      setBestAttempt(challengeResult.score);
    }

    if (challengeResult.passed) {
      addXp(challengeResult.xpEarned);
      
      completeChallenge(challenge.mode, {
        completed_at: new Date().toISOString(),
        score: challengeResult.score,
      });

      if (challengeResult.badge) {
        unlockBadge(challengeResult.badge);
        toast({
          title: '🏅 Badge Unlocked!',
          description: `You earned the ${challengeResult.badge} badge!`,
        });
      }

      onComplete(challengeResult);
    }

    setShowResult(true);
  };

  const handleRetry = () => {
    setShowResult(false);
    setBlocks([...challenge.startingBlocks]);
    setCurrentScore(calculateScore(challenge.startingBlocks));
    setAttempts(prev => prev + 1);
    if (challenge.timeLimit) {
      setTimeRemaining(challenge.timeLimit);
    }
  };

  const canSubmit = () => {
    if (currentScore < challenge.targetScore) return false;
    if (challenge.mode === 'minimize' && challenge.targetBlocks && blocks.length > challenge.targetBlocks) return false;
    if (challenge.mode === 'build' && challenge.requiredBlockTypes) {
      const blockTypes = blocks.map(b => b.type);
      const hasAllRequired = challenge.requiredBlockTypes.every(t => blockTypes.includes(t as BlockType));
      if (!hasAllRequired) return false;
    }
    return true;
  };

  const getRequirementStatus = () => {
    const requirements: { text: string; met: boolean }[] = [];

    requirements.push({
      text: `Score ${challenge.targetScore}+ (ปัจจุบัน: ${currentScore})`,
      met: currentScore >= challenge.targetScore,
    });

    if (challenge.mode === 'minimize' && challenge.targetBlocks) {
      requirements.push({
        text: `Blocks ≤ ${challenge.targetBlocks} (ปัจจุบัน: ${blocks.length})`,
        met: blocks.length <= challenge.targetBlocks,
      });
    }

    if (challenge.mode === 'build' && challenge.requiredBlockTypes) {
      const blockTypes = blocks.map(b => b.type);
      challenge.requiredBlockTypes.forEach(type => {
        requirements.push({
          text: `มี ${type} block`,
          met: blockTypes.includes(type as BlockType),
        });
      });
    }

    return requirements;
  };

  const modeColor = MODE_COLORS[challenge.mode];
  const attemptsRemaining = challenge.maxAttempts - attempts;

  return (
    <div className="fixed inset-0 z-50 bg-rootbeer overflow-auto">
      <ChallengeHeader
        challenge={challenge}
        currentScore={currentScore}
        attempts={attempts}
        timeRemaining={timeRemaining}
        onBack={onClose}
      />

      <ChallengeInstructions challenge={challenge} />

      {/* Main workspace */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto pb-24">
        {/* Blocks area */}
        <div className="flex-1">
          <div className={cn(
            'bg-oxford border-2 rounded-2xl p-6 min-h-[400px]',
            modeColor === 'turquoise' ? 'border-turquoise/30' : 'border-tennessee/30'
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                'text-lg font-semibold',
                modeColor === 'turquoise' ? 'text-turquoise' : 'text-tennessee'
              )}>
                Prompt Bar
              </h3>
              <span className="text-rackley text-sm">{blocks.length} Blocks</span>
            </div>

            {/* Blocks */}
            <div className="flex flex-wrap gap-4">
              {blocks.map((block, index) => (
                <ChallengeBlockCard
                  key={block.id}
                  block={block}
                  index={index}
                  canDelete={challenge.mode !== 'maximize'}
                  onEdit={handleEditBlock}
                  onDelete={challenge.mode !== 'maximize' ? handleDeleteBlock : undefined}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIndex === index}
                />
              ))}

              {blocks.length === 0 && (
                <div className="w-full text-center py-12 text-rackley">
                  <p className="mb-2">ยังไม่มี Block</p>
                  <p className="text-sm">เพิ่ม Block จาก Library ทางขวา</p>
                </div>
              )}
            </div>

            {(challenge.mode === 'maximize' || challenge.mode === 'build' || challenge.mode === 'fix') && (
              <Button
                onClick={() => setShowLibrary(!showLibrary)}
                variant="outline"
                className="mt-4 border-dashed border-rackley text-rackley hover:bg-rootbeer lg:hidden"
              >
                <Plus className="h-4 w-4 mr-2" />
                {showLibrary ? 'ซ่อน Library' : 'แสดง Library'}
              </Button>
            )}
          </div>

          {/* Requirements status */}
          <div className="bg-oxford rounded-xl p-4 mt-4">
            <h4 className="text-white font-medium mb-3">📋 ความต้องการ:</h4>
            <div className="space-y-2">
              {getRequirementStatus().map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <X className="h-4 w-4 text-tennessee" />
                  )}
                  <span className={req.met ? 'text-emerald-400' : 'text-tennessee'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Library sidebar */}
        {challenge.mode !== 'minimize' && (
          <div className={cn(
            'lg:w-80',
            !showLibrary && 'hidden lg:block'
          )}>
            <ChallengeBlockLibrary onAddBlock={handleAddBlock} />
          </div>
        )}
      </div>

      {/* Submit bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-oxford border-t border-rackley/30 p-4 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {!canSubmit() && (
            <div className="flex items-center gap-2 text-tennessee text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>ยังไม่ตรงเป้าหมาย</span>
            </div>
          )}

          <div className="flex gap-4 ml-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-rackley text-rackley hover:bg-rootbeer"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit}
              className={cn(
                'font-bold px-8 py-4',
                modeColor === 'turquoise' 
                  ? 'bg-turquoise text-oxford hover:bg-turquoise/90' 
                  : 'bg-tennessee text-white hover:bg-tennessee/90'
              )}
            >
              ส่งคำตอบ
            </Button>
          </div>
        </div>
      </div>

      {/* Result modal */}
      <ChallengeResult
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        result={result}
        challenge={challenge}
        attemptsRemaining={attemptsRemaining}
        bestAttempt={bestAttempt}
        onRetry={handleRetry}
        onNext={onClose}
        onBack={onClose}
      />
    </div>
  );
};
