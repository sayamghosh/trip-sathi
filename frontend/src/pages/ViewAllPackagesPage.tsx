import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import { getAllTourPlans } from '../services/tourPlan.service';
import { getOptimizedImageUrl } from '../lib/utils';
import type { TourPlanSummary } from '../types/tourPlan';

const PLANS_PER_PAGE = 9;

const getFirstImage = (plan: TourPlanSummary): string => {
  if (plan.bannerImages && plan.bannerImages.length > 0) {
    return plan.bannerImages[0];
  }

  for (const day of plan.days ?? []) {
    for (const activity of day.activities ?? []) {
      if (activity.images && activity.images.length > 0) {
        return activity.images[0];
      }
    }
  }

  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
};

const formatPrice = (price: number) => `Rs ${price.toLocaleString('en-IN')}`;
const formatDuration = (days: number, nights: number) => `${nights}N / ${days}D`;

const SkeletonCard = () => (
  <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg overflow-hidden animate-pulse">
    <div className="h-[220px] bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

const ViewAllPackagesPage = () => {
  const [plans, setPlans] = useState<TourPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'priceLow' | 'priceHigh' | 'durationShort'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllTourPlans()
      .then((data) => {
        setPlans(data);
        setError(null);
      })
      .catch(() => setError('Could not load packages right now. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const locationOptions = useMemo(() => {
    const unique = new Set<string>();
    for (const plan of plans) {
      for (const location of plan.locations ?? []) {
        const trimmed = location.trim();
        if (trimmed) {
          unique.add(trimmed);
        }
      }
    }
    return ['all', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [plans]);

  const filteredAndSortedPlans = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    const filtered = plans.filter((plan) => {
      const matchesSearch =
        lowerSearch.length === 0 ||
        plan.title.toLowerCase().includes(lowerSearch) ||
        (plan.locations ?? []).some((location) => location.toLowerCase().includes(lowerSearch));

      const matchesLocation =
        locationFilter === 'all' || (plan.locations ?? []).some((location) => location === locationFilter);

      return matchesSearch && matchesLocation;
    });

    const sorted = [...filtered];
    if (sortBy === 'priceLow') {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'priceHigh') {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'durationShort') {
      sorted.sort((a, b) => a.durationDays - b.durationDays);
    }

    return sorted;
  }, [plans, searchTerm, locationFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPlans.length / PLANS_PER_PAGE));
  const startIndex = (currentPage - 1) * PLANS_PER_PAGE;
  const paginatedPlans = filteredAndSortedPlans.slice(startIndex, startIndex + PLANS_PER_PAGE);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef4ff] via-[#f7faff] to-white pt-28 pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white border border-blue-100 shadow-[0_10px_40px_rgba(19,81,216,0.08)] p-6 sm:p-8 lg:p-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-brand-primary uppercase tracking-[0.18em] mb-2">Explore More</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display leading-tight">
                View All Tour Packages
              </h1>
              <p className="text-gray-600 mt-3 max-w-2xl">
                Discover hand-crafted itineraries from verified guides. Filter by destination, compare pricing,
                and open any package to see full day-wise details.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f7ff] border border-blue-100 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Packages Available</p>
              <p className="text-3xl font-black text-brand-primary leading-none mt-1">{filteredAndSortedPlans.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-8">
            <label className="md:col-span-2 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or destination"
                className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>

            <label>
              <span className="sr-only">Filter by location</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Destinations' : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative">
              <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <span className="sr-only">Sort packages</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'priceLow' | 'priceHigh' | 'durationShort')}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="newest">Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="durationShort">Duration: Shortest</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-6 py-5 text-sm">{error}</div>
        ) : paginatedPlans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white text-center px-6 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No packages found</h2>
            <p className="text-gray-500">Try changing your search text, location, or sorting preference.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPlans.map((plan, index) => (
                <Link to="/allpackages/$id" params={{ id: plan._id }} key={plan._id} className="block">
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-white rounded-[22px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden h-full"
                  >
                    <div className="h-[220px] overflow-hidden relative">
                      <img
                        src={getOptimizedImageUrl(getFirstImage(plan), 700)}
                        alt={plan.title}
                        width={700}
                        height={220}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80&fm=webp';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-gray-800 shadow-sm">
                        <Clock3 size={14} className="text-brand-primary" />
                        {formatDuration(plan.durationDays, plan.durationNights)}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                          {plan.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md shrink-0">
                          <Star size={12} fill="currentColor" /> 5.0
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[12px] text-gray-500 font-medium">
                        {(plan.locations ?? []).slice(0, 3).map((location) => (
                          <span key={location} className="inline-flex items-center gap-1 bg-[#f7f9ff] border border-gray-100 rounded-full px-2.5 py-1">
                            <MapPin size={12} className="text-brand-primary" />
                            {location}
                          </span>
                        ))}
                        {(plan.locations ?? []).length === 0 && (
                          <span className="inline-flex items-center gap-1 bg-[#f7f9ff] border border-gray-100 rounded-full px-2.5 py-1">
                            <MapPin size={12} className="text-brand-primary" />
                            India
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-bold">Starting From</p>
                          <p className="text-2xl font-black text-brand-primary leading-none">{formatPrice(plan.basePrice)}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                          View Details <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const active = page === currentPage;
                  return (
                    <button
                      type="button"
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg border text-sm font-bold transition-colors ${
                        active
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default ViewAllPackagesPage;
