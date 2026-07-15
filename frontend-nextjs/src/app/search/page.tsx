"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, CheckCircle, ChevronLeft, ChevronRight, Heart, Check } from 'lucide-react';
import { searchTourPlans } from '../../services/tourPlan.service';
import { getOptimizedImageUrl } from '../../lib/utils';
import type { TourPlanSummary } from '../../types/tourPlan';
import { useAuth } from "@/context/AuthContext";
import { useAuthFlow } from "@/context/AuthFlowContext";
import { requestCallback } from "@/services/callback.service";
import toast from "react-hot-toast";
import axios from "axios";

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

type DealCardType = {
  id: string;
  label: string;
  location: string;
  name: string;
  rating: string;
  ratingTone: "green" | "blue";
  ratingText: string;
  reviews: string;
  features: string[];
  more: string;
  price: string;
  normalPrice?: string;
  discount?: string;
  rooms: string;
  image: string;
  rawPlan: TourPlanSummary;
};

const getFirstImage = (plan: TourPlanSummary): string => {
    if (plan.bannerImages && plan.bannerImages.length > 0) return plan.bannerImages[0];
    for (const day of plan.days ?? []) {
        for (const activity of day.activities ?? []) {
            if (activity.images && activity.images.length > 0) return activity.images[0];
        }
    }
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
};

const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden animate-pulse">
        <div className="h-55 bg-gray-200" />
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

const popularDestinations = [
    {
        name: "Munnar",
        image: "https://images.unsplash.com/photo-1591089101324-2280d9260000?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Andaman",
        image: "https://images.unsplash.com/photo-1574616343659-f67de01e2681?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Rajasthan",
        image: "https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Kashmir",
        image: "https://images.unsplash.com/photo-1637558929744-024c00b06075?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Kerala",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Sikkim",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&auto=format&fit=crop&q=80",
    },
];

function DealCard({
  deal,
  onWhatsappRequest,
  submitting,
}: {
  deal: DealCardType;
  onWhatsappRequest: (plan: TourPlanSummary) => void;
  submitting: boolean;
}) {
  const ratingClass =
    deal.ratingTone === "blue" ? "bg-[#1877f2]" : "bg-[#00a85a]";

  return (
    <>
      {/* Mobile Card Design (Visible only on mobile/tablet screen sizes) */}
      <div className="md:hidden block">
        <Link href={`/guides/${deal.id}`} className="block">
          <article className="relative flex bg-white border border-[#e8ebef] rounded-2xl overflow-hidden p-3 gap-3 hover:shadow-md transition-shadow">
            {/* Image Column */}
            <div className="relative w-[125px] h-[125px] shrink-0 overflow-hidden rounded-xl bg-gray-50">
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-full object-cover"
              />
              {deal.discount && (
                <span className="absolute left-1.5 top-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  {deal.discount}
                </span>
              )}
              <button
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/30 text-white transition hover:bg-black/50"
                type="button"
                aria-label={`Save ${deal.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-3 w-3 fill-current" />
              </button>
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Labels & Location */}
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#8a8f98]">
                  <span className="truncate max-w-[90px] text-gray-500">{deal.location}</span>
                  <span>&middot;</span>
                  <span className="truncate text-[#1458df]">{deal.label}</span>
                </div>

                {/* Title */}
                <h3 className="mt-0.5 text-[14px] font-bold text-[#2a2d31] leading-tight line-clamp-2">
                  {deal.name}
                </h3>

                {/* Features & Rating */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#858b94] font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{deal.features[0]}</span>
                  </div>
                  <span>&middot;</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#ffb000] fill-[#ffb000] shrink-0" />
                    <span className="font-bold text-[#2a2d31]">{deal.rating}</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA Footer */}
              <div className="mt-1.5 pt-1.5 border-t border-gray-50 flex flex-col gap-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] font-bold text-[#2a2d31]">
                    {deal.price}
                  </span>
                  <span className="text-[10px] text-gray-400">/package</span>
                </div>

                {/* Proper Request Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onWhatsappRequest(deal.rawPlan);
                  }}
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 hover:bg-[#20ba5a] cursor-pointer"
                  style={{ backgroundColor: "#25D366" }}
                  aria-label="Request via WhatsApp"
                >
                  <WhatsappIcon size={14} />
                  <span>Request on WhatsApp</span>
                </button>
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Desktop/Tablet Card Design */}
      <div className="hidden md:block h-full">
        <Link href={`/guides/${deal.id}`} className="block group h-full">
          <article className="overflow-hidden rounded-[9px] border border-[#e8ebef] bg-white transition hover:shadow-md h-full flex flex-col justify-between">
            <div>
              <div className="relative h-[274px] overflow-hidden bg-[#f5f5f5]">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  width={400}
                  height={274}
                  loading="lazy"
                  decoding="async"
                />
                <button
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
                  type="button"
                  aria-label={`Save ${deal.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
                <button
                  className="absolute left-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white transition hover:bg-black/40"
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white transition hover:bg-black/40"
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
              </div>

              <div className="px-5 pt-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#8a8f98]">
                  <span className="rounded-full bg-[#f1f3f5] px-2 py-1 text-[#6b7078]">
                    {deal.label}
                  </span>
                  <span>&middot;</span>
                  <span>{deal.location}</span>
                </div>
                <h3 className="mt-4 text-[18px] font-medium leading-tight tracking-[-0.02em] text-[#2a2d31] lg:text-[22px] group-hover:text-[#1458df] transition-colors">
                  {deal.name}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                  <span
                    className={`${ratingClass} rounded-full px-2 py-0.5 font-bold leading-none text-white`}
                  >
                    {deal.rating}
                  </span>
                  <span
                    className={
                      deal.ratingTone === "blue"
                        ? "font-semibold text-[#1877f2]"
                        : "font-semibold text-[#00a85a]"
                    }
                  >
                    {deal.ratingText}
                  </span>
                  <span className="text-[#9aa0a9]">&middot;</span>
                  <span className="font-medium text-[#858b94]">{deal.reviews}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] font-medium text-[#969ca5]">
                  {deal.features.map((feature) => (
                    <span className="flex min-w-0 items-center gap-1.5" key={feature}>
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#b7bcc4]"
                        strokeWidth={3}
                      />
                      <span className="truncate">{feature}</span>
                    </span>
                  ))}
                  <span className="font-semibold text-[#1458df]">{deal.more}</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="mt-[30px]">
                <div className="flex items-end gap-1">
                  <span className="text-[30px] font-semibold leading-none tracking-[-0.045em] text-[#2b2e33]">
                    {deal.price}
                  </span>
                  <span className="text-[12px] font-medium text-[#565b63]">
                    /night
                  </span>
                </div>
                {deal.normalPrice && deal.discount ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#7b818a]">
                    <span>Normal price</span>
                    <span className="line-through">{deal.normalPrice}/night</span>
                    <span className="rounded-full bg-[#ff2f2f] px-2 py-0.5 text-[11px] font-bold text-white">
                      {deal.discount}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 h-[18px]" />
                )}
                <p className="mt-3 text-[12px] font-medium text-[#7b818a]">
                  {deal.rooms}
                </p>
              </div>
              <button
                className="mt-4 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                style={{ backgroundColor: "#25D366" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onWhatsappRequest(deal.rawPlan);
                }}
                disabled={submitting}
              >
                <WhatsappIcon size={16} /> Request via WhatsApp
              </button>
            </div>
          </article>
        </Link>
      </div>
    </>
  );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const destination = useMemo(() => searchParams.get('destination') || '', [searchParams]);

    const [plans, setPlans] = useState<TourPlanSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { pendingAction, requestAuth, clearPendingAction } = useAuthFlow();

    useEffect(() => {
        setLoading(true);
        searchTourPlans(destination)
            .then(setPlans)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [destination]);

    const handleWhatsappRequest = useCallback(async (plan: TourPlanSummary) => {
        if (!isAuthenticated || !user) {
            requestAuth({ type: "CALL_GUIDE", payload: { plan } });
            toast("Sign in to contact the guide", { icon: "🔐" });
            return;
        }

        if (!plan.guideId?.phone) {
            toast.error("The guide has not provided a phone number.");
            return;
        }

        try {
            setSubmitting(true);
            await requestCallback({
                tourPlanId: plan._id,
            });

            const message = encodeURIComponent(`I am interested for the "${plan.title}"`);
            const phone = plan.guideId.phone.replace(/[^0-9+]/g, "");
            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

            toast.success("Redirecting to WhatsApp...");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                requestAuth({ type: "CALL_GUIDE", payload: { plan } });
                toast.error("Please sign in to contact the guide.");
            } else if ((error as Error)?.message === "AUTH_REQUIRED") {
                requestAuth({ type: "CALL_GUIDE", payload: { plan } });
            } else {
                toast.error("Could not send request, please try again");
            }
        } finally {
            setSubmitting(false);
        }
    }, [isAuthenticated, user, requestAuth]);

    const resumePendingAction = useCallback(() => {
        if (!pendingAction || !isAuthenticated) return;
        if (pendingAction.type === "CALL_GUIDE") {
            const plan = pendingAction.payload?.plan as TourPlanSummary | undefined;
            if (plan) {
                handleWhatsappRequest(plan);
            }
        }
        clearPendingAction();
    }, [pendingAction, isAuthenticated, handleWhatsappRequest, clearPendingAction]);

    useEffect(() => {
        resumePendingAction();
    }, [resumePendingAction]);

    const mappedDeals: DealCardType[] = useMemo(() => {
        return plans.map((plan) => ({
            id: plan._id,
            label: plan.locations.length > 1 ? "Multi-city Package" : "Tour Package",
            location: plan.locations.join(", "),
            name: plan.title,
            rating: "4.7",
            ratingTone: "green",
            ratingText: "Good",
            reviews: "120 Ratings",
            features: [
                `${plan.durationDays} Days / ${plan.durationNights} Nights`,
                "Guided Tours",
                "Local Transfers",
            ],
            more: plan.locations.length > 2
                ? `+${plan.locations.length - 2} more cities`
                : "+5 more",
            price: `₹${plan.basePrice.toLocaleString("en-IN")}`,
            normalPrice: `₹${Math.round(plan.basePrice * 1.15).toLocaleString("en-IN")}`,
            discount: "-15%",
            rooms: "Limited slots available",
            image: getFirstImage(plan),
            rawPlan: plan,
        }));
    }, [plans]);

    return (
        <main className="bg-white pt-32 text-[#202124] sm:pt-20 min-h-screen">
            <section className="mx-auto max-w-[1390px] px-6 pb-20 pt-4 sm:px-10 lg:px-12">
                {/* Popular Destinations pills with quick search functionality */}
                <div className="mb-6 hidden sm:flex flex-col items-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#9aa0a9]">
                        Popular Destinations
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {popularDestinations.map((dest) => (
                            <button
                                key={dest.name}
                                onClick={() => {
                                    router.push(`/search?destination=${encodeURIComponent(dest.name)}`);
                                }}
                                className="pl-1.5 pr-4 py-1.5 text-[12px] font-medium text-gray-600 bg-white border border-[#eaedf1] hover:border-gray-300 hover:bg-gray-50 rounded-full transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                            >
                                <img 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    className="w-5 h-5 rounded-full object-cover shrink-0"
                                />
                                <span>{dest.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count indicator */}
                <div className="mb-5 border-t border-gray-100 pt-4 flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-[#202124]">
                        {loading ? (
                            "Searching packages..."
                        ) : (
                            `${plans.length} ${plans.length === 1 ? 'tour package' : 'tour packages'} found`
                        )}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : plans.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-xl font-medium mb-2">No tour plans found</p>
                            <p className="text-gray-400">We couldn't find any packages matching "{destination}". Try another location!</p>
                        </div>
                    ) : (
                        mappedDeals.map((deal) => (
                            <DealCard
                                key={deal.id}
                                deal={deal}
                                onWhatsappRequest={handleWhatsappRequest}
                                submitting={submitting}
                            />
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-linear-to-b from-[#f4f7fa] to-white pt-28 pb-20 px-4 text-sm text-slate-500">Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
