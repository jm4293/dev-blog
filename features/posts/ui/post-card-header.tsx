import Link from 'next/link';
import { BlogLogoImage } from '@/components/image';

interface PostCardHeaderProps {
  logoUrl: string | undefined;
  companyName: string;
  timeDisplay: string;
  /** 있으면 로고/회사명이 해당 회사 랜딩(/companies/[slug])으로 링크됨 */
  companySlug?: string;
  children?: React.ReactNode;
}

export function PostCardHeader({ logoUrl, companyName, timeDisplay, companySlug, children }: PostCardHeaderProps) {
  const identity = (
    <>
      <BlogLogoImage
        logoUrl={logoUrl}
        companyName={companyName}
        width={36}
        height={36}
        title={companyName}
        priority={false}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{companyName}</p>
        <p className="text-xs text-muted-foreground">{timeDisplay}</p>
      </div>
    </>
  );

  return (
    <div className="mb-4 flex items-center gap-3">
      {companySlug ? (
        // 카드 전체를 덮는 원본 링크 오버레이 위에서 클릭되도록 z-10
        <Link
          href={`/companies/${companySlug}`}
          title={`${companyName} 글 모아보기`}
          className="relative z-10 flex min-w-0 flex-1 items-center gap-3 rounded transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          {identity}
        </Link>
      ) : (
        identity
      )}
      {children}
    </div>
  );
}
