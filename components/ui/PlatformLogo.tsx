'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type PlatformLogoProps = {
  name: string;
  logo?: string;
  /** Tile size in pixels. */
  size?: number;
  className?: string;
};

/**
 * Renders an AI platform's official logo (favicon) inside a clean, neutral
 * tile. If the logo fails to load, it falls back to a brand-styled monogram so
 * the layout never breaks.
 */
export function PlatformLogo({ name, logo, size = 56, className }: PlatformLogoProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || !logo;

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-[8px] border border-[var(--site-border)] bg-white',
        className
      )}
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <span
          className="text-display text-[var(--accent)]"
          style={{ fontSize: Math.round(size * 0.42) }}
          aria-hidden
        >
          {name.charAt(0)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- favicon service, no Next/Image optimization needed
        <img
          src={logo}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
