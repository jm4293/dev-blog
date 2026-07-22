'use client';

import { toggleMobileMenuAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { Menu, X } from 'lucide-react';

export function MobileHamburger() {
  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);

  return (
    <button
      onClick={toggle}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      aria-expanded={isOpen}
      className="rounded-lg p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
    >
      {isOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
    </button>
  );
}
