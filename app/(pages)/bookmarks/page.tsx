import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function BookmarksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">내 즐겨찾기</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            저장한 게시글을 확인해보세요.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
