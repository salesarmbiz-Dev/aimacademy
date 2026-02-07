import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SOPQuestion } from '@/data/sopQuestions';

interface WizardStepProps {
  question: SOPQuestion;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentStep: number;
  totalSteps: number;
}

export const WizardStep: React.FC<WizardStepProps> = ({
  question,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  currentStep,
  totalSteps,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateAndNext = () => {
    if (question.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError('กรุณาตอบคำถามนี้');
        return;
      }
      if (question.minLength && typeof value === 'string' && value.length < question.minLength) {
        setError(`กรุณากรอกอย่างน้อย ${question.minLength} ตัวอักษร`);
        return;
      }
    }
    setError(null);
    onNext();
  };

  const handleMultiSelect = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v: string) => v !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
    setError(null);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null);
            }}
            placeholder={question.placeholder}
            className="text-lg py-6"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null);
            }}
            placeholder={question.placeholder}
            className="min-h-[120px] text-base"
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => {
              onChange(val);
              setError(null);
            }}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all',
                  value === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => {
                  onChange(option.value);
                  setError(null);
                }}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiselect':
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleMultiSelect(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-xl border transition-all text-sm font-medium',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          คำถามที่ {currentStep + 1} จาก {totalSteps}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border">
        {/* Question */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {question.question}
          {!question.required && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (ไม่บังคับ)
            </span>
          )}
        </h2>

        {/* Helper Text */}
        <p className="text-muted-foreground mb-6">{question.helperText}</p>

        {/* Input */}
        <div className="mb-6">{renderInput()}</div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isFirst}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            ย้อนกลับ
          </Button>
          <Button
            onClick={validateAndNext}
            className="flex items-center gap-2"
          >
            {isLast ? 'สร้าง SOP' : 'ข้อถัดไป'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
