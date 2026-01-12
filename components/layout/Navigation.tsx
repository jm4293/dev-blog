import Link from 'next/link';

export const Navigation = () => {
  return (
    <nav className="flex items-center gap-8">
      <Link
        href="/"
        className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
        포스트
      </Link>
      <Link
        href="/bookmarks"
        className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
        즐겨찾기
      </Link>
    </nav>
  );
};
