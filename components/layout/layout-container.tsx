import { MobileHeader } from './mobile-header';
import { FooterContainer } from './footer-container';
import { DesktopSidebar } from './desktop-sidebar';

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DesktopSidebar />
      <MobileHeader />

      <div className="pt-16 md:pt-0">
        <main className="min-h-screen">{children}</main>
        <FooterContainer />
      </div>
    </div>
  );
}
