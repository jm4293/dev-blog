'use client';

import { useAtom } from 'jotai';
import { removeToastAtom, showToastAtom, toastsAtom } from '@/atoms/toast.atom';

export function useToast() {
  const [toasts] = useAtom(toastsAtom);
  const [, removeToast] = useAtom(removeToastAtom);
  const [, showToast] = useAtom(showToastAtom);

  return { toasts, removeToast, showToast };
}
