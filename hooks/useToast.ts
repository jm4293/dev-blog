'use client';

import { useAtom } from 'jotai';
import { toastsAtom, removeToastAtom, showToastAtom } from '@/atoms/toast.atom';

export const useToast = () => {
  const [toasts] = useAtom(toastsAtom);
  const [, removeToast] = useAtom(removeToastAtom);
  const [, showToast] = useAtom(showToastAtom);

  return { toasts, removeToast, showToast };
};
