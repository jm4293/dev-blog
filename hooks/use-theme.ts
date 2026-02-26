'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

const THEME_KEY = 'theme';
const THEME_CHANGE_EVENT = 'devblog:theme-change';

function subscribeTheme(callback: () => void) {
  const handleThemeChange = () => callback();
  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
}

function getThemeSnapshot(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return saved ?? (systemDark ? 'dark' : 'light');
}

function getServerSnapshot(): 'light' | 'dark' {
  return 'light';
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  // 초기 로드 시 DOM에 테마 클래스 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
  }, [theme]);

  return { theme, toggleTheme };
}
