'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PostWithCompany } from '@/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useAddBookmark, useRemoveBookmark, useIsBookmarked } from '@/features/bookmarks';

interface PostCardProps {
  post: PostWithCompany;
}

export function PostCard({ post }: PostCardProps) {
  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();
  const isBookmarkedFn = useIsBookmarked();

  const serverBookmarked = isBookmarkedFn(post.id);
  const isLoading = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  // 낙관적 상태: 로컬 상태로 UI 즉시 업데이트
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(serverBookmarked);

  // 서버 상태가 변경되면 낙관적 상태 동기화
  useEffect(() => {
    setOptimisticBookmarked(serverBookmarked);
  }, [serverBookmarked]);

  const publishedDate = new Date(post.published_at);
  const formattedDate = format(publishedDate, 'yyyy-MM-dd');
  const relativeTime = formatDistanceToNow(publishedDate, {
    addSuffix: true,
    locale: ko,
  });
  const timeDisplay = `${formattedDate} · ${relativeTime}`;

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 낙관적 업데이트: 즉시 UI 변경
    setOptimisticBookmarked(!optimisticBookmarked);

    // 서버 요청
    if (optimisticBookmarked) {
      removeBookmarkMutation.mutate(post.id, {
        onError: () => {
          // 에러 발생 시 낙관적 상태 되돌리기
          setOptimisticBookmarked(!optimisticBookmarked);
        },
      });
    } else {
      addBookmarkMutation.mutate(post.id, {
        onError: () => {
          // 에러 발생 시 낙관적 상태 되돌리기
          setOptimisticBookmarked(!optimisticBookmarked);
        },
      });
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
      {/* Company Info & Bookmark Button */}
      <div className="flex items-center gap-3 mb-4">
        {post.company.logo_url && (
          <Image
            src={post.company.logo_url}
            alt={`${post.company.name} 로고`}
            width={40}
            height={40}
            className="rounded-lg object-cover"
            title={post.company.name}
            priority={false}
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.company.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{timeDisplay}</p>
        </div>
        <button
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          title={optimisticBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              optimisticBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        </button>
      </div>

      {/* Title */}
      <Link href={post.url} target="_blank" rel="noopener noreferrer">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
      </Link>

      {/* Summary */}
      {post.summary && <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{post.summary}</p>}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...post.tags].sort().map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Link Button */}
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
      >
        전체 읽기 →
      </Link>
    </article>
  );
}
