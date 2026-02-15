'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed left-1/2 top-20 z-[999] flex w-full max-w-md -translate-x-1/2 transform flex-col gap-3 px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto duration-300 animate-in fade-in slide-in-from-top-2">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg',
              toast.type === 'success' && 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
              toast.type === 'error' && 'border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
              toast.type === 'info' && 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
            )}
          >
            <div
              className={cn(
                'flex-shrink-0',
                toast.type === 'success' && 'text-green-600 dark:text-green-400',
                toast.type === 'error' && 'text-red-600 dark:text-red-400',
                toast.type === 'info' && 'text-blue-600 dark:text-blue-400',
              )}
            >
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>

            <p
              className={cn(
                'flex-1 text-sm font-medium',
                toast.type === 'success' && 'text-green-800 dark:text-green-200',
                toast.type === 'error' && 'text-red-800 dark:text-red-200',
                toast.type === 'info' && 'text-blue-800 dark:text-blue-200',
              )}
            >
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className={cn(
                'flex-shrink-0 transition-colors',
                toast.type === 'success' &&
                  'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
                toast.type === 'error' && 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
                toast.type === 'info' &&
                  'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
              )}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
};
