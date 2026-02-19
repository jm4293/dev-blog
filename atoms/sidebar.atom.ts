import { atom } from 'jotai';

const SIDEBAR_KEY = 'sidebar-collapsed';

export const sidebarCollapsedAtom = atom<boolean>(false);

export const toggleSidebarAtom = atom(
  (get) => get(sidebarCollapsedAtom),
  (get, set) => {
    const next = !get(sidebarCollapsedAtom);
    set(sidebarCollapsedAtom, next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_KEY, String(next));
    }
  },
);

export const initSidebarAtom = atom(null, (_get, set) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      set(sidebarCollapsedAtom, stored === 'true');
    }
  }
});
