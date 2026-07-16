import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import { getOptimizedImageUrl } from '../../lib/utils';
import type { TourPlanSummary } from '../../types/tourPlan';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
const formatDuration = (days: number, nights: number) =>
  `${nights} Night${nights !== 1 ? 's' : ''} / ${days} Day${days !== 1 ? 's' : ''}`;

export function TourPlanCard({ plan }: { plan: TourPlanSummary }) {
  return (
    <Link href={`/guides/${plan._id}`} className="group block h-full">
      <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-52 overflow-hidden">
          <img
            src={getOptimizedImageUrl(plan.bannerImages?.[0] || FALLBACK_IMAGE, 600)}
            alt={plan.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
            <Clock size={14} className="text-brand-primary" />
            {formatDuration(plan.durationDays, plan.durationNights)}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-slate-900 transition-colors group-hover:text-brand-primary">
            {plan.title}
          </h3>
          <div className="flex flex-wrap gap-1 text-[12px] font-medium text-slate-500">
            {(plan.locations ?? []).slice(0, 3).map((loc) => (
              <span key={loc} className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-2 py-1">
                <MapPin size={12} className="text-brand-primary" /> {loc}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xl font-black text-brand-primary">{formatPrice(plan.basePrice)}</p>
            <span className="text-sm font-semibold text-brand-primary group-hover:underline">View details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
