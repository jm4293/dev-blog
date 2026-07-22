'use client';

import { toggleMobileMenuAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { Menu, X } from 'lucide-react';

export function MobileHamburger() {
  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);

  return (
    <button onClick={toggle} className="rounded-lg p-2 hover:bg-muted">
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}
