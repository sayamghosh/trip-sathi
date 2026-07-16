import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BadgeCheck, Package } from 'lucide-react';
import { siteConfig } from '../../../config/site';
import { getGuideChannel, getGuideTourPlans } from '../../../services/guideChannel.service';
import { getOptimizedImageUrl } from '../../../lib/utils';
import { ShareProfileButton } from '../../../components/guide/ShareProfileButton';
import { ProfileTabs } from '../../../components/guide/ProfileTabs';
import { TourPlanCard } from '../../../components/guide/TourPlanCard';
import { Button } from '../../../components/ui/button';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const guide = await getGuideChannel(username);

  if (!guide) {
    return { title: `Guide Not Found | ${siteConfig.projectName}` };
  }

  const title = `${guide.name} - Local Travel Guide | ${siteConfig.projectName}`;
  const description = guide.bio
    ? guide.bio.slice(0, 155)
    : `Browse tour packages from ${guide.name}, a verified local guide on ${siteConfig.projectName}.`;

  return {
    title,
    description,
    alternates: { canonical: `/guide/${username}` },
    openGraph: {
      title,
      description,
      url: `/guide/${username}`,
      images: guide.picture ? [{ url: guide.picture }] : undefined,
    },
  };
}

export default async function GuideChannelPage({ params }: Props) {
  const { username } = await params;
  const guide = await getGuideChannel(username);

  if (!guide) {
    notFound();
  }

  const plans = await getGuideTourPlans(guide.id).catch(() => []);
  const memberSinceYear = new Date(guide.memberSince).getFullYear();

  const stats = [
    { label: 'Packages', value: guide.totalPackages },
    { label: 'Member since', value: Number.isNaN(memberSinceYear) ? '—' : memberSinceYear },
  ];

  return (
    <main className="min-h-screen bg-white pt-15">
      {/* Soft gradient banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-fuchsia-50 to-orange-50" />
        <div className="absolute top-0 left-1/4 h-56 w-72 -translate-y-1/3 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-0 right-1/3 h-48 w-64 -translate-y-1/4 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="relative h-32 sm:h-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Identity row */}
        <div className="-mt-20 flex flex-col gap-8 sm:-mt-24 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[28px] bg-slate-100 shadow-xl ring-4 ring-white sm:h-44 sm:w-44">
              {guide.picture ? (
                <img
                  src={getOptimizedImageUrl(guide.picture, 250)}
                  alt={guide.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-5xl font-black text-brand-primary">
                  {guide.name?.[0]?.toUpperCase() ?? 'G'}
                </div>
              )}
            </div>

            <div className="pt-2 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {guide.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-primary px-2 py-0.5 text-xs font-bold text-white">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm font-medium text-slate-500 sm:text-base">
                @{guide.username}
                {guide.address ? ` · ${guide.address}` : ''}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <ShareProfileButton className="rounded-lg bg-slate-900 text-white hover:bg-slate-800" />
                <Button asChild variant="outline" className="rounded-lg">
                  <a href="#packages">View packages</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 lg:pb-1">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div id="packages" className="mt-10 scroll-mt-24">
          <ProfileTabs
            tabs={[
              {
                key: 'packages',
                label: 'Packages',
                count: plans.length,
                content:
                  plans.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                      <Package className="h-8 w-8 text-slate-300" />
                      <p className="text-lg text-slate-400">No packages published yet — check back soon.</p>
                    </div>
                  ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {plans.map((plan) => (
                        <TourPlanCard key={plan._id} plan={plan} />
                      ))}
                    </div>
                  ),
              },
              {
                key: 'about',
                label: 'About',
                content: (
                  <div className="max-w-2xl">
                    {guide.bio ? (
                      <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">{guide.bio}</p>
                    ) : (
                      <p className="text-base text-slate-400">{guide.name} hasn&apos;t added a bio yet.</p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
