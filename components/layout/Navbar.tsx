'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { User } from '@supabase/supabase-js';
import { ChevronDown, LogIn, LogOut, Moon, Sun } from 'lucide-react';
import mmoserLogo from '@/assets/mmoser-logo-rgb.jpg';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    label: 'Home',
    match: ['/'],
  },
  {
    href: '/guide',
    label: 'AI Guide',
    match: ['/guide'],
    menu: [
      { href: '/guide', label: 'Overview', description: 'One-page AI guide' },
      { href: '/guide#platforms', label: 'Platforms', description: 'Tool mental models' },
      { href: '/guide#ecosystems', label: 'Ecosystems', description: 'Features and workflows' },
      { href: '/guide#use-cases', label: 'Use Cases', description: 'Role-based examples' },
    ],
  },
  {
    href: '/workshops',
    label: 'Workshops',
    match: ['/workshops'],
    menu: [
      { href: '/workshops', label: 'Workshop OS', description: 'Series roadmap' },
      { href: '/workshops/session-1', label: 'Session 1', description: 'Core foundations' },
    ],
  },
  {
    href: '/feed',
    label: 'Community',
    match: ['/feed', '/leaderboard', '/profile'],
    menu: [
      { href: '/feed', label: 'Feed', description: 'Shared AI workflows' },
      { href: '/leaderboard', label: 'Leaderboard', description: 'Points and badges' },
      { href: '/profile', label: 'Profile', description: 'Your saved practice' },
    ],
  },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (matches: string[]) =>
    matches.some((match) => (match === '/' ? pathname === '/' : pathname.startsWith(match)));

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 shadow-[0_18px_60px_rgba(29,29,27,0.08)] backdrop-blur-xl">
      <div className="brand-rule" />
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-[var(--text)] hover:opacity-75"
          aria-label="M Moser AI home"
        >
          <Image
            src={mmoserLogo}
            alt="M Moser Associates"
            width={160}
            height={15}
            priority
            className="h-auto w-32 sm:w-40"
          />
          <span className="hidden border-l border-[var(--border)] pl-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] lg:block">
            AI
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.match);
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors',
                    active
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]'
                  )}
                >
                  {item.label}
                  {item.menu && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {item.menu && (
                  <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 pt-3 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_70px_rgba(29,29,27,0.16)]">
                      {item.menu.map((menuItem) => (
                        <Link
                          key={menuItem.href}
                          href={menuItem.href}
                          className="block rounded-[8px] p-3 hover:bg-[var(--surface-sub)]"
                        >
                          <span className="block text-sm font-bold text-[var(--text)]">
                            {menuItem.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-[var(--text-muted)]">
                            {menuItem.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {user ? (
            <button
              onClick={handleSignOut}
              className="grid h-9 w-9 place-items-center rounded-[8px] bg-[var(--text)] text-[var(--bg)] hover:opacity-85 sm:w-auto sm:px-3"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 sm:hidden" />
              <span className="hidden text-xs font-bold uppercase tracking-[0.12em] sm:inline">
                Sign Out
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="grid h-9 w-9 place-items-center rounded-[8px] bg-[var(--text)] text-[var(--bg)] hover:opacity-85 sm:w-auto sm:px-3"
              aria-label="Sign in"
              title="Sign in"
            >
              <LogIn className="h-4 w-4 sm:hidden" />
              <span className="hidden text-xs font-bold uppercase tracking-[0.12em] sm:inline">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-[var(--border)] px-4 py-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'shrink-0 rounded-[8px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em]',
              isActive(item.match)
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-sub)]'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
