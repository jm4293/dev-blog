import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <nav aria-label="푸터 네비게이션">
          <h2 className="sr-only">푸터 메뉴</h2>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <span className="font-semibold text-gray-900 dark:text-white">정보</span>
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <li>
                <a
                  href="https://github.com/jm4293/dev-blog"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-4 flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 devBlog.kr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
