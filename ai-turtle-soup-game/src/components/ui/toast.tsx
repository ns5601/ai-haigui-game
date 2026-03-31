import React, { useEffect, useState } from 'react';
import { useToastStore, type Toast } from '../../stores/toast';
import { cn } from '../../lib/utils/helpers';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
  toast: Toast;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || 5000;

  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;
      setProgress(progressPercent);

      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isPaused, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300',
        getBgColor(),
        'animate-in slide-in-from-right-full'
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className={cn('font-medium', getTextColor())}>{toast.title}</div>
          {toast.description && (
            <div className={cn('mt-1 text-sm opacity-90', getTextColor())}>
              {toast.description}
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className={cn(
            'ml-4 flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors',
            getTextColor()
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {duration > 0 && (
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-100', {
              'bg-green-500': toast.type === 'success',
              'bg-red-500': toast.type === 'error',
              'bg-yellow-500': toast.type === 'warning',
              'bg-blue-500': toast.type === 'info',
            })}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};