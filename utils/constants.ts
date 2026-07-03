import { Bell, Bookmark, CalendarDays, FileText, PlusCircle, User } from 'lucide-react';

export const APP = {
  NAME: 'devBlog.kr',
  DESCRIPTION: '개발 블로그들의 개발 블로그를 한 곳에서 모아보세요.',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr',
};

export const MENU_ITEMS = [
  { href: '/posts', label: '포스트', icon: FileText },
  { href: '/digest', label: '주간 인기글', icon: CalendarDays },
  { href: '/bookmarks', label: '즐겨찾기', icon: Bookmark },
  { href: '/profile', label: '프로필', icon: User },
  { href: '/announcements', label: '새로운 소식', icon: Bell },
  { href: '/request', label: '요청하기', icon: PlusCircle },
];

export const PAGINATION = {
  // 3열(데스크탑)·2열(태블릿) 그리드에서 빈 칸 없이 떨어지는 수 (18 = 3×6 = 2×9)
  ITEMS_PER_PAGE: 18,
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
  INTERVAL_HOURS: 6,
  TIMES_PER_DAY: 4,
  SCHEDULE: '0 */6 * * *', // 6시간마다
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
      label: '버그 수정',
    },
    new_feature: {
      label: '새로운 기능',
    },
    new_company: {
      label: '신규 블로그',
    },
    new_tag: {
      label: '신규 태그',
    },
    update: {
      label: '업데이트',
    },
    maintenance: {
      label: '유지보수',
    },
  } as const,
};
