'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  if (theme === null) return null;

  return (
    <button onClick={toggleTheme} className="rounded-lg p-2 transition-colors hover:bg-muted" aria-label="Toggle theme">
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}
