import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  id,
  checked,
  onChange,
  error = false,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-[10px] border transition-all duration-200",
        "bg-rootbeer/30 border-rackley/20",
        error && "border-destructive"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-0.5",
          checked
            ? "bg-turquoise border-turquoise"
            : "bg-transparent border-rackley hover:border-turquoise/70"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-oxford" strokeWidth={3} />}
      </button>
      <label
        htmlFor={id}
        className="text-sm text-gray-200/85 leading-relaxed cursor-pointer select-none"
      >
        {children}
      </label>
    </div>
  );
};
