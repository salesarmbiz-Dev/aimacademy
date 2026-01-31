import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Skeleton Text
export const SkeletonText: React.FC<{ 
  className?: string; 
  width?: string;
  lines?: number;
}> = ({ className, width = '100%', lines = 1 }) => (
  <div className={cn('space-y-2', className)}>
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded"
        style={{ width: i === lines - 1 && lines > 1 ? '70%' : width }}
      />
    ))}
  </div>
);

// Skeleton Avatar
export const SkeletonAvatar: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={cn('skeleton rounded-full', sizes[size], className)} />
  );
};

// Skeleton Card
export const SkeletonCard: React.FC<{ 
  className?: string;
  hasAvatar?: boolean;
  lines?: number;
}> = ({ className, hasAvatar = false, lines = 3 }) => (
  <div className={cn('bg-secondary rounded-xl p-5 space-y-4', className)}>
    {hasAvatar && (
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </div>
      </div>
    )}
    <SkeletonText lines={lines} />
  </div>
);

// Skeleton Button
export const SkeletonButton: React.FC<{ 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-32',
    lg: 'h-12 w-40'
  };

  return (
    <div className={cn('skeleton rounded-lg', sizes[size], className)} />
  );
};

// Skeleton Stats Grid
export const SkeletonStats: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-secondary rounded-xl p-5 space-y-3">
        <div className="skeleton w-8 h-8 rounded" />
        <SkeletonText width="50%" />
        <SkeletonText width="70%" />
      </div>
    ))}
  </div>
);

// Skeleton Table
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-secondary rounded-xl overflow-hidden">
    <div className="bg-background p-4">
      <SkeletonText width="100%" />
    </div>
    <div className="divide-y divide-muted-foreground/20">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <SkeletonAvatar size="sm" />
          <SkeletonText className="flex-1" />
          <SkeletonText width="80px" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton Podium
export const SkeletonPodium: React.FC = () => (
  <div className="bg-secondary rounded-3xl p-10">
    <SkeletonText width="200px" className="mx-auto mb-8" />
    <div className="flex justify-center items-end gap-4">
      {[140, 180, 100].map((height, i) => (
        <div key={i} className="flex flex-col items-center">
          <SkeletonAvatar size="lg" className="mb-2" />
          <div 
            className="skeleton rounded-t-xl"
            style={{ width: i === 1 ? 160 : 140, height }}
          />
        </div>
      ))}
    </div>
  </div>
);

// Page Transition Wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Stagger Container
export const StaggerContainer: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className, staggerDelay = 0.05 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
  >
    {children}
  </motion.div>
);

// Stagger Item
export const StaggerItem: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    {children}
  </motion.div>
);
