'use client';

import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubmitRequest } from '../hooks';
import { cn } from '@/utils';
import { RequestFormData } from '../actions';

export function RequestForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    defaultValues: {
      type: 'company',
      companyName: '',
      tagName: '',
      blogUrl: '',
      message: '',
      email: '',
    },
  });

  const requestType = watch('type');

  const mutation = useSubmitRequest(reset);

  const onSubmit = (data: RequestFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <fieldset>
          <legend className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">요청 유형</legend>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="relative">
              <input type="radio" value="company" {...register('type')} className="peer sr-only" />
              <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:border-gray-600 dark:peer-checked:bg-blue-900/20">
                <div className="text-center">
                  <div className="mb-2 text-2xl">🏢</div>
                  <div className="font-medium text-gray-900 dark:text-white">블로그 추가</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">새로운 블로그를 추가해달라</div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input type="radio" value="tag" {...register('type')} className="peer sr-only" />
              <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:border-gray-600 dark:peer-checked:bg-blue-900/20">
                <div className="text-center">
                  <div className="mb-2 text-2xl">🏷️</div>
                  <div className="font-medium text-gray-900 dark:text-white">태그 추가</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">새로운 태그를 추가해달라</div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input type="radio" value="other" {...register('type')} className="peer sr-only" />
              <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:border-gray-600 dark:peer-checked:bg-blue-900/20">
                <div className="text-center">
                  <div className="mb-2 text-2xl">💬</div>
                  <div className="font-medium text-gray-900 dark:text-white">기타 문의</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">기타 문의사항</div>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {requestType === 'company' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                요청하는 블로그명 *
              </label>
              <input
                type="text"
                {...register('companyName', {
                  validate: (value) => {
                    if (requestType === 'company' && !value.trim()) {
                      return '블로그명은 필수입니다.';
                    }
                    return true;
                  },
                })}
                className={cn(
                  'w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white',
                  errors.companyName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                )}
                placeholder="예: 토스, 카카오, 네이버"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                요청하는 블로그 URL *
              </label>
              <input
                type="url"
                {...register('blogUrl', {
                  validate: (value) => {
                    if (requestType === 'company' && !value.trim()) {
                      return 'URL은 필수입니다.';
                    }
                    return true;
                  },
                })}
                className={cn(
                  'w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white',
                  errors.blogUrl ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                )}
                placeholder="https://tech.kakao.com"
              />
              {errors.blogUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.blogUrl.message}</p>
              )}
            </div>
          </div>
        )}

        {requestType === 'tag' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">요청하는 태그명 *</label>
            <input
              type="text"
              {...register('tagName', {
                validate: (value) => {
                  if (requestType === 'tag' && !value.trim()) {
                    return '태그명은 필수입니다.';
                  }
                  return true;
                },
              })}
              className={cn(
                'w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white',
                errors.tagName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
              )}
              placeholder="예: React, TypeScript, DevOps"
            />
            {errors.tagName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tagName.message}</p>}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">메시지 *</label>
          <textarea
            {...register('message', {
              required: '메시지는 필수입니다.',
              minLength: { value: 10, message: '메시지는 최소 10자 이상이어야 합니다.' },
              maxLength: { value: 1000, message: '메시지는 최대 1000자까지 입력 가능합니다.' },
            })}
            rows={4}
            className={cn(
              'w-full resize-none rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white',
              errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
            )}
            placeholder="추가 요청에 대한 자세한 설명이나 이유를 적어주세요."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">이메일 (선택사항)</label>
          <input
            type="email"
            {...register('email', {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '유효한 이메일을 입력해주세요.',
              },
            })}
            className={cn(
              'w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white',
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
            )}
            placeholder="답변을 받을 이메일 주소"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">답변을 받으려면 이메일을 입력해주세요.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting || mutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              전송 중...
            </>
          ) : (
            <>
              <Send size={18} />
              요청 보내기
            </>
          )}
        </button>

        {mutation.isSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle size={20} />
            <span>요청이 성공적으로 전송되었습니다! 검토 후 연락드리겠습니다.</span>
          </div>
        )}

        {mutation.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={20} />
            <span>
              {mutation.error instanceof Error
                ? mutation.error.message
                : '요청 전송에 실패했습니다. 다시 시도해주세요.'}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
