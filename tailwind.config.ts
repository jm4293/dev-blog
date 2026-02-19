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
        // Override Tailwind's default gray (which has blue tint) with pure neutral gray
        gray: {
          50: 'hsl(0, 0%, 98%)',
          100: 'hsl(0, 0%, 96%)',
          200: 'hsl(0, 0%, 91%)',
          300: 'hsl(0, 0%, 83%)',
          400: 'hsl(0, 0%, 64%)',
          500: 'hsl(0, 0%, 46%)',
          600: 'hsl(0, 0%, 36%)',
          700: 'hsl(0, 0%, 26%)',
          800: 'hsl(0, 0%, 17%)',
          900: 'hsl(0, 0%, 11%)',
          950: 'hsl(0, 0%, 7%)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
