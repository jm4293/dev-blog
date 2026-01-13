'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../../hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

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
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div
            className={`
              flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg
              ${
                toast.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                  : toast.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
              }
            `}>
            {/* 아이콘 */}
            <div
              className={`
                flex-shrink-0
                ${
                  toast.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : toast.type === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
                }
              `}>
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>

            {/* 메시지 */}
            <p
              className={`
                flex-1 text-sm font-medium
                ${
                  toast.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : toast.type === 'error'
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-blue-800 dark:text-blue-200'
                }
              `}>
              {toast.message}
            </p>

            {/* 닫기 버튼 */}
            <button
              onClick={() => removeToast(toast.id)}
              className={`
                flex-shrink-0 transition-colors
                ${
                  toast.type === 'success'
                    ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                    : toast.type === 'error'
                      ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                }
              `}>
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
};
