import React, { useState } from 'react';
import { Smile, Heart, Eye, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputMetrics {
  tone: number;
  engagement: number;
  clarity: number;
}

interface OutputComparisonProps {
  originalOutput: string;
  modifiedOutput: string;
  originalScore: number;
  modifiedScore: number;
  originalMetrics: OutputMetrics;
  modifiedMetrics: OutputMetrics;
}

const MetricBar: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => {
  const color = value >= 80 ? 'bg-turquoise' : value >= 60 ? 'bg-tennessee' : 'bg-red-500';
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-rackley">{icon}</span>
      <span className="text-rackley text-xs w-20">{label}</span>
      <div className="flex-1 h-2 bg-root-beer rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${value >= 80 ? 'text-turquoise' : value >= 60 ? 'text-tennessee' : 'text-red-500'}`}>
        {value}%
      </span>
    </div>
  );
};

const OutputComparisonSection: React.FC<OutputComparisonProps> = ({
  originalOutput,
  modifiedOutput,
  originalScore,
  modifiedScore,
  originalMetrics,
  modifiedMetrics,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedModified, setCopiedModified] = useState(false);
  const { toast } = useToast();

  const handleCopyOutput = async (output: string, type: 'original' | 'modified') => {
    try {
      await navigator.clipboard.writeText(output);
      if (type === 'original') {
        setCopiedOriginal(true);
        setTimeout(() => setCopiedOriginal(false), 2000);
      } else {
        setCopiedModified(true);
        setTimeout(() => setCopiedModified(false), 2000);
      }
      toast({ title: '📋 Copy Output แล้ว!' });
    } catch {
      toast({ title: '❌ Copy ไม่สำเร็จ', variant: 'destructive' });
    }
  };

  const getBorderColor = (score: number) => {
    if (score >= 90) return 'border-turquoise';
    if (score >= 70) return 'border-rackley';
    if (score >= 50) return 'border-tennessee';
    return 'border-red-500';
  };

  const getHeaderBg = (score: number) => {
    if (score >= 90) return 'bg-turquoise/10';
    if (score >= 70) return 'bg-rackley/10';
    if (score >= 50) return 'bg-tennessee/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground text-xl font-semibold">📝 เปรียบเทียบ Output</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-rackley text-sm hover:text-turquoise flex items-center gap-1"
        >
          {isExpanded ? 'ดูแบบย่อ' : 'ดูแบบเต็ม'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Output */}
        <div className={`bg-card border-2 ${getBorderColor(originalScore)} rounded-2xl overflow-hidden relative`}>
          <div className={`${getHeaderBg(originalScore)} px-4 py-3 flex items-center justify-between`}>
            <span className="text-turquoise font-semibold">Original Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyOutput(originalOutput, 'original')}
                className="text-rackley hover:text-turquoise p-1 rounded transition-colors"
                title="Copy Output"
                aria-label="Copy Original Output"
              >
                {copiedOriginal ? '✅' : <Copy className="h-4 w-4" />}
              </button>
              <span className="text-turquoise text-sm bg-turquoise/20 px-2 py-1 rounded">
                {originalScore}/100
              </span>
            </div>
          </div>
          <div className={`p-5 ${isExpanded ? '' : 'max-h-48'} overflow-y-auto`}>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {originalOutput}
            </p>
          </div>
          <div className="px-5 pb-5 space-y-2">
            <MetricBar label="Tone" value={originalMetrics.tone} icon={<Smile className="h-4 w-4" />} />
            <MetricBar label="Engagement" value={originalMetrics.engagement} icon={<Heart className="h-4 w-4" />} />
            <MetricBar label="Clarity" value={originalMetrics.clarity} icon={<Eye className="h-4 w-4" />} />
          </div>
        </div>

        {/* Modified Output */}
        <div className={`bg-card border-2 ${getBorderColor(modifiedScore)} rounded-2xl overflow-hidden relative`}>
          <div className={`${getHeaderBg(modifiedScore)} px-4 py-3 flex items-center justify-between`}>
            <span className={`font-semibold ${modifiedScore >= 70 ? 'text-foreground' : 'text-tennessee'}`}>
              Modified Output
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyOutput(modifiedOutput, 'modified')}
                className="text-rackley hover:text-turquoise p-1 rounded transition-colors"
                title="Copy Output"
                aria-label="Copy Modified Output"
              >
                {copiedModified ? '✅' : <Copy className="h-4 w-4" />}
              </button>
              <span className={`text-sm px-2 py-1 rounded ${
                modifiedScore >= 90 ? 'text-turquoise bg-turquoise/20' :
                modifiedScore >= 70 ? 'text-rackley bg-rackley/20' :
                modifiedScore >= 50 ? 'text-tennessee bg-tennessee/20' :
                'text-red-500 bg-red-500/20'
              }`}>
                {modifiedScore}/100
              </span>
            </div>
          </div>
          <div className={`p-5 ${isExpanded ? '' : 'max-h-48'} overflow-y-auto`}>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {modifiedOutput}
            </p>
          </div>
          <div className="px-5 pb-5 space-y-2">
            <MetricBar label="Tone" value={modifiedMetrics.tone} icon={<Smile className="h-4 w-4" />} />
            <MetricBar label="Engagement" value={modifiedMetrics.engagement} icon={<Heart className="h-4 w-4" />} />
            <MetricBar label="Clarity" value={modifiedMetrics.clarity} icon={<Eye className="h-4 w-4" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputComparisonSection;
