'use client';

import { useForm, useWatch } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubmitRequest } from '../hooks';
import { cn } from '@/utils';
import { RequestFormData } from '../actions';

export function RequestForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const requestType = useWatch({ control, name: 'type' });
  const mutation = useSubmitRequest(reset);

  const onSubmit = (data: RequestFormData) => {
    mutation.mutate(data);
  };

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
      hasError ? 'border-destructive' : 'border-border',
    );

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 요청 유형 선택 */}
        <fieldset>
          <legend className="mb-3 block text-sm font-medium text-foreground">요청 유형</legend>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { value: 'company', emoji: '🏢', label: '블로그 추가', desc: '새로운 블로그를 추가해달라' },
              { value: 'tag', emoji: '🏷️', label: '태그 추가', desc: '새로운 태그를 추가해달라' },
              { value: 'other', emoji: '💬', label: '기타 문의', desc: '기타 문의사항' },
            ].map(({ value, emoji, label, desc }) => (
              <label key={value} className="relative cursor-pointer">
                <input type="radio" value={value} {...register('type')} className="peer sr-only" />
                <div className="rounded-lg border-2 border-border p-4 transition-all peer-checked:border-foreground peer-checked:bg-muted">
                  <div className="text-center">
                    <div className="mb-2 text-2xl">{emoji}</div>
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 블로그 추가 필드 */}
        {requestType === 'company' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">요청하는 블로그명 *</label>
              <input
                type="text"
                autoComplete="organization"
                {...register('companyName', {
                  validate: (value) => (requestType === 'company' && !value.trim() ? '블로그명은 필수입니다.' : true),
                })}
                className={inputClass(!!errors.companyName)}
                placeholder="예: 토스, 카카오, 네이버"
              />
              {errors.companyName && <p className="mt-1 text-sm text-destructive">{errors.companyName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">요청하는 블로그 URL *</label>
              <input
                type="url"
                autoComplete="url"
                {...register('blogUrl', {
                  validate: (value) => (requestType === 'company' && !value.trim() ? 'URL은 필수입니다.' : true),
                })}
                className={inputClass(!!errors.blogUrl)}
                placeholder="https://tech.kakao.com"
              />
              {errors.blogUrl && <p className="mt-1 text-sm text-destructive">{errors.blogUrl.message}</p>}
            </div>
          </div>
        )}

        {/* 태그 추가 필드 */}
        {requestType === 'tag' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">요청하는 태그명 *</label>
            <input
              type="text"
              autoComplete="off"
              {...register('tagName', {
                validate: (value) => (requestType === 'tag' && !value.trim() ? '태그명은 필수입니다.' : true),
              })}
              className={inputClass(!!errors.tagName)}
              placeholder="예: React, TypeScript, DevOps"
            />
            {errors.tagName && <p className="mt-1 text-sm text-destructive">{errors.tagName.message}</p>}
          </div>
        )}

        {/* 메시지 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">메시지 *</label>
          <textarea
            {...register('message', {
              required: '메시지는 필수입니다.',
              minLength: { value: 10, message: '메시지는 최소 10자 이상이어야 합니다.' },
              maxLength: { value: 1000, message: '메시지는 최대 1000자까지 입력 가능합니다.' },
            })}
            rows={4}
            className={inputClass(!!errors.message) + ' resize-none'}
            placeholder="추가 요청에 대한 자세한 설명이나 이유를 적어주세요."
          />
          {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
        </div>

        {/* 이메일 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">이메일 (선택사항)</label>
          <input
            type="email"
            autoComplete="email"
            spellCheck={false}
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '유효한 이메일을 입력해주세요.' },
            })}
            className={inputClass(!!errors.email)}
            placeholder="답변을 받을 이메일 주소"
          />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
          <p className="mt-1 text-xs text-muted-foreground">답변을 받으려면 이메일을 입력해주세요.</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || mutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
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
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-4 text-foreground">
            <CheckCircle size={20} className="flex-shrink-0 text-foreground" />
            <span>요청이 성공적으로 전송되었습니다! 검토 후 연락드리겠습니다.</span>
          </div>
        )}

        {/* 에러 메시지 */}
        {mutation.isError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertCircle size={20} className="flex-shrink-0" />
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
