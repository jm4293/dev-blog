'use client';

import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils';

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
 * - 로고 다운로드 중: 스켈레톤 로딩 UI
 * - 로고 없으면 기본 아이콘 표시
 * - 로드 실패 시 기본 아이콘으로 폴백
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

  // 로고가 없는 경우 기본 아이콘 표시
  if (!logoUrl) {
    return (
      <div
        className={cn('flex items-center justify-center bg-gray-200 dark:bg-gray-700', className)}
        style={{ width, height }}
        title={title || companyName}
      >
        <Building2 className="h-1/2 w-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  // 로드 실패 시 기본 아이콘 표시
  if (imageError) {
    return (
      <div
        className={cn('flex items-center justify-center bg-gray-200 dark:bg-gray-700', className)}
        style={{ width, height }}
        title={title || companyName}
      >
        <Building2 className="h-1/2 w-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height }} title={title || companyName}>
      {isLoading && (
        <div
          className={cn('absolute inset-0 animate-pulse rounded bg-gray-200 dark:bg-gray-700', className)}
          style={{ width, height }}
        />
      )}
      <Image
        src={`/company_logos/${logoUrl}`}
        alt={`${companyName} 로고`}
        width={width}
        height={height}
        className={className}
        title={title || companyName}
        priority={priority}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
}
