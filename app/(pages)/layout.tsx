import { LayoutContainer } from '@/components/layout';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
