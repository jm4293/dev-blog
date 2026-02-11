'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks';

interface UseLoginStatusHandlerProps {
  loginStatus?: string;
  errorStatus?: string;
}

export function useLoginStatusHandler({ loginStatus, errorStatus }: UseLoginStatusHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

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
