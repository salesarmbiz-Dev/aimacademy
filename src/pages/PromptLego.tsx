import React, { useState } from 'react';
import { HelpCircle, Plus, RotateCcw, Sparkles, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useUser } from '@/contexts/UserContext';
import ScoreBar from '@/components/prompt-lego/ScoreBar';
import BlockCard from '@/components/prompt-lego/BlockCard';
import BlockLibrary from '@/components/prompt-lego/BlockLibrary';
import InstructionsPanel from '@/components/prompt-lego/InstructionsPanel';
import { EditBlockModal, AddBlockModal, DeleteConfirmModal } from '@/components/prompt-lego/Modals';
import ExperimentResultsModal from '@/components/prompt-lego/results/ExperimentResultsModal';
import {
  PromptBlock,
  BlockType,
  MOCK_PROMPTS,
  BLOCK_PRIORITIES,
  calculateScore,
} from '@/components/prompt-lego/types';

const PromptLego: React.FC = () => {
  const { getStats } = useProgress();
  const progressStats = getStats();

  // State
  const [selectedPromptId, setSelectedPromptId] = useState(MOCK_PROMPTS[0].id);
  const [currentBlocks, setCurrentBlocks] = useState<PromptBlock[]>([...MOCK_PROMPTS[0].blocks]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showOriginalPrompt, setShowOriginalPrompt] = useState(false);
  const [showLibrary, setShowLibrary] = useState(true);
  const [draggedBlock, setDraggedBlock] = useState<PromptBlock | null>(null);

  // Modal states
  const [editingBlock, setEditingBlock] = useState<PromptBlock | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<PromptBlock | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const selectedPrompt = MOCK_PROMPTS.find(p => p.id === selectedPromptId) || MOCK_PROMPTS[0];
  const currentScore = calculateScore(currentBlocks);
  const hasChanges = JSON.stringify(currentBlocks) !== JSON.stringify(selectedPrompt.blocks);

  // Handlers
  const handlePromptChange = (promptId: string) => {
    const prompt = MOCK_PROMPTS.find(p => p.id === promptId);
    if (prompt) {
      setSelectedPromptId(promptId);
      setCurrentBlocks([...prompt.blocks]);
    }
  };

  const handleReset = () => {
    setCurrentBlocks([...selectedPrompt.blocks]);
  };

  const handleDeleteBlock = (block: PromptBlock) => {
    setDeletingBlock(block);
  };

  const confirmDelete = () => {
    if (deletingBlock) {
      setCurrentBlocks(prev => prev.filter(b => b.id !== deletingBlock.id));
      setDeletingBlock(null);
    }
  };

  const handleEditBlock = (block: PromptBlock) => {
    setEditingBlock(block);
  };

  const handleSaveEdit = (updatedBlock: PromptBlock) => {
    setCurrentBlocks(prev =>
      prev.map(b => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  };

  const handleAddBlock = (type: BlockType, content: string) => {
    const newBlock: PromptBlock = {
      id: `block-${Date.now()}`,
      type,
      content,
      priority: BLOCK_PRIORITIES[type],
      impact: type === 'ROLE' ? -34 : type === 'TASK' ? -22 : -14,
    };
    setCurrentBlocks(prev => [...prev, newBlock]);
  };

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, block: PromptBlock) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBlock: PromptBlock) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock.id === targetBlock.id) return;

    setCurrentBlocks(prev => {
      const newBlocks = [...prev];
      const draggedIndex = newBlocks.findIndex(b => b.id === draggedBlock.id);
      const targetIndex = newBlocks.findIndex(b => b.id === targetBlock.id);

      newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, draggedBlock);

      return newBlocks;
    });
    setDraggedBlock(null);
  };

  const handleGenerate = () => {
    setShowResultsModal(true);
  };

  const handleResultsClose = () => {
    setShowResultsModal(false);
  };

  const handleTryAgain = () => {
    setShowResultsModal(false);
  };

  const handleResetFromResults = () => {
    setCurrentBlocks([...selectedPrompt.blocks]);
    setShowResultsModal(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Prompt Lego</h1>
            <p className="text-rackley text-sm">ถอด Prompt ออกเป็นชิ้นๆ แล้วลองเล่นกับมัน</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-rackley text-sm hidden md:inline">เลือก Prompt:</span>
              <select
                value={selectedPromptId}
                onChange={(e) => handlePromptChange(e.target.value)}
                className="bg-card border border-rackley/30 text-foreground text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-turquoise"
              >
                {MOCK_PROMPTS.map(prompt => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 text-rackley hover:text-turquoise transition-colors"
              title="วิธีใช้งาน"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="md:hidden p-2 text-rackley hover:text-turquoise transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <InstructionsPanel isOpen={showInstructions} onClose={() => setShowInstructions(false)} />

        {/* Score Bar */}
        <ScoreBar originalScore={selectedPrompt.originalScore} currentScore={currentScore} />

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Workspace - 2/3 width */}
          <div className="md:col-span-2">
            {/* Original Prompt (Collapsible) */}
            <div className="bg-card/50 border border-dashed border-rackley rounded-lg p-4 mb-4">
              <button
                onClick={() => setShowOriginalPrompt(!showOriginalPrompt)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-rackley text-sm font-medium">📝 Prompt ต้นฉบับ</span>
                {showOriginalPrompt ? (
                  <ChevronUp className="h-4 w-4 text-rackley" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-rackley" />
                )}
              </button>
              {showOriginalPrompt && (
                <p className="text-foreground text-sm font-mono mt-3 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedPrompt.originalPrompt}
                </p>
              )}
            </div>

            {/* Prompt Bar (Block Container) */}
            <div className="bg-card border-2 border-turquoise/30 rounded-2xl p-6 min-h-[300px]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-turquoise text-lg font-semibold">Prompt Bar</h2>
                <span className="text-rackley text-sm">{currentBlocks.length} Blocks</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {currentBlocks.map(block => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    onEdit={handleEditBlock}
                    onDelete={handleDeleteBlock}
                    isDragging={draggedBlock?.id === block.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}

                {currentBlocks.length === 0 && (
                  <div className="w-full text-center py-12">
                    <p className="text-rackley">ไม่มี Block ใน Prompt Bar</p>
                    <p className="text-rackley text-sm mt-1">เพิ่ม Block จาก Library หรือกดปุ่ม "เพิ่ม Block"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-card border-2 border-rackley text-foreground rounded-xl hover:bg-rackley/10 transition-colors"
              >
                <Plus className="h-5 w-5" />
                เพิ่ม Block
              </button>

              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-5 py-3 bg-card border-2 border-rackley text-rackley rounded-xl hover:bg-rackley/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-5 w-5" />
                รีเซ็ต
              </button>

              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-8 py-3 bg-tennessee text-foreground font-semibold rounded-xl hover:scale-102 hover:shadow-lg hover:shadow-tennessee/30 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Generate และเปรียบเทียบ
              </button>
            </div>
          </div>

          {/* Library Sidebar - 1/3 width */}
          <div className={`${showLibrary ? 'block' : 'hidden'} md:block`}>
            <BlockLibrary
              onAddBlock={handleAddBlock}
              isOpen={showLibrary}
              onClose={() => setShowLibrary(false)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditBlockModal
        block={editingBlock}
        isOpen={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveEdit}
      />

      <AddBlockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddBlock}
      />

      <DeleteConfirmModal
        block={deletingBlock}
        isOpen={!!deletingBlock}
        onClose={() => setDeletingBlock(null)}
        onConfirm={confirmDelete}
      />

      <ExperimentResultsModal
        isOpen={showResultsModal}
        onClose={handleResultsClose}
        onTryAgain={handleTryAgain}
        onReset={handleResetFromResults}
        originalBlocks={selectedPrompt.blocks}
        modifiedBlocks={currentBlocks}
        originalScore={selectedPrompt.originalScore}
        modifiedScore={currentScore}
        experimentNumber={progressStats.totalExperiments + 1}
      />
    </div>
  );
};

export default PromptLego;
