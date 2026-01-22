import { Metadata } from 'next';
import { RequestForm } from '@/features/request';

export const metadata: Metadata = {
  title: '요청하기 | 기업 / 태그 추가 요청 - devBlog.kr',
  description:
    '새로운 기업이나 태그를 추가해달라고 요청하거나, 기타 문의를 보낼 수 있습니다. devBlog.kr을 더 나은 개발 블로그 플랫폼으로 만들어보세요.',
  keywords: ['요청', '기업 추가', '태그 추가', '피드백', '문의'],
  openGraph: {
    title: '요청하기 | 기업 / 태그 추가 요청 - devBlog.kr',
    description: '새로운 기업이나 태그를 추가해달라고 요청하거나, 기타 문의를 보낼 수 있습니다.',
    type: 'website',
  },
};

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">요청하기</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          새로운 기업나 태그를 추가해달라고 요청하거나, 기타 문의를 보낼 수 있습니다.
        </p>
      </div>

      <RequestForm />

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📋 요청 처리 안내</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• 요청은 검토 후 최대 3-5일 이내에 처리됩니다.</li>
          <li>• 모든 요청이 승인되는 것은 아닙니다.</li>
          <li>• 승인되지 않은 경우 별도 안내를 드립니다.</li>
          <li>• 이메일을 입력하시면 처리 결과를 알려드립니다.</li>
        </ul>
      </div>
    </div>
  );
}
