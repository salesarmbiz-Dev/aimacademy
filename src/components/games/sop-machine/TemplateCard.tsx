import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { SOPTemplate } from '@/data/sopTemplates';

interface TemplateCardProps {
  template: SOPTemplate;
  isSelected: boolean;
  onClick: () => void;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative bg-card rounded-2xl p-6 text-left transition-all duration-300 border',
        'hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]',
        isSelected
          ? 'border-2 border-primary bg-primary/5 shadow-md'
          : 'border-border shadow-sm'
      )}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Recommended Badge */}
      {template.recommended && (
        <span className="absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
          แนะนำ
        </span>
      )}

      {/* Icon */}
      <div className="text-5xl mb-4 mt-2">{template.icon}</div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 pr-8">
        {template.titleTh}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {template.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            difficultyColors[template.difficulty]
          )}
        >
          {template.difficulty}
        </span>
        <span className="text-xs text-muted-foreground">
          ⏱ {template.estimatedTime}
        </span>
      </div>
    </button>
  );
};
