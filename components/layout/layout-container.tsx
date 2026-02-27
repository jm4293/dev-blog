import { DesktopSidebar } from './desktop-sidebar';
import { FooterContainer } from './footer-container';
import { MobileHeader } from './mobile-header';

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
