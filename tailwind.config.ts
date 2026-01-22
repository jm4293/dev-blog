import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './features/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // 공지사항 타입별 색상 클래스
    'bg-red-100',
    'dark:bg-red-900/30',
    'text-red-700',
    'dark:text-red-400',
    'border-l-red-500',
    'bg-blue-100',
    'dark:bg-blue-900/30',
    'text-blue-700',
    'dark:text-blue-400',
    'border-l-blue-500',
    'bg-green-100',
    'dark:bg-green-900/30',
    'text-green-700',
    'dark:text-green-400',
    'border-l-green-500',
    'bg-purple-100',
    'dark:bg-purple-900/30',
    'text-purple-700',
    'dark:text-purple-400',
    'border-l-purple-500',
    'bg-yellow-100',
    'dark:bg-yellow-900/30',
    'text-yellow-700',
    'dark:text-yellow-400',
    'border-l-yellow-500',
    'bg-gray-100',
    'dark:bg-gray-900/30',
    'text-gray-700',
    'dark:text-gray-400',
    'border-l-gray-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563EB',
          dark: '#3B82F6',
        },
        accent: {
          light: '#F6A54C',
          dark: '#FBBF24',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
