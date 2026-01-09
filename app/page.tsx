import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">devBlog.kr</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            한국 개발 기업들의 기술 블로그를 한 곳에서 모아보세요.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
