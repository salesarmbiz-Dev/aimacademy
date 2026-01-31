import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animated Counter Component
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, duration = 1, className, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const range = end - start;
    const increment = Math.ceil(range / (duration * 60));
    const stepTime = (duration * 1000) / (range / increment);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Pulse Dot (for notifications/status)
export const PulseDot: React.FC<{
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ color = 'bg-accent', size = 'md', className }) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <span className={cn('relative flex', className)}>
      <span className={cn(
        'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
        color
      )} />
      <span className={cn(
        'relative inline-flex rounded-full',
        color,
        sizes[size]
      )} />
    </span>
  );
};

// Shine Effect (for badges, cards)
export const ShineEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('relative overflow-hidden', className)}>
    {children}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
    />
  </div>
);

// Floating Animation Wrapper
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    animate={{ y: [-5, 5, -5] }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      ease: 'easeInOut',
      delay 
    }}
  >
    {children}
  </motion.div>
);

// Scale on Hover
export const ScaleOnHover: React.FC<{
  children: React.ReactNode;
  scale?: number;
  className?: string;
}> = ({ children, scale = 1.05, className }) => (
  <motion.div
    className={className}
    whileHover={{ scale }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.div>
);

// Glow Effect
export const GlowEffect: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
}> = ({ children, color = '#05F2F2', className }) => (
  <motion.div
    className={cn('relative', className)}
    whileHover={{
      boxShadow: `0 0 20px ${color}50, 0 0 40px ${color}30`
    }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Progress Ring
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ 
  progress, 
  size = 80, 
  strokeWidth = 8, 
  color = '#05F2F2',
  bgColor = '#260D0B',
  className,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Typewriter Effect
export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  className?: string;
}> = ({ text, speed = 50, className }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};

// Bounce In List (for staggered animations)
export const BounceInList: React.FC<{
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}> = ({ children, className, itemClassName }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
  >
    {children.map((child, index) => (
      <motion.div
        key={index}
        className={itemClassName}
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.8 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: 'spring',
              damping: 12,
              stiffness: 200
            }
          }
        }}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
);
