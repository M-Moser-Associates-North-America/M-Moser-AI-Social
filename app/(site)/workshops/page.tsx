import type { Metadata } from 'next';
import { SiteFrame } from '@/components/site/SiteFrame';
import { WorkshopHub } from '@/components/site/WorkshopHub';

export const metadata: Metadata = {
  title: 'Workshops | M Moser AI',
  description: 'Bi-weekly AI Workshop Intelligence sessions for practical team workflows.',
};

export default function WorkshopsPage() {
  return (
    <SiteFrame>
      <WorkshopHub />
    </SiteFrame>
  );
}
