import { atom } from 'jotai';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

// 토스트 목록 atom
export const toastsAtom = atom<Toast[]>([]);

// 토스트 추가 atom (write-only derived atom)
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, ...toast };

    // 기존 토스트 목록에 추가
    set(toastsAtom, (prev) => [...prev, newToast]);

    // 자동 제거
    if (toast.duration !== 0) {
      setTimeout(() => {
        set(removeToastAtom, id);
      }, toast.duration ?? 3000);
    }
  }
);

// 토스트 제거 atom (write-only derived atom)
export const removeToastAtom = atom(
  null,
  (get, set, id: string) => {
    set(toastsAtom, (prev) => prev.filter((toast) => toast.id !== id));
  }
);

// showToast 편의 함수용 atom (선택사항)
export const showToastAtom = atom(
  null,
  (get, set, { message, type = 'info', duration = 3000 }: { message: string; type?: 'success' | 'error' | 'info'; duration?: number }) => {
    set(addToastAtom, { message, type, duration });
  }
);
