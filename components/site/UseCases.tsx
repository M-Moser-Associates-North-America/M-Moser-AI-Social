'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { platforms, roles, useCases } from '@/data/ai-guide';
import { PlatformLogo } from '@/components/ui/PlatformLogo';

/**
 * Role-based use-cases explorer — shows practical AI applications per role.
 */
export function UseCases() {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const filteredCases = activeRole
    ? useCases.filter((uc) => uc.role === activeRole || uc.role === 'All Roles')
    : useCases;

  return (
    <section
      className="relative z-10 mx-auto max-w-7xl scroll-mt-16 px-6 py-16 md:py-20"
      id="use-cases"
    >
      <div className="mb-14 border-b border-[var(--site-border)] pb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-display text-3xl text-[var(--mint)]">
            03
          </span>
          <h1 className="text-display text-5xl text-[var(--site-text)] md:text-7xl">
            Role-Based Use Cases
          </h1>
        </div>
        <p className="text-[var(--site-text-muted)] text-lg max-w-2xl">
          What does this actually mean for your job? Filter by role to see practical applications of
          these platforms.
        </p>
      </div>

      {/* Role filter pills */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setActiveRole(null)}
          className={`px-4 py-2 rounded-[8px] text-sm font-bold transition-all ${
            activeRole === null
              ? 'bg-[var(--site-text)] text-[var(--site-bg)]'
              : 'bg-[var(--site-surface)] text-[var(--site-text-muted)] hover:bg-[var(--site-surface-hover)] hover:text-[var(--site-text)]'
          }`}
        >
          All Roles
        </button>
        {roles
          .filter((role) => role !== 'All Roles')
          .map((role) => {
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-4 py-2 rounded-[8px] text-sm font-bold transition-all ${
                  activeRole === role
                    ? 'bg-[var(--site-text)] text-[var(--site-bg)]'
                    : 'bg-[var(--site-surface)] text-[var(--site-text-muted)] hover:bg-[var(--site-surface-hover)] hover:text-[var(--site-text)]'
                }`}
              >
                {role}
              </button>
            )
          })}
      </div>

      {/* Use-case cards grid — animates when filter changes */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCases.map((uc, idx) => {
            const platform = platforms.find((p) => p.id === uc.platformId);

            return (
              <motion.div
                layout
                key={`${uc.role}-${uc.platformId}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-[8px] border border-[var(--site-border)] bg-[var(--site-surface)] hover:border-[var(--site-text-muted)] transition-colors group flex flex-col"
              >
                {/* Platform logo + name */}
                <div className="flex items-center gap-3 mb-6">
                  {platform && <PlatformLogo name={platform.name} logo={platform.logo} size={32} />}
                  <span className="text-xs uppercase tracking-widest text-[var(--site-text-muted)] font-semibold">
                    {platform?.name}
                  </span>
                </div>

                <h3 className="text-display text-2xl mb-4">{uc.headline}</h3>
                <p className="text-sm text-[var(--site-text-muted)] leading-relaxed mb-8 flex-1">
                  {uc.description}
                </p>

                {/* Footer: role label + arrow */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--site-border)]">
                  <span className="text-xs uppercase tracking-widest text-[var(--site-text-muted)]">
                    {uc.role}
                  </span>
                  <a
                    href="#platforms"
                    className="text-[var(--site-text-muted)] group-hover:text-[var(--site-text)] transition-colors"
                    aria-label="View platform"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
