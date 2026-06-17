import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'M Moser AI Intelligence Platform',
  description: 'A branded learning platform for M Moser AI guidance, workshops, workflows, and community practice.',
};

const untitledSans = localFont({
  src: [
    {
      path: './fonts/UntitledSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/UntitledSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/UntitledSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-untitled-sans',
  display: 'swap',
});

const judge = localFont({
  src: './fonts/F37Judge-MediumCondensed.otf',
  weight: '500',
  style: 'normal',
  variable: '--font-judge',
  display: 'swap',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${untitledSans.variable} ${judge.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning on <body> because next-themes writes data-theme
          before React hydration, which would otherwise cause a mismatch warning. */}
      <body
        className="bg-[var(--bg)] text-[var(--text)] font-[var(--font-sans)] antialiased selection:bg-[var(--accent)]/20"
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
