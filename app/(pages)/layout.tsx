import { LoginToastListener } from '@/features/auth';
import { LayoutContainer } from '@/components/layout';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      <LoginToastListener />
      {children}
    </LayoutContainer>
  );
}
