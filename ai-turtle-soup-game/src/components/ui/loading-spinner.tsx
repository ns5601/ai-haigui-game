import React from 'react';
import { cn } from '../../lib/utils/helpers';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'blue' | 'green' | 'amber';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizeClasses[size], colorClasses[color])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={cn('mt-3 text-sm', {
          'text-gray-600': color === 'primary' || color === 'gray',
          'text-white': color === 'white',
          'text-blue-600': color === 'blue',
          'text-green-600': color === 'green',
          'text-amber-600': color === 'amber',
        })}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export { LoadingSpinner };

// 页面级加载组件
export const PageLoader: React.FC<{ text?: string }> = ({ text = '加载中...' }) => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

// 内联加载组件
export const InlineLoader: React.FC<{ text?: string }> = ({ text }) => (
  <LoadingSpinner size="sm" text={text} />
);