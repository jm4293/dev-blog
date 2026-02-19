import { SidebarLayout } from '@/components/layout/SidebarLayout';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
