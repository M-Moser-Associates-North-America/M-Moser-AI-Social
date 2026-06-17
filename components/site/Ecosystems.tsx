'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ecosystems, platforms } from '@/data/ai-guide';
import { PlatformLogo } from '@/components/ui/PlatformLogo';

/**
 * Tabbed ecosystem explorer — shows features for each AI platform.
 */
export function Ecosystems() {
  const [activeTab, setActiveTab] = useState(ecosystems[0]?.platformId ?? '');

  return (
    <section
      className="relative z-10 mx-auto max-w-7xl scroll-mt-16 px-6 py-16 md:py-20"
      id="ecosystems"
    >
      <div className="mb-14 border-b border-[var(--site-border)] pb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-display text-3xl text-[var(--cyan)]">02</span>
          <h1 className="text-display text-5xl text-[var(--site-text)] md:text-7xl">The Ecosystems</h1>
        </div>
        <p className="text-[var(--site-text-muted)] text-lg max-w-2xl">
          What lives inside each platform beyond the front door. Explore the specific features and
          tools available.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Platform tab list (scrolls horizontally on mobile) */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 lg:w-64 shrink-0">
          {ecosystems.map((eco) => {
            const platform = platforms.find((p) => p.id === eco.platformId);
            const isActive = activeTab === eco.platformId;

            return (
              <button
                key={eco.platformId}
                onClick={() => setActiveTab(eco.platformId)}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 rounded-[8px] text-left transition-all whitespace-nowrap lg:whitespace-normal',
                  isActive
                    ? 'bg-[var(--site-text)] text-[var(--site-bg)]'
                    : 'text-[var(--site-text-muted)] hover:text-[var(--site-text)] hover:bg-[var(--site-surface-hover)]'
                )}
              >
                {platform && <PlatformLogo name={platform.name} logo={platform.logo} size={24} />}
                <span className="font-medium">{eco.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feature cards for the selected platform */}
        <div className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            {ecosystems.map((eco) => {
              if (eco.platformId !== activeTab) return null;

              return (
                <motion.div
                  key={eco.platformId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {eco.features.map((feature) => (
                    <div
                      key={feature.name}
                      className="p-6 rounded-[8px] border border-[var(--site-border)] bg-[var(--site-surface)] hover:border-[var(--site-text-muted)] transition-colors"
                    >
                      <h4 className="font-bold text-lg mb-2">{feature.name}</h4>
                      <p className="text-sm text-[var(--site-text-muted)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
