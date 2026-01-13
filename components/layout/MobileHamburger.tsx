'use client';

import { toggleMobileMenuAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { Menu, X } from 'lucide-react';

export function MobileHamburger() {
  const [isOpen, toggle] = useAtom(toggleMobileMenuAtom);

  return (
    <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}
