import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from './providers/QueryProvider';
import { ToastContainer } from '@/components/toast';
import { GoogleAnalytics } from './GoogleAnalytics';
import { initSentry } from '@/sentry.config';
import { organizationSchema, websiteSchema } from './schema';

// Sentry 초기화 (프로덕션 환경에서만)
initSentry();

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: '개발 블로그 | 기술 블로그 모음 - devBlog.kr',
  description:
    '토스, 카카오 등 한국 IT 기업들의 기술 블로그를 한 곳에서 모아보세요. 최신 개발 트렌드와 기술 정보를 태그와 검색으로 쉽게 찾아보세요.',
  keywords: [
    '개발 블로그',
    '개발블로그',
    '기술 블로그',
    '기술블로그',
    '한국 IT 기업 블로그',
    '개발자',
    'Frontend',
    'Backend',
    'DevOps',
    'Database',
    'React',
    'TypeScript',
    '토스',
    '카카오',
    'AI/ML',
    'Architecture',
  ],
  authors: [{ name: 'jm4293' }],
  creator: 'jm4293',
  publisher: 'devBlog.kr',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    siteName: 'devBlog.kr',
    title: '개발 블로그 | 기술 블로그 모음 - devBlog.kr',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '개발 블로그 | 기술 블로그 모음 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 블로그 | 기술 블로그 모음 - devBlog.kr',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/favicon-192.png',
  },
  // verification: {
  //   google: 'Google이 제공하는 고유 verification code',
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-192.png" />

        {/* 구조화된 데이터 (Schema.org) - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* 구조화된 데이터 (Schema.org) - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <ToastContainer />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
