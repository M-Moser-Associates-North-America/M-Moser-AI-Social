import type { Metadata } from 'next';
import { SessionOneWorkshop } from '@/components/site/SessionOneWorkshop';
import { SiteFrame } from '@/components/site/SiteFrame';

export const metadata: Metadata = {
  title: 'Session 1: Core Foundations | M Moser AI',
  description: 'Interactive workshop webpage for AI Workshop OS Session 1: Core Foundations.',
};

export default function SessionOnePage() {
  return (
    <SiteFrame>
      <SessionOneWorkshop />
    </SiteFrame>
  );
}
