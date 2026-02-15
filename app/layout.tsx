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
  title: {
    default: '개발 블로그 모음 - devBlog.kr',
    template: '%s - devBlog.kr',
  },
  description:
    '토스, 카카오 등 32개 기업의 개발블로그, 기술블로그, 테크블로그를 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 트렌드와 기술 정보를 태그와 검색으로 쉽게 찾아보세요.',
  keywords: [
    '개발 블로그',
    '개발블로그',
    '개발 블로그 모음',
    '개발블로그 모음',
    '기술 블로그',
    '기술블로그',
    '기술 블로그 모음',
    '기술블로그 모음',
    '테크 블로그',
    '테크블로그',
    '테크 블로그 모음',
    '테크블로그 모음',
    '한국 개발 블로그',
    '한국 기술 블로그',
    '개발자 블로그',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    siteName: 'devBlog.kr',
    title: '개발 블로그 모음 - devBlog.kr',
    description: '토스, 카카오 등 개발 블로그 게시글을 한 곳에서 모아보세요.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '개발 블로그 | 개발 블로그 모음 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 블로그 모음 - devBlog.kr',
    description: '토스, 카카오 등 개발 블로그 게시글을 한 곳에서 모아보세요.',
    images: [`${baseUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: '/logo_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo_192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo_512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/logo_32.png',
    apple: '/logo_192.png',
  },
  other: {
    'naver-site-verification': '7f789ada98f40ecd34a513b77f53acd408b08300',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <link rel="icon" href="/logo_32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo_192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/logo_192.png" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS PWA splash screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="devBlog.kr" />
        <link
          rel="apple-touch-startup-image"
          href="/splash-640x1138.png"
          media="(device-width: 320px) and (device-height: 568px) and (-apple-system-2x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-750x1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-apple-system-2x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-828x1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-apple-system-2x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-apple-system-3x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-1242x2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-apple-system-3x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-1284x2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-apple-system-3x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-1179x2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-apple-system-3x)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash-1320x2868.png"
          media="(device-width: 440px) and (device-height: 956px) and (-apple-system-3x)"
        />

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
