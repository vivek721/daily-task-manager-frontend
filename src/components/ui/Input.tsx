import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  floating?: boolean;
}

export function Input({
  label,
  error,
  icon,
  floating = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  if (floating && label) {
    return (
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'peer w-full px-4 py-3 pt-6 rounded-xl border border-secondary-300 dark:border-secondary-600',
            'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white',
            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'placeholder-transparent transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            icon && 'pl-12',
            className
          )}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 top-2 text-xs text-secondary-500',
            'transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5',
            'peer-focus:text-xs peer-focus:top-2 peer-focus:text-primary-600',
            icon && 'left-12'
          )}
        >
          {label}
        </label>
        {icon && (
          <div className="absolute left-4 top-3.5 text-secondary-500 h-5 w-5">
            {icon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-secondary-300 dark:border-secondary-600',
            'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white',
            'placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            icon && 'pl-12',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-4 top-3.5 text-secondary-500 h-5 w-5">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}