import { Bell, Bookmark, FileText, PlusCircle, User } from 'lucide-react';

export const APP = {
  NAME: 'devBlog.kr',
  DESCRIPTION: '개발 블로그들의 개발 블로그를 한 곳에서 모아보세요.',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr',
};

export const MENU_ITEMS = [
  { href: '/posts', label: '포스트', icon: FileText },
  { href: '/bookmarks', label: '즐겨찾기', icon: Bookmark },
  { href: '/profile', label: '프로필', icon: User },
  { href: '/announcements', label: '새로운 소식', icon: Bell },
  { href: '/request', label: '요청하기', icon: PlusCircle },
];

export const PAGINATION = {
  ITEMS_PER_PAGE: 9,
  DEFAULT_PAGE: 1,
};

export const TAGS = {
  POPULAR: ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Mobile', 'Architecture', 'Performance'],
  ALL: [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'AI/ML',
    'Mobile',
    'Architecture',
    'Performance',
    'Security',
    'Testing',
    'React',
    'Vue',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Docker',
    'Kubernetes',
    'AWS',
  ],
};

export const CRON = {
  INTERVAL_HOURS: 3,
  TIMES_PER_DAY: 8,
  SCHEDULE: '0 */3 * * *', // 3시간마다
};

export const OPENAI = {
  MODEL: 'gpt-4o-mini',
  SUMMARY_MAX_LENGTH: 2, // 1-2줄
  TAGS_COUNT: {
    MIN: 3,
    MAX: 5,
  },
  TIMEOUT_MS: 30000, // 30초
};

export const API = {
  TIMEOUT_MS: 10000,
  RETRIES: 3,
};

export const RSS = {
  TIMEOUT_MS: 15000,
  MAX_ITEMS: 50,
};

export const ANNOUNCEMENTS = {
  ITEMS_PER_PAGE: 20,
  TYPE_CONFIG: {
    bug_fix: {
      emoji: '🐛',
      label: '버그 수정',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-400',
      borderColor: 'border-l-red-500',
    },
    new_feature: {
      emoji: '✨',
      label: '새로운 기능',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      borderColor: 'border-l-blue-500',
    },
    new_company: {
      emoji: '🏢',
      label: '신규 블로그',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400',
      borderColor: 'border-l-green-500',
    },
    new_tag: {
      emoji: '🏷️',
      label: '신규 태그',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-400',
      borderColor: 'border-l-purple-500',
    },
    update: {
      emoji: '📢',
      label: '업데이트',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      borderColor: 'border-l-yellow-500',
    },
    maintenance: {
      emoji: '🔧',
      label: '유지보수',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      textColor: 'text-gray-700 dark:text-gray-400',
      borderColor: 'border-l-gray-500',
    },
  } as const,
};
