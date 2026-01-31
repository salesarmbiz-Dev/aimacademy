import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  fullPage = false,
}) => {
  const spinner = (
    <Loader2 
      className={cn(
        'animate-spin text-tennessee',
        sizeClasses[size],
        className
      )} 
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-rootbeer z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-rootbeer">
    <LoadingSpinner size="lg" />
  </div>
);
