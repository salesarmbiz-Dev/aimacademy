import React from 'react';
import { cn } from '@/lib/utils';
import { X, Copy, Download, Trash2, Wand2, FileCheck, Eye, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { UserAsset } from './types';
import { categoryConfig, sourceGameLabels } from './types';

interface AssetDetailPanelProps {
  asset: UserAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const AssetDetailPanel: React.FC<AssetDetailPanelProps> = ({
  asset,
  isOpen,
  onClose,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<number, boolean>>({});

  if (!asset) return null;

  const config = categoryConfig[asset.category];
  const formattedDate = new Date(asset.created_at).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderContent = () => {
    const content = asset.content_json as Record<string, unknown>;

    if (asset.category === 'prompt') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Prompt:</h4>
            <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
              {(content.prompt_text as string) || (content.prompt as string) || JSON.stringify(content, null, 2)}
            </div>
          </div>
          {content.components && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Components:</h4>
              <div className="space-y-2">
                {Object.entries(content.components as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                      {key}
                    </span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (asset.category === 'sop') {
      const sections = (content.sections as Array<{
        title: string;
        content?: string;
        steps?: Array<{ step: string; tasks: string[]; responsible: string; timeline: string }>;
        items?: string[];
      }>) || [];

      return (
        <div className="space-y-3">
          {/* SOP Header */}
          <div className="bg-foreground text-background rounded-xl p-4">
            <p className="text-xs opacity-60 mb-1">{content.department as string}</p>
            <h3 className="font-bold">{content.title as string || asset.title}</h3>
            <div className="flex gap-4 mt-2 text-xs opacity-80">
              <span>v{content.version as string || '1.0'}</span>
              <span>{content.effectiveDate as string}</span>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={index} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-sm">{section.title}</span>
                {expandedSections[index] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSections[index] && (
                <div className="px-3 pb-3 text-sm">
                  {section.content && (
                    <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
                  )}
                  {section.steps && section.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="bg-muted/30 rounded-lg p-3 mt-2">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">{step.step}</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {step.responsible}
                          </span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {step.timeline}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {section.items && (
                    <ul className="space-y-1 mt-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckSquare className="w-4 h-4 text-primary" />
                          {item.replace('☐ ', '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (asset.category === 'pattern') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Pattern:</h4>
            <p className="text-foreground">{asset.title}</p>
          </div>
          {content.before && (
            <div>
              <h4 className="text-sm font-medium text-destructive mb-2">❌ Before:</h4>
              <div className="bg-destructive/10 rounded-xl p-4 text-sm">
                {content.before as string}
              </div>
            </div>
          )}
          {content.after && (
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2">✅ After:</h4>
              <div className="bg-green-50 rounded-xl p-4 text-sm">
                {content.after as string}
              </div>
            </div>
          )}
          {content.insight && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">💡 Key Insight:</h4>
              <p className="text-sm text-foreground">{content.insight as string}</p>
            </div>
          )}
          {!content.before && !content.after && (
            <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(content, null, 2)}
            </div>
          )}
        </div>
      );
    }

    // Default: show JSON
    return (
      <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
        {JSON.stringify(content, null, 2)}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-xs font-medium rounded-full px-2 py-1', config.bgColor, config.color)}>
              {categoryConfig[asset.category].label}
            </span>
            {asset.quality_score && (
              <span className="text-xs text-muted-foreground">
                ⭐ {asset.quality_score}/100
              </span>
            )}
          </div>
          <SheetTitle className="text-left">{asset.title}</SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {formattedDate} • จาก {sourceGameLabels[asset.source_game] || asset.source_game}
          </p>
        </SheetHeader>

        {/* Content */}
        <div className="mb-24">
          {renderContent()}
        </div>

        {/* Actions - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex gap-2 sm:left-auto sm:w-full sm:max-w-lg">
          <Button onClick={onCopy} className="flex-1 gap-2">
            <Copy className="w-4 h-4" />
            Copy All
          </Button>
          <Button onClick={onDownload} variant="secondary" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={onDelete} variant="outline" className="text-destructive hover:text-destructive gap-2">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
