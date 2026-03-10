import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, CheckCircle, Search } from 'lucide-react'
import { searchTourPlans } from '../services/tourPlan.service'
import { getOptimizedImageUrl } from '../lib/utils'
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

  const navigate = useNavigate()

  // Extract the destination query operation manually from the URL itself
  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get('destination') || '';

  const [localDestination, setLocalDestination] = useState(destination)
  const [plans, setPlans] = useState<TourPlanSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLocalDestination(destination)
  }, [destination])

  useEffect(() => {
    setLoading(true);
    searchTourPlans(destination)
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [destination])

  const handleSearch = () => {
      if (localDestination.trim() || localDestination === '') {
          navigate({
              to: '/search',
              search: { destination: localDestination.trim() || undefined }
          });
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleSearch();
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fa] to-white pt-28 pb-20 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 flex flex-col items-center text-center sticky top-24 z-[5]">

          {/* Search Bar Wrapper */}
          <div className="w-full max-w-xl sm:max-w-3xl">
              <div className="bg-white/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-full flex items-center shadow-lg border border-gray-200/50 transition-shadow duration-300 hover:shadow-xl">
                  <input
                      type="text"
                      value={localDestination}
                      onChange={(e) => setLocalDestination(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Where do you want to go?"
                      className="flex-1 bg-transparent outline-none text-gray-800 font-medium px-5 sm:px-6 text-base sm:text-lg w-full placeholder-gray-400"
                  />
                  <button
                      onClick={handleSearch}
                      className="bg-brand-primary hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full flex items-center gap-2 font-bold transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer text-sm shadow-md shadow-brand-primary/20"
                  >
                      <Search size={16} className="sm:hidden" />
                      <Search size={18} className="hidden sm:block" />
                      <span className="hidden sm:inline">search</span>
                  </button>
              </div>
          </div>
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
                            className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full overflow-hidden flex flex-col"
                        >
                            <div className="h-[240px] overflow-hidden relative">
                                <img
                                    src={getOptimizedImageUrl(getFirstImage(plan), 600)}
                                    alt={plan.title}
                                    width={600}
                                    height={240}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80&fm=webp';
                                    }}
                                />
                                {/* Dark gradient overlay to make tags/text pop, although we just have a duration tag right now */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
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
                                                <span key={loc} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-100 shadow-sm rounded-full px-2.5 py-1">
                                                    <MapPin size={12} className="text-brand-primary" /> {loc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                                        <Star size={14} className="text-amber-400" fill="currentColor" /> 5.0
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
                                            <img src={getOptimizedImageUrl(plan.guideId.profileImage, 40)} className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm" alt={plan.guideId.name} width={40} height={40} loading="lazy" decoding="async" />
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
