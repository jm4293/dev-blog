'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils';
import { Building2 } from 'lucide-react';

interface BlogLogoImageProps {
  logoUrl?: string | null;
  companyName: string;
  width: number;
  height: number;
  className?: string;
  title?: string;
  priority?: boolean;
}

/**
 * 블로그 로고 이미지 컴포넌트
 * - 통일된 컨테이너(rounded-lg + hairline border + muted bg) 안에 로고를 contain
 * - 로고 없거나 실패 시 Building2 폴백
 */
export function BlogLogoImage({
  logoUrl,
  companyName,
  width,
  height,
  className = '',
  title,
  priority = false,
}: BlogLogoImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const containerClass = cn(
    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40 p-1',
    className,
  );

  if (!logoUrl || imageError) {
    return (
      <div className={containerClass} style={{ width, height }} title={title || companyName}>
        <Building2 className="h-1/2 w-1/2 text-muted-foreground" strokeWidth={1.5} />
      </div>
    );
  }

  const innerSize = Math.max(width - 8, 16);

  return (
    <div className={containerClass} style={{ width, height }} title={title || companyName}>
      {isLoading && <div className="absolute h-full w-full animate-pulse rounded-md bg-muted" />}
      <Image
        src={`/company_logos/${logoUrl}`}
        alt={`${companyName} 로고`}
        width={innerSize}
        height={innerSize}
        className="h-full w-full object-contain"
        title={title || companyName}
        priority={priority}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s ease-in-out' }}
      />
    </div>
  );
}
