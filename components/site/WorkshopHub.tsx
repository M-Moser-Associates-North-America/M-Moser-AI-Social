'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Presentation,
  Route,
} from 'lucide-react';
import { workshopSessions } from '@/data/workshops';
import { agenda } from '@/data/session-one';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

const heroStats = [
  { icon: Clock3, label: '60 minutes', accent: 'var(--accent)' },
  { icon: Route, label: '6 timed blocks', accent: 'var(--cyan)' },
  { icon: Presentation, label: 'Slide mode', accent: 'var(--magenta)' },
  { icon: CheckCircle2, label: 'Live lab', accent: 'var(--mint)' },
];

export function WorkshopHub() {
  const activeSession = workshopSessions.find((session) => session.status === 'available');

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-20">
      <div className="workshop-aurora opacity-60" />

      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-[8px] border border-[var(--site-border)] bg-[var(--site-surface)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--site-text-muted)]">
            <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
            Bi-weekly Workshop Intelligence
          </div>
          <h1 className="text-display text-6xl leading-[0.9] text-[var(--site-text)] md:text-8xl">
            AI Workshop OS
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--site-text-muted)]">
            A course-like learning path for moving from casual AI use to repeatable, safe,
            high-value team workflows. Each session is an interactive presentation you can present
            live, then come back to and reuse.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.2 + index * 0.06 }}
                className="rounded-[8px] border border-[var(--site-border)] bg-[var(--site-surface)] p-3"
              >
                <stat.icon className="mb-3 h-4 w-4" style={{ color: stat.accent }} />
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--site-text-muted)]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.1 }}
          >
            <Link
              href={activeSession.href}
              className="deck-sheen group relative block overflow-hidden rounded-[8px] border border-[var(--site-border)] bg-[var(--site-surface)] shadow-[0_24px_70px_rgba(29,29,27,0.12)] transition-colors hover:border-[var(--accent)]"
            >
              <div className="brand-rule" />
              <div className="p-6 md:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--site-text-muted)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-live-pulse" />
                      Available now
                    </p>
                    <h2 className="mt-3 text-display text-5xl text-[var(--site-text)] md:text-6xl">
                      Session {activeSession.number}
                    </h2>
                    <h3 className="mt-1 text-xl font-bold text-[var(--site-text)]">{activeSession.title}</h3>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] transition-transform group-hover:rotate-12">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[var(--site-text-muted)]">{activeSession.outcome}</p>

                <div className="mt-6 grid gap-2">
                  {agenda.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[8px] border border-[var(--site-border)] bg-[var(--surface-sub)]/60 px-3 py-2"
                    >
                      <span className="grid h-7 min-w-[44px] place-items-center rounded-[6px] text-[11px] font-bold text-white" style={{ background: accentToVar(item.accent) }}>
                        {item.time}
                      </span>
                      <span className="text-sm font-bold text-[var(--site-text)]">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      <div className="relative mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-display text-3xl text-[var(--site-text)] md:text-4xl">The full series</h2>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--site-text-muted)]">
            8 sessions
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workshopSessions.map((session, index) => {
            const isAvailable = session.status === 'available';
            const card = (
              <motion.article
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease, delay: (index % 4) * 0.05 }}
                whileHover={{ y: -5 }}
                className={cn(
                  'flex h-full flex-col rounded-[8px] border bg-[var(--site-surface)] p-5 transition-colors',
                  isAvailable
                    ? 'border-[var(--accent)] shadow-[0_14px_45px_rgba(255,103,31,0.14)]'
                    : 'border-[var(--site-border)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="text-display text-4xl text-[var(--site-text)]">
                    {String(session.number).padStart(2, '0')}
                  </span>
                  {isAvailable ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
                  ) : (
                    <LockKeyhole className="h-5 w-5 text-[var(--text-faint)]" />
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--site-text-muted)]">
                  {session.shortTitle}
                </p>
                <h3 className="mt-3 text-xl font-bold text-[var(--site-text)]">{session.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--site-text-muted)]">
                  {session.outcome}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--site-border)] pt-4 text-xs font-bold uppercase tracking-[0.1em] text-[var(--site-text-muted)]">
                  <span>{isAvailable ? 'Open session' : 'Planned'}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </motion.article>
            );

            return isAvailable ? (
              <Link key={session.id} href={session.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={session.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function accentToVar(accent: string) {
  return `var(--${accent === 'accent' ? 'accent' : accent})`;
}
