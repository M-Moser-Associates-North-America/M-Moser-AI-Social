import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  MessageSquareText,
  Network,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { SiteFrame } from '@/components/site/SiteFrame';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import { platforms } from '@/data/ai-guide';
import { workshopSessions } from '@/data/workshops';

const primaryDestinations = [
  {
    title: 'AI Guide',
    eyebrow: 'Reference',
    description: 'Compare platforms, ecosystems, and role-based ways to apply AI at work.',
    href: '/guide',
    icon: BookOpen,
    color: 'var(--accent)',
  },
  {
    title: 'Workshops',
    eyebrow: 'Course',
    description: 'Run bi-weekly training sessions with webpage presentations and hands-on labs.',
    href: '/workshops',
    icon: CalendarDays,
    color: 'var(--cyan)',
  },
  {
    title: 'Community',
    eyebrow: 'Practice',
    description: 'Share workflows, prompts, examples, and lessons from real project work.',
    href: '/feed',
    icon: Trophy,
    color: 'var(--mint)',
  },
];

const operatingLoops = [
  'Choose the right AI work mode',
  'Delegate with clear context',
  'Review and refine the output',
  'Reuse the workflow with the team',
];

export default function HomePage() {
  const activeSession = workshopSessions.find((session) => session.status === 'available');
  const featuredPlatforms = platforms.slice(0, 6);

  return (
    <SiteFrame>
      <section className="mx-auto grid min-h-[calc(100vh-116px)] max-w-7xl gap-10 px-6 py-12 md:min-h-[calc(100vh-72px)] md:grid-cols-[1.04fr_0.96fr] md:items-center md:py-16">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            M Moser AI Intelligence Platform
          </div>
          <h1 className="text-display max-w-4xl text-6xl leading-[0.86] text-[var(--text)] sm:text-7xl lg:text-[112px]">
            Learn. Apply. Share.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
            A single home for AI guidance, workshop sessions, and the internal community practice
            that turns experiments into repeatable workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/workshops/session-1"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--accent-fg)] hover:opacity-90"
            >
              Open Session 1
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--text)] hover:bg-[var(--surface-sub)]"
            >
              Read AI Guide
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {primaryDestinations.map((destination) => {
            const Icon = destination.icon;
            return (
              <Link
                key={destination.title}
                href={destination.href}
                className="group rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_60px_rgba(29,29,27,0.08)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-sub)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[var(--surface-warm)]">
                    <Icon className="h-5 w-5" style={{ color: destination.color }} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--text)]" />
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {destination.eyebrow}
                </p>
                <h2 className="mt-2 text-display text-4xl text-[var(--text)]">{destination.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {destination.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]/70 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Operating loop
            </p>
            <h2 className="mt-3 text-display text-5xl text-[var(--text)] md:text-6xl">
              One practice language
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {operatingLoops.map((loop, index) => (
              <div
                key={loop}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4"
              >
                <span className="text-display text-3xl text-[var(--accent)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-6 text-sm font-bold leading-snug text-[var(--text)]">{loop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Platform guide
              </p>
              <h2 className="mt-2 text-display text-4xl text-[var(--text)]">Core tools</h2>
            </div>
            <Link
              href="/guide"
              className="rounded-[8px] border border-[var(--border)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]"
            >
              Guide
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {featuredPlatforms.map((platform) => (
              <Link
                href="/guide#platforms"
                key={platform.id}
                className="flex items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] p-3 hover:border-[var(--border-strong)]"
              >
                <PlatformLogo name={platform.name} logo={platform.logo} size={40} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--text)]">
                    {platform.name}
                  </span>
                  <span className="block truncate text-xs text-[var(--text-muted)]">
                    {platform.mentalModel}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--text)] p-6 text-[var(--bg)]">
          <div className="brand-rule -mx-6 -mt-6 mb-6 rounded-t-[8px]" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--bg)]/70">
                Next workshop
              </p>
              <h2 className="mt-2 text-display text-5xl text-[var(--bg)]">
                Session {activeSession?.number ?? 1}
              </h2>
            </div>
            <BrainCircuit className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h3 className="mt-8 text-2xl font-bold text-[var(--bg)]">
            {activeSession?.title ?? 'Core Foundation'}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--bg)]/70">
            {activeSession?.outcome ??
              'Use Enterprise safely, choose the right work mode, and delegate clearly.'}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/workshops/session-1"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--accent-fg)] hover:opacity-90"
            >
              Open
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--bg)] hover:bg-white/10"
            >
              Share
              <MessageSquareText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <Link
          href="/feed"
          className="group flex flex-col justify-between gap-8 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-strong)] md:flex-row md:items-center"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-[var(--surface-warm)]">
              <Network className="h-5 w-5 text-[var(--magenta)]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Community rewards
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text)]">
                Points and badges are awarded when people post, reply, and try new AI tools.
              </h2>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-[var(--accent)] transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </SiteFrame>
  );
}
