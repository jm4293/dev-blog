'use client'

import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostsContainer from '@/components/PostsContainer'
import { PostWithCompany } from '@/types/post'

// Mock 데이터 - 나중에 API로 대체
const MOCK_POSTS: PostWithCompany[] = [
  {
    id: '1',
    company_id: '1',
    title: '수천 개의 API/BATCH 서버를 하나의 설정 체계로 관리하기',
    url: 'https://toss.tech',
    summary: 'Toss의 API 관리 방식에 대한 소개입니다.',
    author: 'Toss Tech',
    tags: ['Backend', 'Architecture', 'DevOps'],
    published_at: new Date().toISOString(),
    scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      id: '1',
      name: '토스',
      name_en: 'Toss',
      logo_url: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/toss.svg',
      blog_url: 'https://toss.tech',
      rss_url: 'https://toss.tech/rss.xml',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '2',
    company_id: '2',
    title: '카카오 기술 블로그',
    url: 'https://tech.kakao.com',
    summary: '카카오의 기술 블로그입니다.',
    author: 'Kakao Tech',
    tags: ['Frontend', 'Backend', 'DevOps'],
    published_at: new Date(Date.now() - 86400000).toISOString(),
    scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      id: '2',
      name: '카카오',
      name_en: 'Kakao',
      logo_url: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/kakao.svg',
      blog_url: 'https://tech.kakao.com',
      rss_url: 'https://tech.kakao.com/feed/',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                devBlog.kr
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                한국 개발 기업들의 기술 블로그를 한 곳에서 모아보세요.
              </p>
            </div>

            {/* Posts Container with Search, Filter, and Pagination */}
            <PostsContainer posts={MOCK_POSTS} />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
