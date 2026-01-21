'use client';

import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

interface CompanyLogoImageProps {
  logoUrl?: string | null;
  companyName: string;
  width: number;
  height: number;
  className?: string;
  title?: string;
  priority?: boolean;
}

/**
 * 회사 로고 이미지 컴포넌트
 * - 로고 없으면 기본 아이콘 표시
 * - 로드 실패 시 기본 아이콘으로 폴백
 */
export function CompanyLogoImage({
  logoUrl,
  companyName,
  width,
  height,
  className = '',
  title,
  priority = false,
}: CompanyLogoImageProps) {
  const [imageError, setImageError] = useState(false);

  // 로고가 없거나 로드 실패 시 기본 이미지 표시
  if (!logoUrl || imageError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
        title={title || companyName}
      >
        <Building2 className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <Image
      src={`/company_logos/${logoUrl}`}
      alt={`${companyName} 로고`}
      width={width}
      height={height}
      className={className}
      title={title || companyName}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}
