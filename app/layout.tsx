import type { Metadata, Viewport } from 'next';
import { ParticleBackgroundLazy } from '@/components/background';
import { ToastContainer } from '@/components/toast';
import { OfflineBanner } from '@/components/ui';
import { QueryProvider } from '../lib/query-provider';
import { pretendard } from './fonts';
import './globals.css';
import { GoogleAnalytics } from './GoogleAnalytics';
import { organizationSchema, websiteSchema } from './schema';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#07090F' },
  ],
};

const SITE_DESCRIPTION =
  '여러 기업의 기술블로그를 한 곳에 모았습니다. 최신 개발 블로그 글을 태그와 키워드로 찾아보세요.';

export const metadata: Metadata = {
  title: {
    default: '기술블로그 모음 - devBlog.kr',
    template: '%s - devBlog.kr',
  },
  description: SITE_DESCRIPTION,
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
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    siteName: 'devBlog.kr',
    title: '기술블로그 모음 - devBlog.kr',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: '기술블로그 모음 - devBlog.kr',
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: '/logo.svg?v=2', type: 'image/svg+xml' },
      { url: '/logo_32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/logo_48.png?v=2', sizes: '48x48', type: 'image/png' },
      { url: '/logo_192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/logo_512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/logo_48.png?v=2',
    apple: '/logo_192.png?v=2',
  },
  other: {
    'naver-site-verification': '7f789ada98f40ecd34a513b77f53acd408b08300',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head>
        {/* 테마 초기화 (페인트 전 실행하여 깜빡임 방지) — 저장된 선택이 'light'가 아니면 기본 다크 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        {supabaseHost && (
          <>
            <link rel="preconnect" href={supabaseHost} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseHost} />
          </>
        )}
        <link rel="icon" href="/logo.svg?v=2" type="image/svg+xml" />
        <link rel="icon" href="/logo_32.png?v=2" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo_48.png?v=2" sizes="48x48" type="image/png" />
        <link rel="icon" href="/logo_192.png?v=2" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/logo_192.png?v=2" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="devBlog.kr" />

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
      <body className="min-h-screen">
        <ParticleBackgroundLazy />
        <OfflineBanner />
        <ToastContainer />
        <QueryProvider>{children}</QueryProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
