'use client';

import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubmitRequest } from '../hooks';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 요청 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">요청 유형</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 기업 추가 옵션 */}
            <label className="relative">
              <input type="radio" value="company" {...register('type')} className="sr-only peer" />
              <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-medium text-gray-900 dark:text-white">기업 추가</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">새로운 기업를 추가해달라</div>
                </div>
              </div>
            </label>

            {/* 태그 추가 옵션 */}
            <label className="relative">
              <input type="radio" value="tag" {...register('type')} className="sr-only peer" />
              <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏷️</div>
                  <div className="font-medium text-gray-900 dark:text-white">태그 추가</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">새로운 태그를 추가해달라</div>
                </div>
              </div>
            </label>

            {/* 기타 옵션 */}
            <label className="relative">
              <input type="radio" value="other" {...register('type')} className="sr-only peer" />
              <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all">
                <div className="text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-medium text-gray-900 dark:text-white">기타 문의</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">기타 문의사항</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* 기업 추가 필드 */}
        {requestType === 'company' && (
          <div className="space-y-4">
            {/* 기업명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                요청하는 기업명 *
              </label>
              <input
                type="text"
                {...register('companyName', {
                  validate: (value) => {
                    if (requestType === 'company' && !value.trim()) {
                      return '기업명은 필수입니다.';
                    }
                    return true;
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.companyName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="예: 토스, 카카오, 네이버"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
              )}
            </div>

            {/* 블로그 URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                  errors.blogUrl ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://tech.kakao.com"
              />
              {errors.blogUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.blogUrl.message}</p>
              )}
            </div>
          </div>
        )}

        {/* 태그 추가 필드 */}
        {requestType === 'tag' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">요청하는 태그명 *</label>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                errors.tagName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="예: React, TypeScript, DevOps"
            />
            {errors.tagName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tagName.message}</p>}
          </div>
        )}

        {/* 메시지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">메시지 *</label>
          <textarea
            {...register('message', {
              required: '메시지는 필수입니다.',
              minLength: { value: 10, message: '메시지는 최소 10자 이상이어야 합니다.' },
              maxLength: { value: 1000, message: '메시지는 최대 1000자까지 입력 가능합니다.' },
            })}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all ${
              errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="추가 요청에 대한 자세한 설명이나 이유를 적어주세요."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>}
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이메일 (선택사항)</label>
          <input
            type="email"
            {...register('email', {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '유효한 이메일을 입력해주세요.',
              },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="답변을 받을 이메일 주소"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">답변을 받으려면 이메일을 입력해주세요.</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isSubmitting || mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              전송 중...
            </>
          ) : (
            <>
              <Send size={18} />
              요청 보내기
            </>
          )}
        </button>

        {/* 성공 메시지 */}
        {mutation.isSuccess && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <CheckCircle size={20} />
            <span>요청이 성공적으로 전송되었습니다! 검토 후 연락드리겠습니다.</span>
          </div>
        )}

        {/* 에러 메시지 */}
        {mutation.isError && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
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
