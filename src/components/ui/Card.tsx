import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glass?: boolean;
  children: React.ReactNode;
}

export function Card({ hover = false, glass = false, className, children, ...props }: CardProps) {
  const baseClassName = cn(
    'rounded-2xl border overflow-hidden transition-all duration-300',
    glass 
      ? 'bg-white/10 backdrop-blur-md border-white/20 dark:bg-black/10 dark:border-white/10' 
      : 'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 shadow-lg',
    hover && 'hover:shadow-xl cursor-pointer',
    className
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={baseClassName}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClassName} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-secondary-200 dark:border-secondary-700', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50', className)} {...props}>
      {children}
    </div>
  );
}