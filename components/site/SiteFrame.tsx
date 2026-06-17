import { Navbar } from '@/components/layout/Navbar';

type SiteFrameProps = {
  children: React.ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="homepage min-h-screen overflow-x-clip bg-[var(--site-bg)] text-[var(--site-text)]">
      <Navbar />
      <main className="pt-[116px] md:pt-[72px]">{children}</main>
      <footer className="border-t border-[var(--site-border)] bg-[var(--surface)]/88 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-display text-2xl text-[var(--site-text)]">M Moser AI</p>
            <p className="text-sm text-[var(--site-text-muted)]">
              A living intelligence platform for learning, experimentation, and shared AI practice.
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--site-text-muted)] md:text-right">
            Guide content reflects the AI landscape as of March 2026. Workshop content is designed
            to evolve with each bi-weekly session.
          </p>
        </div>
      </footer>
    </div>
  );
}
