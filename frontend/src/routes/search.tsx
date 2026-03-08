import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, CheckCircle } from 'lucide-react'
import { searchTourPlans } from '../services/tourPlan.service'
import type { TourPlanSummary } from '../types/tourPlan'

const searchSchema = z.object({
  destination: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchComponent,
})

// UI Helpers (borrowed from PopularPackages)
const getFirstImage = (plan: TourPlanSummary): string => {
    if (plan.bannerImages && plan.bannerImages.length > 0) return plan.bannerImages[0];
    for (const day of plan.days ?? []) {
        for (const activity of day.activities ?? []) {
            if (activity.images && activity.images.length > 0) return activity.images[0];
        }
    }
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80`;
};

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
const formatDuration = (days: number, nights: number) => `${nights} Night${nights !== 1 ? 's' : ''} / ${days} Day${days !== 1 ? 's' : ''}`;

const buildFeatureList = (plan: TourPlanSummary) => {
    const locations = plan.locations?.filter(Boolean) ?? [];
    const cityHighlight = locations.length > 0 ? `${locations.slice(0, 2).join(' · ')}` : 'Signature highlights';
    return [
        `${plan.durationDays} Days / ${plan.durationNights} Nights itinerary`,
        `${cityHighlight}`,
        'Local guide & curated experiences',
    ];
};

const SkeletonCard = () => (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg overflow-hidden animate-pulse">
        <div className="h-[220px] bg-gray-200" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="flex justify-between pt-4 border-t border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
        </div>
    </div>
);

function SearchComponent() {
  Route.useSearch() // Trigger re-renders on route search changes

  // Extract the destination query operation manually from the URL itself
  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get('destination') || '';

  const [plans, setPlans] = useState<TourPlanSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    searchTourPlans(destination)
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [destination])

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
            Search Results
          </h1>
          {destination ? (
            <p className="text-gray-500 text-lg md:text-xl">
              Showing amazing trips and packages for <span className="font-bold text-brand-primary">{destination}</span>
            </p>
          ) : (
            <p className="text-gray-500 text-lg md:text-xl">
              Showing all available top destinations and packages.
            </p>
          )}
        </div>
          
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : plans.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-xl font-medium mb-2">No tour plans found</p>
                    <p className="text-gray-400">We couldn't find any packages matching "{destination}". Try another location!</p>
                </div>
            ) : (
                plans.map((plan, index) => (
                    <Link to="/guides/$id" params={{ id: plan._id }} key={plan._id} className="block">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#F8FAFF] rounded-[24px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full overflow-hidden flex flex-col"
                        >
                            <div className="h-[240px] overflow-hidden relative">
                                <img
                                    src={getFirstImage(plan)}
                                    alt={plan.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
                                    }}
                                />
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[12px] font-bold text-gray-800 shadow-sm border border-white/20">
                                    <Clock size={14} className="text-brand-primary" />
                                    {formatDuration(plan.durationDays, plan.durationNights)}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col gap-4 flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                            {plan.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 mt-3 text-[12px] text-gray-500 font-semibold">
                                            {(plan.locations ?? []).slice(0, 3).map((loc) => (
                                                <span key={loc} className="inline-flex items-center gap-1 bg-white border border-gray-200 shadow-sm rounded-full px-2.5 py-1">
                                                    <MapPin size={12} className="text-brand-primary" /> {loc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg">
                                        <Star size={12} fill="currentColor" /> 5.0
                                    </div>
                                </div>

                                <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
                                    {buildFeatureList(plan).map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5">
                                            <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {plan.guideId?.profileImage ? (
                                            <img src={plan.guideId.profileImage} className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm" alt={plan.guideId.name} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full border border-gray-200 bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shadow-sm">
                                                {plan.guideId?.name?.[0]?.toUpperCase() ?? 'G'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Guided by</p>
                                            <p className="text-sm font-bold text-gray-800">{plan.guideId?.name ?? 'Experienced Guide'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-bold">From</p>
                                        <p className="text-2xl font-black text-brand-primary leading-none">{formatPrice(plan.basePrice)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))
            )}
        </div>

      </div>
    </div>
  )
}
