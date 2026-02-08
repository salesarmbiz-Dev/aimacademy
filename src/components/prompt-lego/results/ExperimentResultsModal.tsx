import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RotateCcw, RefreshCw, Save, ArrowRight, Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/contexts/ProgressContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Scoreboard from './Scoreboard';
import OutputComparisonSection from './OutputComparison';
import ChangesSummary, { Change } from './ChangesSummary';
import ImpactAnalysis from './ImpactAnalysis';
import InsightsSection, { DiscoveredInsight } from './InsightsSection';
import XPCelebration from './XPCelebration';
import { PromptBlock } from '../types';

interface ExperimentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain: () => void;
  onReset: () => void;
  originalBlocks: PromptBlock[];
  modifiedBlocks: PromptBlock[];
  originalScore: number;
  modifiedScore: number;
  experimentNumber: number;
}

// Mock output generator
const generateMockOutput = (blocks: PromptBlock[], score: number) => {
  const hasRole = blocks.some(b => b.type === 'ROLE');
  const hasTone = blocks.some(b => b.type === 'TONE');

  if (score >= 85) {
    return {
      text: `สวัสดีครับคุณ [ชื่อ]

ผมเข้าใจว่าคุณกำลังพิจารณาอยู่ และอยากจะช่วยให้คุณตัดสินใจได้ง่ายขึ้นครับ

จากที่คุณสนใจ [สินค้า/บริการ] ผมขอเสนอข้อมูลเพิ่มเติมที่อาจเป็นประโยชน์:

✅ ลูกค้า 89% บอกว่าคุ้มค่ากว่าที่คิด
✅ มีทดลองใช้ฟรี 14 วัน ไม่ผูกมัด
✅ ยกเลิกได้ทุกเมื่อ ไม่มีค่าใช้จ่ายซ่อน

ถ้าสะดวก ผมขอนัดคุยสั้นๆ 15 นาทีได้ไหมครับ? แค่ตอบอีเมลนี้พร้อมเวลาที่สะดวก ผมจะโทรหาเลยครับ

รอคอยการตอบกลับครับ
[ชื่อผู้ส่ง]`,
      metrics: { tone: 90, engagement: 92, clarity: 88 }
    };
  } else if (score >= 60) {
    return {
      text: `สวัสดีครับ

ขอเสนอข้อมูลสินค้าของเรา มีหลายรุ่นให้เลือก ราคาเหมาะสม

สินค้าของเรามีคุณภาพดี มีลูกค้าหลายคนใช้แล้วพอใจ

ถ้าสนใจสามารถติดต่อกลับมาได้ครับ

ขอบคุณครับ`,
      metrics: { tone: 70, engagement: 68, clarity: 72 }
    };
  } else {
    return {
      text: `สวัสดีครับ

ขอเสนอสินค้าของเรา มีหลายรุ่นให้เลือก ราคาเริ่มต้น...

สินค้าของเรามีคุณภาพดี หลายคนใช้แล้วชอบ

ถ้าสนใจก็ติดต่อมาได้ครับ

ขอบคุณครับ`,
      metrics: { tone: 55, engagement: 58, clarity: 62 }
    };
  }
};

const ExperimentResultsModal: React.FC<ExperimentResultsModalProps> = ({
  isOpen,
  onClose,
  onTryAgain,
  onReset,
  originalBlocks,
  modifiedBlocks,
  originalScore,
  modifiedScore,
  experimentNumber,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveExperiment, addInsight } = useProgress();
  const { stats, addXp } = useUser();
  const { user } = useAuth();

  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const [experimentSaved, setExperimentSaved] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate changes
  const changes: Change[] = [];
  
  originalBlocks.forEach(ob => {
    const found = modifiedBlocks.find(mb => mb.id === ob.id);
    if (!found) {
      changes.push({
        type: 'removed',
        blockType: ob.type,
        content: ob.content,
        impact: ob.impact,
      });
    } else if (found.content !== ob.content) {
      changes.push({
        type: 'modified',
        blockType: ob.type,
        content: found.content,
        oldContent: ob.content,
        impact: -8,
      });
    }
  });

  modifiedBlocks.forEach(mb => {
    if (!originalBlocks.find(ob => ob.id === mb.id)) {
      changes.push({
        type: 'added',
        blockType: mb.type,
        content: mb.content,
        impact: mb.type === 'EXAMPLE' ? 4 : 0,
      });
    }
  });

  // Generate outputs
  const originalOutput = generateMockOutput(originalBlocks, originalScore);
  const modifiedOutput = generateMockOutput(modifiedBlocks, modifiedScore);

  // Calculate impacts
  const impacts = originalBlocks.map(b => ({
    blockType: b.type,
    impact: b.impact,
    isRemoved: !modifiedBlocks.find(mb => mb.type === b.type),
  }));

  // Generate insights
  const discoveredInsights: DiscoveredInsight[] = [];
  const removedBlocks = originalBlocks.filter(ob => !modifiedBlocks.find(mb => mb.type === ob.type));
  
  removedBlocks.forEach(block => {
    if (block.priority === 'critical') {
      discoveredInsights.push({
        id: `insight-${block.type.toLowerCase()}-${Date.now()}`,
        blockType: block.type,
        title: `${block.type} คือ Block ที่สำคัญที่สุด`,
        description: `ลบแล้วเสีย ${block.impact} points เพราะ Output ขาดทิศทางและความน่าเชื่อถือ`,
        xp: 30,
        isNew: true,
      });
    }
  });

  const keyInsight = removedBlocks.length > 0
    ? `${removedBlocks[0].type} คือ Block ที่สำคัญ ลบออก = Output ขาดทิศทางและความน่าเชื่อถือ`
    : 'การทดลองนี้ช่วยให้เข้าใจโครงสร้างของ Prompt ดีขึ้น';

  // XP Rewards
  const xpRewards = [
    { label: 'Experiment completed', xp: 15 },
    ...(discoveredInsights.length > 0 ? [{ label: 'Insight discovered', xp: 30 }] : []),
    ...(removedBlocks.some(b => b.type === 'ROLE') ? [{ label: 'First time removing ROLE', xp: 20 }] : []),
  ];

  const handleSaveInsight = (insight: DiscoveredInsight) => {
    addInsight({
      content: insight.title + ' - ' + insight.description,
      discovered_at: new Date().toISOString(),
    });
    addXp(insight.xp);
    setSavedInsights(prev => [...prev, insight.id]);
    toast({
      title: '💡 เพิ่ม Insight ใหม่แล้ว',
      description: `+${insight.xp} XP`,
    });
  };

  const handleCopyTemplate = async () => {
    const templateText = modifiedBlocks
      .map(block => `[${block.type}]\n${block.content}`)
      .join('\n\n') + '\n\n— Built with AIM Academy: Prompt Lego';
    
    try {
      await navigator.clipboard.writeText(templateText);
      setTemplateCopied(true);
      toast({ title: '📋 Copy Template แล้ว!' });
      setTimeout(() => setTemplateCopied(false), 2000);
    } catch {
      toast({ title: '❌ Copy ไม่สำเร็จ', variant: 'destructive' });
    }
  };

  const handleCopyFullPrompt = async () => {
    const fullPrompt = modifiedBlocks.map(b => b.content).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setPromptCopied(true);
      toast({ title: '📝 Copy Prompt แล้ว — วางใน ChatGPT ได้เลย!' });
      setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      toast({ title: '❌ Copy ไม่สำเร็จ', variant: 'destructive' });
    }
  };

  const handleSaveTemplate = async () => {
    if (!user) {
      toast({ title: '❌ กรุณาเข้าสู่ระบบก่อน', variant: 'destructive' });
      return;
    }

    const fullPrompt = modifiedBlocks.map(b => b.content).join('\n\n');
    
    const contentJson = {
      blocks: modifiedBlocks.map(b => ({
        type: b.type,
        content: b.content,
        impact: b.impact,
        priority: b.priority,
      })),
      full_prompt: fullPrompt,
      original_score: originalScore,
      modified_score: modifiedScore,
      changes: changes.map(c => ({
        type: c.type,
        blockType: c.blockType,
        content: c.content,
        impact: c.impact,
      })),
      output_preview: modifiedOutput.text,
      output_metrics: modifiedOutput.metrics,
    };
    
    const blockTypes = modifiedBlocks.map(b => b.type).join(' + ');
    const title = `Prompt Template: ${blockTypes}`;
    
    const { error } = await supabase.from('user_assets').insert({
      user_id: user.id,
      title: title,
      description: `Experiment #${experimentNumber} — Score: ${modifiedScore}/100`,
      content_json: contentJson,
      source_game: 'prompt-lego',
      quality_score: modifiedScore,
      tags: modifiedBlocks.map(b => b.type.toLowerCase()),
      category: 'prompt' as const,
    });
    
    if (!error) {
      setTemplateSaved(true);
      toast({ title: '💾 บันทึก Template แล้ว!', description: 'ดูได้ใน Asset Library' });
    } else {
      toast({ title: '❌ บันทึกไม่สำเร็จ', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveExperiment = async () => {
    const promptString = modifiedBlocks.map(b => b.content).join(' ');
    saveExperiment({
      prompt: promptString,
      result: `Score: ${modifiedScore}/100 (Original: ${originalScore})`,
      timestamp: new Date().toISOString(),
    });
    
    // Also save to Supabase if logged in and not already saved
    if (user && !templateSaved) {
      await handleSaveTemplate();
    }
    
    setExperimentSaved(true);
    toast({
      title: '✓ บันทึกการทดลองแล้ว',
      description: 'คุณสามารถดูประวัติได้ในหน้า Profile',
    });
  };

  const handleGoToChallenges = () => {
    onClose();
    navigate('/challenges');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-root-beer/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground text-2xl font-bold">🧪 ผลการทดลอง</h2>
              <p className="text-rackley text-sm">Experiment #{experimentNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-rackley hover:text-foreground p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scoreboard */}
          <Scoreboard originalScore={originalScore} modifiedScore={modifiedScore} />

          {/* Output Comparison */}
          <OutputComparisonSection
            originalOutput={originalOutput.text}
            modifiedOutput={modifiedOutput.text}
            originalScore={originalScore}
            modifiedScore={modifiedScore}
            originalMetrics={originalOutput.metrics}
            modifiedMetrics={modifiedOutput.metrics}
          />

          {/* Changes Summary */}
          <ChangesSummary changes={changes} />

          {/* Impact Analysis */}
          <ImpactAnalysis impacts={impacts} keyInsight={keyInsight} />

          {/* Insights */}
          <InsightsSection
            insights={discoveredInsights}
            onSaveInsight={handleSaveInsight}
            savedInsights={savedInsights}
          />

          {/* Prompt Template Section */}
          <div className="mt-8 bg-card border-2 border-primary/30 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary/10 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧩</span>
                <span className="text-foreground font-semibold">YOUR PROMPT TEMPLATE</span>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                modifiedScore >= 85 ? 'bg-accent/20 text-accent' :
                modifiedScore >= 60 ? 'bg-primary/20 text-primary' :
                'bg-destructive/20 text-destructive'
              }`}>
                Score: {modifiedScore}/100
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Assembled Template with block labels */}
              <div className="space-y-3">
                {modifiedBlocks.map((block, index) => (
                  <div key={block.id || index} className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-mono rounded shrink-0">
                      {block.type}
                    </span>
                    <p className="text-foreground text-sm leading-relaxed flex-1">
                      {block.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-muted-foreground/20" />

              {/* Full Prompt Text */}
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">
                  📝 FULL PROMPT (Ready to use)
                </p>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-mono">
                  {modifiedBlocks.map(b => b.content).join('\n\n')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 text-accent text-sm font-medium rounded-xl hover:bg-accent/20 transition-colors"
                  aria-label="Copy Template พร้อม block labels"
                >
                  <Copy className="h-4 w-4" />
                  {templateCopied ? '✅ Copied!' : '📋 Copy Template'}
                </button>

                <button
                  onClick={handleCopyFullPrompt}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors"
                  aria-label="Copy Prompt พร้อมใช้งาน"
                >
                  <FileText className="h-4 w-4" />
                  {promptCopied ? '✅ Copied!' : '📝 Copy Prompt (ใช้ได้เลย)'}
                </button>

                {user && (
                  <button
                    onClick={handleSaveTemplate}
                    disabled={templateSaved}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      templateSaved
                        ? 'bg-accent/20 text-accent cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                    aria-label="บันทึก Template ลง Asset Library"
                  >
                    <Save className="h-4 w-4" />
                    {templateSaved ? '✅ Saved' : '💾 Save to Library'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* XP Celebration */}
          <XPCelebration
            rewards={xpRewards}
            currentXp={stats.currentXp}
            totalXpForNextLevel={stats.totalXpForNextLevel}
            currentLevel={stats.level}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-rackley/30">
            <button
              onClick={onTryAgain}
              className="flex items-center gap-2 px-5 py-3 bg-card border-2 border-rackley text-foreground rounded-xl hover:bg-rackley/10 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              ลองใหม่
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-2 px-5 py-3 bg-card border-2 border-rackley text-rackley rounded-xl hover:bg-rackley/10 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              เริ่มใหม่ทั้งหมด
            </button>

            <button
              onClick={handleSaveExperiment}
              disabled={experimentSaved}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors ${
                experimentSaved
                  ? 'bg-turquoise/20 text-turquoise cursor-not-allowed'
                  : 'bg-turquoise text-oxford-blue hover:opacity-90'
              }`}
            >
              <Save className="h-5 w-5" />
              {experimentSaved ? 'บันทึกแล้ว' : 'บันทึกการทดลอง'}
            </button>

            <button
              onClick={handleGoToChallenges}
              className="flex items-center gap-2 px-8 py-3 bg-tennessee text-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              ไปทำ Challenge
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentResultsModal;
