import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-screen flex-col items-center justify-center bg-background gap-6"
  >
    {/* Logo */}
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-4xl">🎓</span>
        <h1 className="text-3xl font-bold text-accent">AIM Academy</h1>
      </div>
      <p className="text-muted-foreground text-sm">AI Learning Gamification</p>
    </motion.div>
    
    {/* Spinner */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <LoadingSpinner size="lg" />
    </motion.div>
    
    {/* Loading text */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-muted-foreground text-sm"
    >
      กำลังโหลด...
    </motion.p>
  </motion.div>
);

// Button Loading State
export const ButtonSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);

// Inline Loading
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'กำลังโหลด...' }) => (
  <div className="flex items-center gap-2 text-muted-foreground text-sm">
    <LoadingSpinner size="sm" />
    <span>{text}</span>
  </div>
);

// Card Loading Overlay
export const CardLoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-inherit z-10">
    <LoadingSpinner size="md" />
  </div>
);
