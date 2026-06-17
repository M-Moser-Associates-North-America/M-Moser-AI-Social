import type {Metadata} from 'next';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'M Moser AI Hub',
  description: 'Gamified AI learning and sharing platform for M Moser Associates.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning on <body> because next-themes writes data-theme
          before React hydration, which would otherwise cause a mismatch warning. */}
      <body
        className="bg-[var(--bg)] text-[var(--text)] font-sans antialiased selection:bg-[var(--text)]/10"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
