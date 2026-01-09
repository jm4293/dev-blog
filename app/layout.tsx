import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'devBlog.kr - 한국 개발 기업 블로그 모음',
  description: '한국 개발 기업들의 기술 블로그를 한 곳에서 모아보세요.',
  keywords: ['개발 블로그', '기술 블로그', '한국', '개발자'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        {children}
      </body>
    </html>
  )
}
