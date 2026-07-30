import Link from 'next/link';
import { cn } from '@/utils';
import { Heart } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  isLoading: boolean;
  onToggle: (e: React.MouseEvent) => void;
  showLoginTooltip: boolean;
  /** 비로그인 툴팁에서 이동할 로그인 경로 (복귀 경로 포함) */
  loginUrl?: string;
}

export function BookmarkButton({ isBookmarked, isLoading, onToggle, showLoginTooltip, loginUrl }: BookmarkButtonProps) {
  return (
    <div className="relative">
      {/* 낙관적 업데이트로 즉시 반영되므로 진행 중에도 버튼을 잠그지 않는다 */}
      <button
        onClick={onToggle}
        aria-busy={isLoading}
        aria-label={isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
        aria-pressed={isBookmarked}
        className="rounded-lg p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        title={isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
      >
        <Heart
          aria-hidden="true"
          className={cn(
            'h-5 w-5 transition-colors',
            isBookmarked ? 'fill-destructive text-destructive' : 'text-muted-foreground',
          )}
        />
      </button>

      {showLoginTooltip && (
        <div
          role="status"
          className="absolute right-0 top-full z-10 mt-2 animate-fade-in whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg"
        >
          <p>로그인 후 즐겨찾기가 가능합니다</p>
          {loginUrl && (
            <Link
              href={loginUrl}
              className="mt-1.5 inline-block rounded bg-background px-2 py-1 font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              GitHub으로 로그인 →
            </Link>
          )}
          <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 transform bg-foreground"></div>
        </div>
      )}
    </div>
  );
}
