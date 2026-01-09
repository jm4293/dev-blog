/**
 * 애플리케이션 상수
 */

export const APP = {
  NAME: 'devBlog.kr',
  DESCRIPTION: '한국 개발 기업들의 기술 블로그를 한 곳에서 모아보세요.',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

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
