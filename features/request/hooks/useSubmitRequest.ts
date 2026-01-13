'use client';

import { useMutation } from '@tanstack/react-query';
import { UseFormReset } from 'react-hook-form';
import { submitRequestAction, type RequestFormData } from '@/features/request/actions';

interface UseSubmitRequestOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useSubmitRequest = (reset: UseFormReset<RequestFormData>, options?: UseSubmitRequestOptions) => {
  return useMutation({
    mutationFn: async (data: RequestFormData) => {
      // 데이터만 Server Action에 전달
      const result = await submitRequestAction(data);
      // 성공 후 폼 리셋 (클라이언트에서만 수행)
      reset();
      return result;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Request submission failed:', error);
      options?.onError?.(error as Error);
    },
  });
};
