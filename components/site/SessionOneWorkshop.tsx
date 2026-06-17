'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ChevronLeft,
  Clipboard,
  Copy,
  Eraser,
  Gauge,
  LayoutGrid,
  ListChecks,
  Maximize2,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Sparkles,
  Timer,
} from 'lucide-react';
import { CelebrationModal } from '@/components/community/CelebrationModal';
import {
  accentVar,
  agenda,
  assistantChips as assistantChipDefs,
  buildAssistantInstructions,
  buildDelegationPrompt,
  buildLabPrompt,
  builderFieldOrder,
  builderScenarios,
  customizing,
  delegation,
  delegationFramework,
  delegationSourceEmail,
  enterprise,
  lab,
  labRoughEmail,
  labStaticPrompt,
  library,
  models,
  navSections,
  opening,
  realExamples,
  refinementChips,
  roadmap,
  strongPrompt,
  totalWorkshopSeconds,
  weakPrompt,
  workflowSteps,
  type AccentKey,
  type BuilderKey,
  type InfoCard,
  type SectionId,
} from '@/data/session-one';
import { workshopSessions } from '@/data/workshops';
import { recalculateRewards, LeapterRewardResult } from '@/lib/gamification';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const sectionOrder = navSections.map((section) => section.id);
// Sections that carry a "Mark done" control and gate the reward claim.
// Opening is framing, Roadmap/Library are reference — they are not completable blocks.
const completableIds: SectionId[] = ['enterprise', 'models', 'delegation', 'customizing', 'lab'];
const isCompletable = (id: SectionId) => completableIds.includes(id);

const agendaTimeline = agenda.reduce<{ id: SectionId; start: number; end: number }[]>((acc, item) => {
  const start = acc.length ? acc[acc.length - 1].end : 0;
  acc.push({ id: item.id, start, end: start + item.durationMinutes * 60 });
  return acc;
}, []);

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const seconds = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function currentAgendaIndex(elapsed: number) {
  const idx = agendaTimeline.findIndex((item) => elapsed >= item.start && elapsed < item.end);
  return idx === -1 ? agendaTimeline.length - 1 : idx;
}

export function SessionOneWorkshop() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [slideMode, setSlideMode] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('opening');
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState<Set<SectionId>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const [mindset, setMindset] = useState<'oracle' | 'assistant'>('assistant');
  const [builder, setBuilder] = useState<Record<BuilderKey, string>>(builderScenarios.clientFollowup.values);
  const [chips, setChips] = useState<Set<string>>(
    () => new Set(assistantChipDefs.filter((chip) => chip.checked).map((chip) => chip.label))
  );
  const [labEmail, setLabEmail] = useState(labRoughEmail);

  const [rewardResult, setRewardResult] = useState<(LeapterRewardResult & { type: 'workshop' }) | null>(null);
  const [rewardStatus, setRewardStatus] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const { scrollYProgress } = useScroll();
  const railProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  const timerActive = running && elapsed < totalWorkshopSeconds;

  useEffect(() => {
    if (!timerActive) return;
    const id = window.setInterval(() => {
      setElapsed((current) => Math.min(current + 1, totalWorkshopSeconds));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerActive]);

  // Scrollspy in scroll mode.
  useEffect(() => {
    if (slideMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.12, 0.4, 0.7] }
    );
    sectionOrder.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [slideMode]);

  const elapsedAgendaIndex = currentAgendaIndex(elapsed);
  const liveSectionId = agendaTimeline[elapsedAgendaIndex]?.id;
  const progressPercent = Math.min(100, (elapsed / totalWorkshopSeconds) * 100);
  const allComplete = completableIds.every((id) => completed.has(id));
  const completedCount = completableIds.filter((id) => completed.has(id)).length;
  const completionPercent = Math.round((completedCount / completableIds.length) * 100);

  const generatedDelegation = useMemo(() => buildDelegationPrompt(builder), [builder]);
  const selectedChipLines = useMemo(
    () => assistantChipDefs.filter((chip) => chips.has(chip.label)).map((chip) => chip.line),
    [chips]
  );
  const assistantInstructions = useMemo(() => buildAssistantInstructions(selectedChipLines), [selectedChipLines]);
  const labPrompt = useMemo(() => buildLabPrompt(labEmail), [labEmail]);

  const copyText = useCallback(async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied('Select and copy manually');
    }
    window.setTimeout(() => setCopied(null), 1500);
  }, []);

  const goToSection = useCallback(
    (id: SectionId, opts?: { instant?: boolean }) => {
      const nextIndex = sectionOrder.indexOf(id);
      const currentIndex = sectionOrder.indexOf(activeSection);
      setDirection(nextIndex >= currentIndex ? 1 : -1);
      setActiveSection(id);
      if (!slideMode && !opts?.instant) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (slideMode) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [activeSection, slideMode]
  );

  const move = useCallback(
    (delta: number) => {
      const currentIndex = sectionOrder.indexOf(activeSection);
      const nextIndex = Math.min(sectionOrder.length - 1, Math.max(0, currentIndex + delta));
      goToSection(sectionOrder[nextIndex]);
    },
    [activeSection, goToSection]
  );

  const toggleComplete = useCallback((id: SectionId) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleTimer = () => {
    if (elapsed >= totalWorkshopSeconds) {
      setElapsed(0);
      setRunning(true);
      return;
    }
    setRunning((current) => !current);
  };

  const resetTimer = () => {
    setElapsed(0);
    setRunning(false);
  };

  const toggleSlideMode = () => {
    setSlideMode((current) => {
      const next = !current;
      if (next) window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  };

  const claimReward = useCallback(async () => {
    setRewardStatus(null);
    setClaiming(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setRewardStatus('Sign in to add workshop progress to your Leapter community rewards.');
      setClaiming(false);
      return;
    }
    const reward = await recalculateRewards(session.user.id, 'Workshop OS');
    if (!reward) {
      setRewardStatus('Workshop complete. The reward service could not be reached just now.');
      setClaiming(false);
      return;
    }
    setRewardResult({ ...reward, type: 'workshop' });
    setRewardStatus('Workshop progress synced to Leapter community rewards.');
    setClaiming(false);
  }, []);

  // Keyboard navigation in slide mode.
  useEffect(() => {
    if (!slideMode) return;
    const handler = (event: KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '');
      if (typing) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        move(1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        move(-1);
      }
      if (event.key.toLowerCase() === 'escape') setSlideMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [slideMode, move]);

  const sharedSectionProps = {
    mindset,
    setMindset,
    builder,
    setBuilder,
    chips,
    setChips,
    labEmail,
    setLabEmail,
    generatedDelegation,
    assistantInstructions,
    labPrompt,
    copyText,
    completed,
    toggleComplete,
    allComplete,
    claiming,
    rewardStatus,
    claimReward,
    liveSectionId,
    goToSection,
  };

  return (
    <div className="relative">
      <CelebrationModal
        isOpen={!!rewardResult}
        onClose={() => setRewardResult(null)}
        pointsEarned={rewardResult?.pointsEarned || 0}
        totalPoints={rewardResult?.calculatedTotalPoints || 0}
        badgeEarned={rewardResult?.awardedBadge || null}
        actionType={rewardResult?.type || 'workshop'}
      />

      {/* Top progress + timer bar */}
      <TopBar
        elapsed={elapsed}
        progressPercent={progressPercent}
        liveLabel={
          elapsed >= totalWorkshopSeconds
            ? 'Workshop complete'
            : agenda[elapsedAgendaIndex]?.title ?? 'Ready to begin'
        }
        timerActive={timerActive}
        finished={elapsed >= totalWorkshopSeconds}
        onToggle={toggleTimer}
        onReset={resetTimer}
        onJump={() => liveSectionId && goToSection(liveSectionId)}
      />

      <div className="mx-auto grid max-w-[1400px] gap-0 px-3 sm:px-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Left rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-[150px] py-8 pr-4">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Session map
            </p>
            <nav className="relative grid gap-1.5">
              <span className="pointer-events-none absolute bottom-0 left-[15px] top-0 w-px bg-[var(--border)]" />
              <motion.span
                className="pointer-events-none absolute left-[15px] top-0 w-px origin-top bg-[var(--accent)]"
                style={{ scaleY: railProgress, height: '100%' }}
              />
              {navSections.map((section) => {
                const active = activeSection === section.id;
                const done = completed.has(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={cn(
                      'group relative grid grid-cols-[32px_1fr] items-center gap-3 rounded-[8px] border border-transparent px-2 py-2 text-left transition-all',
                      active
                        ? 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface)]/60 hover:text-[var(--text)]'
                    )}
                  >
                    <span
                      className={cn(
                        'z-10 grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition-colors',
                        active
                          ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                          : done
                            ? 'bg-[var(--mint)] text-white'
                            : 'bg-[var(--surface-sub)] text-[var(--text)]'
                      )}
                    >
                      {done && !active ? <Check className="h-3.5 w-3.5" /> : section.index}
                    </span>
                    <span className="text-sm font-bold">{section.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span>Progress</span>
                <span>{completionPercent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-sub)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent)]"
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
                Session 1 is the operating layer for the series: safe use, model choice, clear
                delegation, personalization, and one reusable workflow.
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 py-6 md:py-8">
          {slideMode ? (
            <div className="min-h-[calc(100vh-220px)]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeSection}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SectionRouter id={activeSection} {...sharedSectionProps} />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {sectionOrder.map((id) => (
                <section key={id} id={id} className="scroll-mt-[150px]">
                  <SectionRouter id={id} {...sharedSectionProps} />
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating presentation dock */}
      <Dock
        slideMode={slideMode}
        timerActive={timerActive}
        position={sectionOrder.indexOf(activeSection)}
        total={sectionOrder.length}
        onPrev={() => move(-1)}
        onNext={() => move(1)}
        onToggleTimer={toggleTimer}
        onToggleSlide={toggleSlideMode}
      />

      {/* Copy toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="fixed bottom-24 right-5 z-[60] flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--text)] px-4 py-3 text-sm font-bold text-[var(--bg)] shadow-2xl"
          >
            <Check className="h-4 w-4 text-[var(--accent)]" />
            {copied === 'Select and copy manually' ? copied : `${copied} copied`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared section props
// ---------------------------------------------------------------------------

type SectionProps = {
  mindset: 'oracle' | 'assistant';
  setMindset: (mode: 'oracle' | 'assistant') => void;
  builder: Record<BuilderKey, string>;
  setBuilder: React.Dispatch<React.SetStateAction<Record<BuilderKey, string>>>;
  chips: Set<string>;
  setChips: React.Dispatch<React.SetStateAction<Set<string>>>;
  labEmail: string;
  setLabEmail: (value: string) => void;
  generatedDelegation: string;
  assistantInstructions: string;
  labPrompt: string;
  copyText: (label: string, text: string) => void;
  completed: Set<SectionId>;
  toggleComplete: (id: SectionId) => void;
  allComplete: boolean;
  claiming: boolean;
  rewardStatus: string | null;
  claimReward: () => void;
  liveSectionId?: SectionId;
  goToSection: (id: SectionId) => void;
};

function SectionRouter({ id, ...props }: { id: SectionId } & SectionProps) {
  switch (id) {
    case 'opening':
      return <OpeningSection {...props} />;
    case 'roadmap':
      return <RoadmapSection {...props} />;
    case 'enterprise':
      return <EnterpriseSection {...props} />;
    case 'models':
      return <ModelsSection {...props} />;
    case 'delegation':
      return <DelegationSection {...props} />;
    case 'customizing':
      return <CustomizingSection {...props} />;
    case 'lab':
      return <LabSection {...props} />;
    case 'library':
      return <LibrarySection {...props} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
  meta,
  id,
  completed,
  onToggleComplete,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: string[];
  id?: SectionId;
  completed?: boolean;
  onToggleComplete?: () => void;
}) {
  return (
    <Reveal className="mb-8 grid gap-6 md:mb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span className="h-2 w-8 bg-[var(--accent)]" />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-display text-4xl leading-[0.95] text-[var(--text)] md:text-6xl">
          {title}
        </h2>
        {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">{lede}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {meta?.map((chip, i) => (
          <span
            key={chip}
            className={cn(
              'inline-flex min-h-9 items-center rounded-[8px] border px-3 py-1.5 text-sm font-bold',
              i === 0
                ? 'border-[var(--text)] bg-[var(--surface)] text-[var(--text)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            )}
          >
            {chip}
          </span>
        ))}
        {id && onToggleComplete && (
          <button
            onClick={onToggleComplete}
            className={cn(
              'inline-flex min-h-9 items-center gap-2 rounded-[8px] px-3 py-1.5 text-sm font-bold transition-colors',
              completed
                ? 'bg-[var(--mint)] text-white'
                : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
            )}
          >
            <Check className="h-4 w-4" />
            {completed ? 'Done' : 'Mark done'}
          </button>
        )}
      </div>
    </Reveal>
  );
}

function CardSurface({
  children,
  className,
  accent,
  delay = 0,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  accent?: AccentKey;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease, delay }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        'relative overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_40px_rgba(29,29,27,0.06)]',
        className
      )}
      style={accent ? { borderTop: `5px solid ${accentVar[accent]}` } : undefined}
    >
      {children}
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5">
      {items.map((item) => (
        <li key={item} className="relative pl-5 text-sm leading-relaxed text-[var(--text-muted)]">
          <span className="absolute left-0 top-[0.5em] h-2 w-2 bg-[var(--accent)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function InfoCardView({ card, delay }: { card: InfoCard; delay: number }) {
  return (
    <CardSurface accent={card.accent} delay={delay} className="p-6">
      <h3 className="text-xl font-bold text-[var(--text)]">{card.title}</h3>
      {card.body && <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{card.body}</p>}
      {card.bullets && <div className="mt-4"><BulletList items={card.bullets} /></div>}
    </CardSurface>
  );
}

function CompareTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[var(--border)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className="bg-[var(--text)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bg)]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="bg-[var(--surface)]">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-t border-[var(--border)] px-4 py-3 align-top text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PromptCard({
  title,
  hint,
  text,
  onCopy,
  variant = 'dark',
  tall,
  className,
}: {
  title: string;
  hint?: string;
  text: string;
  onCopy: () => void;
  variant?: 'dark' | 'muted';
  tall?: boolean;
  className?: string;
}) {
  const dark = variant === 'dark';
  return (
    <CardSurface className={cn('flex flex-col', className)} hover={false}>
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3',
          dark ? 'bg-[var(--text)] text-[var(--bg)]' : 'border-b border-[var(--border)] bg-[var(--surface-sub)]'
        )}
      >
        <div className="min-w-0">
          <h3 className={cn('flex items-center gap-2 text-sm font-bold', dark ? 'text-[var(--bg)]' : 'text-[var(--text)]')}>
            <Clipboard className="h-4 w-4 text-[var(--accent)]" />
            {title}
          </h3>
          {hint && <p className={cn('mt-0.5 text-xs', dark ? 'text-[var(--bg)]/65' : 'text-[var(--text-muted)]')}>{hint}</p>}
        </div>
        <button
          onClick={onCopy}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors',
            dark ? 'bg-white/10 text-[var(--bg)] hover:bg-white/20' : 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90'
          )}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <pre
        className={cn(
          'flex-1 overflow-auto whitespace-pre-wrap break-words p-4 text-sm leading-relaxed deck-scroll',
          dark ? 'bg-[#111110] text-[#f4f4ef]' : 'bg-[var(--surface)] text-[var(--text)]',
          tall ? 'min-h-[280px]' : 'min-h-[150px]'
        )}
      >
        {text}
      </pre>
    </CardSurface>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function OpeningSection({ completed, toggleComplete, liveSectionId, goToSection }: SectionProps) {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_70px_rgba(29,29,27,0.1)]">
      <div className="workshop-aurora" />
      <div className="brand-rule" />
      <div className="relative grid gap-8 p-6 md:p-9 lg:grid-cols-[1.02fr_0.82fr] lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href="/workshops"
            className="mb-7 inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] backdrop-blur hover:border-[var(--text)] hover:text-[var(--text)]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Workshop OS
          </Link>
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <span className="h-2 w-8 bg-[var(--accent)]" />
            {opening.eyebrow}
          </p>
          <h1 className="mt-5 text-display text-5xl leading-[0.9] text-[var(--text)] md:text-7xl">
            {opening.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            {opening.lede}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => goToSection('enterprise')}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-transform hover:-translate-y-0.5"
            >
              <Play className="h-4 w-4" />
              Begin session
            </button>
            <button
              onClick={() => goToSection('delegation')}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--text)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--text)] transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              Open prompt builder
            </button>
          </div>
        </motion.div>

        {/* Live command panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)]/85 p-5 shadow-[0_18px_60px_rgba(29,29,27,0.1)] backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Live workshop
              </p>
              <h3 className="mt-1 text-lg font-bold text-[var(--text)]">Session progress</h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] px-3 py-1.5 text-xs font-bold text-[var(--text)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] animate-live-pulse" />
              60 min flow
            </span>
          </div>

          <div className="mt-4 grid gap-2">
            {agenda.map((item) => {
              const live = liveSectionId === item.id;
              const done = completed.has(item.id);
              const completable = isCompletable(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    'grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-[8px] border p-3 transition-all',
                    live
                      ? 'border-[var(--text)] bg-[var(--surface)] shadow-[inset_6px_0_0_var(--accent)]'
                      : done
                        ? 'border-[var(--mint)] bg-[var(--surface-sub)]/50'
                        : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
                  )}
                >
                  <button
                    onClick={() => goToSection(item.id)}
                    className="grid h-9 place-items-center rounded-[8px] text-xs font-bold text-white"
                    style={{ background: accentVar[item.accent] }}
                    aria-label={`Go to ${item.title}`}
                  >
                    {item.time}
                  </button>
                  <button onClick={() => goToSection(item.id)} className="min-w-0 text-left">
                    <span className="block truncate text-sm font-bold text-[var(--text)]">{item.title}</span>
                    <span className="block truncate text-xs text-[var(--text-muted)]">{item.purpose}</span>
                  </button>
                  {completable ? (
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] transition-colors',
                        done
                          ? 'border-[var(--mint)] bg-[var(--mint)] text-white'
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                      )}
                      aria-pressed={done}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {done ? 'Done' : 'Mark'}
                    </button>
                  ) : (
                    <span className="rounded-[6px] bg-[var(--surface-sub)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {item.chip}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RoadmapSection(_: SectionProps) {
  return (
    <div>
      <SectionHeading eyebrow={roadmap.eyebrow} title={roadmap.title} lede={roadmap.lede} meta={roadmap.meta} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {roadmap.items.map((item, index) => (
          <CardSurface
            key={item.label}
            delay={index * 0.04}
            className={cn('p-5', item.current && 'bg-[var(--text)] text-[var(--bg)]')}
          >
            <p
              className={cn(
                'text-[11px] font-bold uppercase tracking-[0.14em]',
                item.current ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              )}
            >
              {item.label}
            </p>
            <h3 className={cn('mt-6 text-lg font-bold', item.current ? 'text-[var(--bg)]' : 'text-[var(--text)]')}>
              {item.title}
            </h3>
            <p
              className={cn(
                'mt-2 text-sm leading-relaxed',
                item.current ? 'text-[var(--bg)]/75' : 'text-[var(--text-muted)]'
              )}
            >
              {item.copy}
            </p>
          </CardSurface>
        ))}
      </div>
    </div>
  );
}

function EnterpriseSection({ mindset, setMindset, copyText, completed, toggleComplete }: SectionProps) {
  const output = enterprise.mindset[mindset];
  return (
    <div>
      <SectionHeading
        eyebrow={enterprise.eyebrow}
        title={enterprise.title}
        lede={enterprise.lede}
        meta={enterprise.meta}
        id="enterprise"
        completed={completed.has('enterprise')}
        onToggleComplete={() => toggleComplete('enterprise')}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {enterprise.cards.map((card, index) => (
          <InfoCardView key={card.title} card={card} delay={index * 0.06} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CardSurface className="p-6" hover={false}>
          <div className="mb-5 inline-flex gap-2 rounded-[8px] bg-[var(--surface-sub)] p-1">
            {(['oracle', 'assistant'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setMindset(mode)}
                className={cn(
                  'relative rounded-[6px] px-4 py-2 text-sm font-bold capitalize transition-colors',
                  mindset === mode ? 'text-[var(--bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                {mindset === mode && (
                  <motion.span
                    layoutId="mindset-pill"
                    className="absolute inset-0 rounded-[6px] bg-[var(--text)]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{mode}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mindset}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] p-6"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Mindset shift
              </p>
              <h3 className="mt-3 text-display text-3xl text-[var(--text)]">{output.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{output.body}</p>
            </motion.div>
          </AnimatePresence>
        </CardSurface>

        <Reveal>
          <CompareTable head={enterprise.compare.head} rows={enterprise.compare.rows} />
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            ChatGPT is most valuable when the user manages direction, context, review, and refinement.
          </p>
          <button
            onClick={() =>
              copyText(
                'Safe-use reminder',
                'Use the Enterprise workspace. Share only the context needed for the task. Review and verify before using.'
              )
            }
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy safe-use reminder
          </button>
        </Reveal>
      </div>
    </div>
  );
}

function ModelsSection({ copyText, completed, toggleComplete }: SectionProps) {
  return (
    <div>
      <SectionHeading
        eyebrow={models.eyebrow}
        title={models.title}
        lede={models.lede}
        meta={models.meta}
        id="models"
        completed={completed.has('models')}
        onToggleComplete={() => toggleComplete('models')}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {models.cards.map((card, index) => (
          <InfoCardView key={card.title} card={card} delay={index * 0.06} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <CompareTable head={models.compare.head} rows={models.compare.rows} />
        </Reveal>
        <CardSurface className="p-6" hover={false}>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            <Gauge className="h-4 w-4 text-[var(--accent)]" />
            {models.ruleOfThumb.eyebrow}
          </p>
          <h3 className="mt-3 text-xl font-bold leading-snug text-[var(--text)]">
            {models.ruleOfThumb.title}
          </h3>
          {models.ruleOfThumb.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {p}
            </p>
          ))}
          <button
            onClick={() => copyText('Model choice prompt', models.ruleOfThumb.prompt)}
            className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-transform hover:-translate-y-0.5"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy model choice prompt
          </button>
        </CardSurface>
      </div>
    </div>
  );
}

function DelegationSection({
  builder,
  setBuilder,
  generatedDelegation,
  copyText,
  completed,
  toggleComplete,
}: SectionProps) {
  return (
    <div>
      <SectionHeading
        eyebrow={delegation.eyebrow}
        title={delegation.title}
        lede={delegation.lede}
        meta={delegation.meta}
        id="delegation"
        completed={completed.has('delegation')}
        onToggleComplete={() => toggleComplete('delegation')}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {delegationFramework.map((tile, index) => (
          <CardSurface key={tile.title} delay={index * 0.04} className="p-4">
            <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[var(--accent)] text-sm font-bold text-[var(--accent-fg)]">
              {tile.n}
            </span>
            <h3 className="mt-4 text-base font-bold text-[var(--text)]">{tile.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{tile.hint}</p>
          </CardSurface>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <CardSurface accent="accent" className="p-5" hover={false}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Source material
          </p>
          <h3 className="mt-2 text-lg font-bold text-[var(--text)]">{delegation.sourceTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{delegation.sourceCopy}</p>
          <pre className="mt-3 whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] p-4 text-sm leading-relaxed text-[var(--text)]">
            {delegationSourceEmail}
          </pre>
          <button
            onClick={() => copyText('Email', delegationSourceEmail)}
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
          >
            <Copy className="h-3.5 w-3.5" /> Copy email
          </button>
        </CardSurface>

        <PromptCard
          title="Weak prompt"
          hint="The email is included, but the request is still vague."
          text={weakPrompt}
          variant="muted"
          onCopy={() => copyText('Weak prompt', weakPrompt)}
        />
        <PromptCard
          title="Strong prompt"
          hint="Same email, delegated with role, audience, boundaries, and review."
          text={strongPrompt}
          onCopy={() => copyText('Strong prompt', strongPrompt)}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {realExamples.map((example, index) => (
          <CardSurface key={example.title} delay={index * 0.05} className="p-5">
            <strong className="block text-sm font-bold text-[var(--text)]">{example.title}</strong>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--text-muted)]">{example.copy}</span>
          </CardSurface>
        ))}
      </div>

      {/* Prompt Upgrade Builder */}
      <CardSurface className="mt-5 p-6" hover={false}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              Prompt Upgrade Builder
            </p>
            <h3 className="mt-2 text-display text-3xl text-[var(--text)]">Build a Reusable Delegation Prompt</h3>
          </div>
          <span className="rounded-[8px] border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
            Ask → Review → Refine → Reuse
          </span>
        </div>

        <p className="mb-3 text-sm font-bold text-[var(--text)]">Start from a real workplace scenario</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {Object.entries(builderScenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setBuilder(scenario.values)}
              className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-warm)]"
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {builderFieldOrder.map((field) => (
              <label key={field.key} className={cn('grid gap-2', field.tall && 'sm:col-span-2')}>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  {field.label}
                </span>
                <textarea
                  value={builder[field.key]}
                  onChange={(event) =>
                    setBuilder((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  rows={field.tall ? 3 : 4}
                  className="resize-y rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] p-3 text-sm leading-relaxed text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <PromptCard
              title="Generated delegation prompt"
              text={generatedDelegation}
              tall
              onCopy={() => copyText('Delegation prompt', generatedDelegation)}
              className="flex-1"
            />
            <button
              onClick={() => setBuilder({ role: '', context: '', task: '', constraints: '', format: '', quality: '' })}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[var(--border)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear fields
            </button>
          </div>
        </div>
      </CardSurface>
    </div>
  );
}

function CustomizingSection({
  chips,
  setChips,
  assistantInstructions,
  copyText,
  completed,
  toggleComplete,
}: SectionProps) {
  const toggleChip = (label: string) =>
    setChips((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  return (
    <div>
      <SectionHeading
        eyebrow={customizing.eyebrow}
        title={customizing.title}
        lede={customizing.lede}
        meta={customizing.meta}
        id="customizing"
        completed={completed.has('customizing')}
        onToggleComplete={() => toggleComplete('customizing')}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {customizing.instructions.map((instruction) => (
          <PromptCard
            key={instruction.title}
            title={instruction.title}
            hint={instruction.hint}
            text={instruction.text}
            onCopy={() => copyText(instruction.title, instruction.text)}
          />
        ))}
      </div>

      <CardSurface className="mt-5 p-6" hover={false}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Personal Assistant Setup
            </p>
            <h3 className="mt-2 text-display text-3xl text-[var(--text)]">Generate a Preference Snippet</h3>
          </div>
          <span className="rounded-[8px] border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
            Copy into Custom Instructions
          </span>
        </div>

        <p className="mb-3 text-sm font-bold text-[var(--text)]">Response style</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {assistantChipDefs.map((chip) => {
            const active = chips.has(chip.label);
            return (
              <button
                key={chip.label}
                onClick={() => toggleChip(chip.label)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-2 text-sm font-bold transition-all',
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                )}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {chip.label}
              </button>
            );
          })}
        </div>

        <PromptCard
          title="Generated custom instructions"
          text={assistantInstructions}
          tall
          onCopy={() => copyText('Custom instructions', assistantInstructions)}
        />
      </CardSurface>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {[customizing.memoryGood, customizing.memoryAvoid].map((group, index) => (
          <CardSurface key={group.title} delay={index * 0.06} className="overflow-hidden" hover={false}>
            <p className="bg-[var(--text)] px-4 py-3 text-sm font-bold text-[var(--bg)]">{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--text-muted)] first:border-t-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardSurface>
        ))}
      </div>
    </div>
  );
}

function LabSection({
  labEmail,
  setLabEmail,
  labPrompt,
  copyText,
  completed,
  toggleComplete,
  allComplete,
  claiming,
  rewardStatus,
  claimReward,
}: SectionProps) {
  const completedCount = completableIds.filter((id) => completed.has(id)).length;
  return (
    <div>
      <SectionHeading
        eyebrow={lab.eyebrow}
        title={lab.title}
        lede={lab.lede}
        meta={lab.meta}
        id="lab"
        completed={completed.has('lab')}
        onToggleComplete={() => toggleComplete('lab')}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <CardSurface className="overflow-hidden" hover={false}>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-sub)] px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">Rough email</h3>
              <p className="text-xs text-[var(--text-muted)]">Use this sample or a sanitized real email.</p>
            </div>
          </div>
          <div className="p-4">
            <textarea
              value={labEmail}
              onChange={(event) => setLabEmail(event.target.value)}
              rows={12}
              className="w-full resize-y rounded-[8px] border border-[var(--border)] bg-[var(--surface-sub)] p-4 text-sm leading-relaxed text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)]"
            />
          </div>
        </CardSurface>

        <PromptCard
          title="Live composer · optimizer prompt"
          hint="No AI runs here; this prepares the delegation prompt."
          text={labPrompt}
          tall
          onCopy={() => copyText('Optimizer prompt', labPrompt)}
        />
      </div>

      <div className="mt-4">
        <p className="mb-3 text-sm font-bold text-[var(--text)]">Refinement prompts · shape the output</p>
        <div className="flex flex-wrap gap-2">
          {refinementChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => copyText(chip.label, chip.value)}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-warm)]"
            >
              <Copy className="h-3.5 w-3.5 text-[var(--accent)]" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {workflowSteps.map((step, index) => (
          <CardSurface key={step.title} delay={index * 0.05} className="p-5">
            <span className="text-display text-2xl text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
            <strong className="mt-4 block text-sm font-bold text-[var(--text)]">{step.title}</strong>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--text-muted)]">{step.copy}</span>
          </CardSurface>
        ))}
      </div>

      <div className="mt-5">
        <RewardPanel
          allComplete={allComplete}
          completedCount={completedCount}
          totalBlocks={completableIds.length}
          claiming={claiming}
          rewardStatus={rewardStatus}
          onClaim={claimReward}
        />
      </div>

      {/* Static reference of the labelled prompt for go-back reuse */}
      <details className="mt-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <summary className="cursor-pointer text-sm font-bold text-[var(--text)]">
          Show the labelled optimizer prompt template
        </summary>
        <pre className="mt-3 whitespace-pre-wrap rounded-[8px] bg-[#111110] p-4 text-sm leading-relaxed text-[#f4f4ef]">
          {labStaticPrompt}
        </pre>
      </details>
    </div>
  );
}

function LibrarySection({ copyText }: SectionProps) {
  return (
    <div>
      <SectionHeading eyebrow={library.eyebrow} title={library.title} lede={library.lede} meta={library.meta} />
      <div className="grid gap-4 lg:grid-cols-2">
        {library.prompts.map((prompt) => (
          <PromptCard
            key={prompt.title}
            title={prompt.title}
            hint={prompt.hint}
            text={prompt.prompt}
            tall
            onCopy={() => copyText(prompt.title, prompt.prompt)}
          />
        ))}
      </div>

      {/* Closing band + next sessions */}
      <div className="mt-8 overflow-hidden rounded-[8px] bg-[var(--text)] p-8 text-[var(--bg)] md:p-10">
        <div className="brand-rule -mx-8 -mt-8 mb-8 md:-mx-10 md:-mt-10" />
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">AI Workshop OS</p>
        <h3 className="mt-2 text-display text-4xl text-[var(--bg)] md:text-5xl">Prompt. Personalize. Practice.</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--bg)]/70">
          Session 1 artifact for the bi-weekly AI Workshop Series. Come back any time to copy a prompt
          or rebuild a workflow.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workshopSessions.slice(1, 5).map((session) => (
            <Link
              key={session.id}
              href={session.href}
              className="group rounded-[8px] border border-white/15 bg-white/5 p-4 transition-colors hover:border-[var(--accent)] hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-display text-2xl text-[var(--bg)]">
                  {String(session.number).padStart(2, '0')}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[var(--bg)]/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-4 text-sm font-bold text-[var(--bg)]">{session.shortTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--bg)]/60">Planned</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardPanel({
  allComplete,
  completedCount,
  totalBlocks,
  claiming,
  rewardStatus,
  onClaim,
}: {
  allComplete: boolean;
  completedCount: number;
  totalBlocks: number;
  claiming: boolean;
  rewardStatus: string | null;
  onClaim: () => void;
}) {
  return (
    <CardSurface accent="accent" className="p-6" hover={false}>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[var(--accent)] text-[var(--accent-fg)]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Leapter Rewards
            </p>
            <h3 className="mt-1 text-xl font-bold text-[var(--text)]">Claim workshop progress</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
              Mark the five content blocks done — Enterprise, Models, Delegation, Personalize, and Lab —
              using the “Mark done” button on each, or from the live dashboard up top. Then sync this
              session to the Leapter community points and badges.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-[var(--surface-sub)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent)]"
                  animate={{ width: `${Math.round((completedCount / totalBlocks) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)]">
                {completedCount} / {totalBlocks} blocks
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClaim}
          disabled={!allComplete || claiming}
          className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          <Sparkles className="h-4 w-4" />
          {claiming ? 'Syncing…' : allComplete ? 'Claim reward' : `Complete blocks first (${completedCount}/${totalBlocks})`}
        </button>
      </div>
      {rewardStatus && <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">{rewardStatus}</p>}
    </CardSurface>
  );
}

// ---------------------------------------------------------------------------
// Chrome: TopBar + Dock
// ---------------------------------------------------------------------------

function TopBar({
  elapsed,
  progressPercent,
  liveLabel,
  timerActive,
  finished,
  onToggle,
  onReset,
  onJump,
}: {
  elapsed: number;
  progressPercent: number;
  liveLabel: string;
  timerActive: boolean;
  finished: boolean;
  onToggle: () => void;
  onReset: () => void;
  onJump: () => void;
}) {
  const remaining = totalWorkshopSeconds - elapsed;
  return (
    <div className="sticky top-[116px] z-30 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl md:top-[72px]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span className="truncate">{liveLabel}</span>
            <span className="shrink-0">{formatClock(elapsed)} elapsed</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sub)]">
            <motion.div
              className="h-full rounded-full bg-[var(--accent)]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex min-w-[78px] items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-sm font-bold tabular-nums',
              timerActive ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'bg-[var(--text)] text-[var(--bg)]'
            )}
          >
            <Timer className="h-4 w-4" />
            {formatClock(remaining)}
          </div>
          <button
            onClick={onToggle}
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-sub)]"
            aria-label={timerActive ? 'Pause timer' : 'Start timer'}
          >
            {finished ? <RotateCcw className="h-4 w-4" /> : timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={onReset}
            className="hidden h-9 w-9 place-items-center rounded-[8px] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)] sm:grid"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onJump}
            className="hidden h-9 items-center gap-1.5 rounded-[8px] border border-[var(--border)] px-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] md:inline-flex"
          >
            <ListChecks className="h-3.5 w-3.5" />
            Now
          </button>
        </div>
      </div>
    </div>
  );
}

function Dock({
  slideMode,
  timerActive,
  position,
  total,
  onPrev,
  onNext,
  onToggleTimer,
  onToggleSlide,
}: {
  slideMode: boolean;
  timerActive: boolean;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onToggleTimer: () => void;
  onToggleSlide: () => void;
}) {
  const fullscreenRef = useRef(false);
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        fullscreenRef.current = true;
      } else {
        await document.exitFullscreen?.();
        fullscreenRef.current = false;
      }
    } catch {
      /* no-op */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease }}
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/92 p-1.5 shadow-[0_18px_60px_rgba(29,29,27,0.18)] backdrop-blur-xl"
    >
      <button
        onClick={onPrev}
        className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]"
        aria-label="Previous section"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <span className="px-1 text-xs font-bold tabular-nums text-[var(--text-muted)]">
        {String(position + 1).padStart(2, '0')}
        <span className="opacity-50"> / {String(total).padStart(2, '0')}</span>
      </span>
      <button
        onClick={onNext}
        className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]"
        aria-label="Next section"
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      <span className="mx-1 h-6 w-px bg-[var(--border)]" />

      <button
        onClick={onToggleTimer}
        className="grid h-10 w-10 place-items-center rounded-full bg-[var(--text)] text-[var(--bg)] hover:opacity-90"
        aria-label={timerActive ? 'Pause timer' : 'Start timer'}
      >
        {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        onClick={onToggleSlide}
        className={cn(
          'grid h-10 w-10 place-items-center rounded-full transition-colors',
          slideMode ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)]'
        )}
        aria-label="Toggle slide mode"
        title={slideMode ? 'Exit slide mode' : 'Slide mode'}
      >
        {slideMode ? <LayoutGrid className="h-4 w-4" /> : <Presentation className="h-4 w-4" />}
      </button>
      <button
        onClick={toggleFullscreen}
        className="hidden h-10 w-10 place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-sub)] hover:text-[var(--text)] sm:grid"
        aria-label="Toggle fullscreen"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
