import { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { RequestForm } from '@/features/request';

export const metadata: Metadata = buildPageMetadata({
  title: '요청하기',
  description: '추가했으면 하는 기술블로그나 새로운 태그를 제안해보세요.',
  path: '/request',
});

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">요청하기</h1>
      </header>

      <section aria-label="블로그 추가 요청 폼">
        <RequestForm />
      </section>

      <aside className="mt-8 rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="mb-2 font-medium text-foreground">요청 처리 안내</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 요청은 검토 후 최대 3-5일 이내에 처리됩니다.</li>
          <li>• 모든 요청이 승인되는 것은 아닙니다.</li>
          <li>• 승인되지 않은 경우 별도 안내를 드립니다.</li>
          <li>• 이메일을 입력하시면 처리 결과를 알려드립니다.</li>
        </ul>
      </aside>
    </div>
  );
}
