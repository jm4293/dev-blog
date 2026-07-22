'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptySubscribe = () => () => {};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-20 z-[999] flex w-full max-w-md -translate-x-1/2 transform flex-col gap-3 px-4"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto duration-300 animate-in fade-in slide-in-from-top-2">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg',
              toast.type === 'success' && 'border-success/40',
              toast.type === 'error' && 'border-destructive/40',
              toast.type === 'info' && 'border-sapphire/40',
            )}
          >
            <div
              className={cn(
                'flex-shrink-0',
                toast.type === 'success' && 'text-success',
                toast.type === 'error' && 'text-destructive',
                toast.type === 'info' && 'text-sapphire',
              )}
            >
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>

            <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="알림 닫기"
              className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
}
