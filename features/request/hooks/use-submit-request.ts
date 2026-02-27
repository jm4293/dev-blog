'use client';

import { UseFormReset } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { type RequestFormData, submitRequestAction } from '@/features/request/actions';

interface UseSubmitRequestOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useSubmitRequest = (reset: UseFormReset<RequestFormData>, options?: UseSubmitRequestOptions) => {
  return useMutation({
    mutationFn: async (data: RequestFormData) => {
      const result = await submitRequestAction(data);
      reset();
      return result;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
};
