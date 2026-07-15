import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, Clock, MapPin, Package } from 'lucide-react';
import { siteConfig } from '../../../config/site';
import { getGuideChannel, getGuideTourPlans } from '../../../services/guideChannel.service';
import { getOptimizedImageUrl } from '../../../lib/utils';

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

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
const formatDuration = (days: number, nights: number) => `${nights} Night${nights !== 1 ? 's' : ''} / ${days} Day${days !== 1 ? 's' : ''}`;

export default async function GuideChannelPage({ params }: Props) {
  const { username } = await params;
  const guide = await getGuideChannel(username);

  if (!guide) {
    notFound();
  }

  const plans = await getGuideTourPlans(guide.id).catch(() => []);

  return (
    <main className="bg-white min-h-screen">
      {/* Channel header */}
      <div className="bg-linear-to-br from-brand-dark via-brand-primary to-brand-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-white">
            <div className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10">
              {guide.picture ? (
                <img src={getOptimizedImageUrl(guide.picture, 200)} alt={guide.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl font-black">
                  {guide.name?.[0]?.toUpperCase() ?? 'G'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">{guide.name}</h1>
                <BadgeCheck className="h-7 w-7 text-emerald-300 shrink-0" />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-medium text-white/85">
                <span>@{guide.username}</span>
                {guide.address && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {guide.address}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Package className="h-4 w-4" /> {guide.totalPackages} package{guide.totalPackages !== 1 ? 's' : ''}
                </span>
              </div>
              {guide.bio && (
                <p className="mt-4 max-w-xl text-sm sm:text-base text-white/90 leading-relaxed">{guide.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Packages grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-8">
          Packages by {guide.name}
        </h2>

        {plans.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-lg">No packages published yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Link href={`/guides/${plan._id}`} key={plan._id} className="block">
                <div className="bg-[#F8FAFF] rounded-[20px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full overflow-hidden">
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={getOptimizedImageUrl(plan.bannerImages?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', 600)}
                      alt={plan.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-gray-800 shadow-sm">
                      <Clock size={14} className="text-brand-primary" />
                      {formatDuration(plan.durationDays, plan.durationNights)}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                      {plan.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 text-[12px] text-gray-500 font-medium">
                      {(plan.locations ?? []).slice(0, 3).map((loc) => (
                        <span key={loc} className="inline-flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-1">
                          <MapPin size={12} className="text-brand-primary" /> {loc}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-xl font-black text-brand-primary">{formatPrice(plan.basePrice)}</p>
                      <span className="text-sm font-semibold text-brand-primary group-hover:underline">View details</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
