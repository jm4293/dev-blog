import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-8">
          <h3 className="font-semibold text-gray-900 dark:text-white">정보</h3>
          <ul className="flex gap-6">
            <li>
              <a
                href="https://github.com/jm4293/dev-blog"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                이용약관
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                개인정보 처리방침
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 devBlog.kr. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
