import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { bugTypeInfo, type BugType } from '@/data/debuggerLevels';

interface BugTypeSelectorProps {
  selectedType: BugType | null;
  correctType: BugType;
  wrongAttempts: number;
  onSelect: (type: BugType) => void;
  isCorrect: boolean | null;
}

const bugTypes: BugType[] = [
  'vagueness',
  'missing_context',
  'conflicting',
  'wrong_scope',
  'format_mismatch',
  'tone_issues',
  'assumption_error',
  'hallucination',
];

export const BugTypeSelector: React.FC<BugTypeSelectorProps> = ({
  selectedType,
  correctType,
  wrongAttempts,
  onSelect,
  isCorrect,
}) => {
  const [shakeId, setShakeId] = React.useState<BugType | null>(null);

  const handleSelect = (type: BugType) => {
    if (isCorrect) return; // Already correct, don't allow changes
    
    onSelect(type);
    
    if (type !== correctType) {
      setShakeId(type);
      setTimeout(() => setShakeId(null), 300);
    }
  };

  return (
    <div className="bg-card shadow-xl rounded-xl p-4 border border-tennessee/20">
      <p className="text-sm font-semibold text-foreground mb-3">ปัญหานี้คืออะไร?</p>
      
      <div className="grid grid-cols-2 gap-2">
        {bugTypes.map((type) => {
          const info = bugTypeInfo[type];
          const isSelected = selectedType === type;
          const isCorrectAnswer = isCorrect && type === correctType;
          const isWrongAnswer = isSelected && !isCorrect && selectedType !== null;
          const isShaking = shakeId === type;

          return (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              disabled={isCorrect === true}
              className={cn(
                'flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-left transition-all',
                'border border-transparent',
                // Default
                !isSelected && !isCorrectAnswer && 'bg-muted/50 text-muted-foreground hover:bg-muted',
                // Selected but not yet verified
                isSelected && isCorrect === null && 'bg-tennessee text-white',
                // Correct answer
                isCorrectAnswer && 'bg-green-100 text-green-700 border-green-300',
                // Wrong answer
                isWrongAnswer && 'bg-red-100 text-red-700 border-red-300',
                // Shake animation
                isShaking && 'animate-shake',
              )}
            >
              <span className="text-base">{info.icon}</span>
              <span className="flex-1 truncate">{info.label}</span>
              {isCorrectAnswer && <Check className="w-4 h-4 text-green-600" />}
            </button>
          );
        })}
      </div>

      {/* Attempts remaining hint */}
      {wrongAttempts > 0 && !isCorrect && (
        <p className="text-xs text-muted-foreground mt-2">
          {wrongAttempts >= 2 ? 'คำตอบถูกต้อง: ' + bugTypeInfo[correctType].label : `เหลืออีก ${2 - wrongAttempts} ครั้ง`}
        </p>
      )}
    </div>
  );
};
