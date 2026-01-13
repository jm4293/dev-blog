'use client';

import { useMutation } from '@tanstack/react-query';
import { UseFormReset } from 'react-hook-form';
import { submitRequest, type RequestFormData } from '@/features/request/actions';

interface UseSubmitRequestOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useSubmitRequest = (
  reset: UseFormReset<RequestFormData>,
  options?: UseSubmitRequestOptions,
) => {
  return useMutation({
    mutationFn: submitRequest,
    onSuccess: () => {
      reset();
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Request submission failed:', error);
      options?.onError?.(error);
    },
  });
};
