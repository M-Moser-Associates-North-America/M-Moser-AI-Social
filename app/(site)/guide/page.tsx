import type { Metadata } from 'next';
import { GuidePage } from '@/components/site/GuidePage';

export const metadata: Metadata = {
  title: 'AI Guide | M Moser AI',
  description: 'A practical one-page guide to AI platforms, ecosystems, and role-based use cases.',
};

export default function AiGuidePage() {
  return <GuidePage />;
}
