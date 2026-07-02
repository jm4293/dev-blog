'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks';

/**
 * 로그인 콜백 결과 토스트 처리
 * /posts가 정적 페이지라 서버에서 파라미터를 못 받으므로 클라이언트에서 직접 읽는다.
 */
export function useLoginStatusHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const loginStatus = searchParams.get('login');
  const errorStatus = searchParams.get('error');

  useEffect(() => {
    if (loginStatus === 'success') {
      showToast({
        message: '로그인 성공! devBlog.kr에 오신 것을 환영합니다.',
        type: 'success',
        duration: 3000,
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete('login');
      const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
      router.replace(newUrl, { scroll: false });
    }

    if (errorStatus === 'auth_failed') {
      showToast({
        message: '로그인에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
        duration: 3000,
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete('error');
      const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
      router.replace(newUrl, { scroll: false });
    }
  }, [loginStatus, errorStatus, showToast, router, searchParams]);
}
