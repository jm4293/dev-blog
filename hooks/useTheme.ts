'use client';

import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'theme';
const THEME_CHANGE_EVENT = 'devblog:theme-change';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = saved ?? (systemDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    setThemeState(resolved);

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<'light' | 'dark'>).detail;
      setThemeState(detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem(THEME_KEY, next);
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
