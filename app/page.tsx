'use client'

import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostsContainer from '@/components/PostsContainer'

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
            <PostsContainer />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
