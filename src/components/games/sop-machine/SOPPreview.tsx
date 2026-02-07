import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Pencil, Save, X, CheckSquare } from 'lucide-react';
import type { GeneratedSOP, SOPSection } from './types';

interface SOPPreviewProps {
  sop: GeneratedSOP;
  editedSections: Record<number, string>;
  editingSectionIndex: number | null;
  onStartEdit: (index: number) => void;
  onSaveEdit: (index: number, content: string) => void;
  onCancelEdit: () => void;
}

export const SOPPreview: React.FC<SOPPreviewProps> = ({
  sop,
  editedSections,
  editingSectionIndex,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});
  const [editValue, setEditValue] = useState('');

  const toggleSection = (index: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStartEdit = (index: number, content: string) => {
    setEditValue(content);
    onStartEdit(index);
  };

  const handleSave = (index: number) => {
    onSaveEdit(index, editValue);
    setEditValue('');
  };

  const getSectionContent = (section: SOPSection, index: number): string => {
    if (editedSections[index]) return editedSections[index];
    if (section.content) return section.content;
    if (section.items) return section.items.join('\n');
    if (section.steps) {
      return section.steps.map(s => `${s.step}\n${s.tasks.map(t => `  • ${t}`).join('\n')}`).join('\n\n');
    }
    return '';
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-foreground text-background p-6 md:p-8">
        <div className="flex items-center gap-2 text-sm opacity-60 mb-2">
          <span>📋</span>
          <span>{sop.department}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-4">{sop.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="opacity-60">Version</p>
            <p className="font-medium">{sop.version}</p>
          </div>
          <div>
            <p className="opacity-60">Effective Date</p>
            <p className="font-medium">{sop.effectiveDate}</p>
          </div>
          <div>
            <p className="opacity-60">Department</p>
            <p className="font-medium">{sop.department}</p>
          </div>
          <div>
            <p className="opacity-60">Owner</p>
            <p className="font-medium">{sop.owner}</p>
          </div>
        </div>
        <p className="text-xs opacity-40 mt-4">สร้างโดย AIM Academy SOP Machine</p>
      </div>

      {/* Sections */}
      <div className="divide-y divide-border">
        {sop.sections.map((section, index) => (
          <div key={index} className="group">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/50 transition-colors"
            >
              <h2 className="text-lg font-bold text-foreground text-left">
                {section.title}
              </h2>
              <div className="flex items-center gap-2">
                {editingSectionIndex !== index && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(index, getSectionContent(section, index));
                    }}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </span>
                )}
                {collapsedSections[index] ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Section Content */}
            {!collapsedSections[index] && (
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                {editingSectionIndex === index ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="min-h-[150px] font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(index)}
                        className="flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        บันทึก
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onCancelEdit}
                        className="flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        ยกเลิก
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {section.content && (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {editedSections[index] || section.content}
                      </p>
                    )}

                    {section.steps && (
                      <div className="space-y-4">
                        {section.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="bg-muted/30 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-foreground">
                                {step.step}
                              </h3>
                              <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  {step.responsible}
                                </span>
                                <span className="px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                  {step.timeline}
                                </span>
                              </div>
                            </div>
                            <ul className="space-y-1">
                              {step.tasks.map((task, taskIndex) => (
                                <li
                                  key={taskIndex}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-primary mt-0.5">•</span>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.items && (
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckSquare className="w-4 h-4 text-primary" />
                            {item.replace('☐ ', '')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
