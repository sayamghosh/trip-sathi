import type { Metadata } from 'next';
import { siteConfig } from '../../../config/site';
import { getTourPlanById } from '../../../services/tourPlan.service';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const plan = await getTourPlanById(id);
    const locations = plan.locations?.join(', ');
    const title = `${plan.title}${locations ? ` in ${locations}` : ''} | ${siteConfig.projectName}`;
    const description = plan.description
      ? plan.description.slice(0, 155)
      : `${plan.durationDays} days / ${plan.durationNights} nights with a local guide${locations ? ` in ${locations}` : ''}.`;

    return {
      title,
      description,
      alternates: { canonical: `/guides/${id}` },
      openGraph: {
        title,
        description,
        url: `/guides/${id}`,
        images: plan.bannerImages?.[0] ? [{ url: plan.bannerImages[0] }] : undefined,
      },
    };
  } catch {
    // Fall back to generic metadata rather than failing the page render if
    // the backend is briefly unreachable or the plan no longer exists.
    return {
      title: `Tour Package | ${siteConfig.projectName}`,
      alternates: { canonical: `/guides/${id}` },
    };
  }
}

export default function GuideDetailLayout({ children }: Props) {
  return children;
}
