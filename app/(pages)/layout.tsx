import { Suspense } from 'react';
import { Footer, Header } from '@/components/layout';

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 h-16 animate-pulse border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80" />
  );
}

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
