import { atom } from 'jotai';

export const mobileMenuOpenAtom = atom(false);

export const toggleMobileMenuAtom = atom(
  (get) => get(mobileMenuOpenAtom),
  (get, set) => {
    const current = get(mobileMenuOpenAtom);
    set(mobileMenuOpenAtom, !current);
  },
);
