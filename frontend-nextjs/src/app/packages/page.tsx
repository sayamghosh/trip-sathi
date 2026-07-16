"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Check,
  MapPin,
} from "lucide-react";
import tourPlanService from "@/services/tourPlan.service";
import type { TourPlanSummary } from "@/types/tourPlan";
import { siteConfig } from "@/config/site";
import { requestCallback } from "@/services/callback.service";
import { useAuth } from "@/context/AuthContext";
import { useAuthFlow } from "@/context/AuthFlowContext";
import { requestLenisResize } from "@/components/SmoothScroll";
import { getOptimizedImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

type DealCard = {
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

function ImageTile({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={getOptimizedImageUrl(src, 400)}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
      decoding="async"
      width={400}
      height={236}
    />
  );
}

const destinations = [
  {
    id: 1,
    name: "Munnar",
    image:
      "https://images.unsplash.com/photo-1591089101324-2280d9260000?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Andaman",
    image:
      "https://images.unsplash.com/photo-1574616343659-f67de01e2681?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Rajasthan",
    image:
      "https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: 4,
    name: "Punjab",
    image:
      "https://images.unsplash.com/photo-1716541792733-1e90c165c411?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Kashmir",
    image:
      "https://images.unsplash.com/photo-1637558929744-024c00b06075?w=1000&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: 7,
    name: "Sikkim",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: 8,
    name: "Goa",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800&h=1200",
  },
];

export default function PackagesPage() {
  const [realDeals, setRealDeals] = useState<DealCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { pendingAction, requestAuth, clearPendingAction } = useAuthFlow();

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

  const fetchPlans = async (query = "") => {
    setLoading(true);
    try {
      const data = query
        ? await tourPlanService.searchTourPlans(query)
        : await tourPlanService.getAllTourPlans();

      // Map backend data to DealCard structure
      const mappedDeals: DealCard[] = data.map((plan: TourPlanSummary) => ({
        id: plan._id,
        label:
          plan.locations.length > 1 ? "Multi-city Package" : "Tour Package",
        location: plan.locations.join(", "),
        name: plan.title,
        rating: "4.7", // Default rating as not in schema
        ratingTone: "green",
        ratingText: "Good",
        reviews: "120 Ratings",
        features: [
          `${plan.durationDays} Days / ${plan.durationNights} Nights`,
          "Guided Tours",
          "Local Transfers",
        ],
        more:
          plan.locations.length > 2
            ? `+${plan.locations.length - 2} more cities`
            : "+5 more",
        price: `₹${plan.basePrice.toLocaleString("en-IN")}`,
        normalPrice: `₹${Math.round(plan.basePrice * 1.15).toLocaleString("en-IN")}`,
        discount: "-15%",
        rooms: "Limited slots available",
        image: plan.bannerImages?.[0] || destinations[0].image,
        rawPlan: plan,
      }));

      setRealDeals(mappedDeals);
    } catch (error) {
      console.error("Error fetching tour plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // The skeleton -> real grid swap changes page height; nudge Lenis to
  // recalculate its scroll boundaries immediately instead of waiting on
  // its debounced ResizeObserver (see requestLenisResize for why).
  useEffect(() => {
    if (loading) return;
    const frame = requestAnimationFrame(() => requestLenisResize());
    return () => cancelAnimationFrame(frame);
  }, [loading, realDeals]);

  // Decode card images off the scroll path. Even optimized images pay a
  // one-time main-thread decode the first time they paint; doing it now
  // (while the user reads the top of the page) keeps the JS-driven Lenis
  // scroll from hitching when the cards later scroll into view.
  useEffect(() => {
    if (loading || realDeals.length === 0) return;
    let cancelled = false;
    realDeals.forEach((deal) => {
      const img = new Image();
      img.src = getOptimizedImageUrl(deal.image, 400);
      if (cancelled) return;
      img.decode?.().catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [loading, realDeals]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isHidden = !entry.isIntersecting && entry.boundingClientRect.top < 80;
        window.dispatchEvent(new CustomEvent('packagesSearchVisibility', { 
          detail: { isVisible: !isHidden } 
        }));
      },
      { 
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px'
      }
    );

    const searchBar = document.getElementById('packages-search-bar');
    if (searchBar) observer.observe(searchBar);

    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    fetchPlans(searchQuery);
  };

  return (
    <main className="bg-white pt-20 text-[#202124] lg:pt-24">
      <section className="mx-auto max-w-[1390px] px-6 pb-[142px] pt-8 sm:px-10 lg:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.72fr]">
          <h1 className="max-w-[650px] text-[32px] font-medium leading-[1.1] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]">
            Find Destination That Match Your Trip
          </h1>
          <p className="max-w-[430px] justify-self-start pt-8 text-[14px] font-normal leading-[1.65] text-[#73777f] lg:justify-self-center lg:text-[16px]">
            Browse hotels by location, price, and real reviews, then compare
            options side by side before you book.
          </p>
        </div>

        <div className="mt-[66px] grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {destinations.slice(0, 5).map((destination) => (
            <div
              className="relative h-[236px] overflow-hidden rounded-[10px] bg-[#f3f3f3]"
              key={destination.name}
            >
              <img
                src={getOptimizedImageUrl(destination.image, 400)}
                alt={destination.name}
                className="h-full w-full object-cover"
                width={400}
                height={236}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1390px] px-6 pb-[108px] sm:px-10 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-[440px] text-[24px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px] lg:text-[40px]">
            Best-Value Destination for Your Next Trip
          </h2>

          <div 
            id="packages-search-bar"
            className="group flex flex-1 max-w-[620px] min-h-[64px] items-center rounded-full border border-[#eaedf1] bg-white p-1.5 pl-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] focus-within:border-[#1458df] focus-within:ring-4 focus-within:ring-[#1458df]/5"
          >
            <div className="flex flex-1 items-center gap-3.5">
              <MapPin className="h-4.5 w-4.5 text-[#1458df]" />
              <label className="flex flex-1 flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a9]">
                  Destination
                </span>
                <input
                  className="h-6 w-full border-0 p-0 text-[14px] font-medium text-[#2a2d31] outline-none placeholder:text-[#767b84]"
                  placeholder="Where are you going?"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </label>
            </div>

            <button
              onClick={handleSearch}
              className="ml-3 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#1458df] px-8 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(20,88,223,0.15)] transition-all duration-300 hover:bg-[#1049ba] hover:shadow-[0_8px_16px_rgba(20,88,223,0.25)] active:scale-95"
              type="button"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Search className="h-4.5 w-4.5" />
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[9px] border border-[#e8ebef] bg-white">
                <div className="h-[274px] animate-pulse bg-[#f0f2f5]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0f2f5]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#f0f2f5]" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-[#f0f2f5]" />
                </div>
              </div>
            ))}
          </div>
        ) : realDeals.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {realDeals.map((deal, index) => (
              <DealCard
                deal={deal}
                key={`${deal.name}-${index}`}
                onWhatsappRequest={handleWhatsappRequest}
                submitting={submitting}
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 py-20 text-center">
            <h3 className="text-[20px] font-medium text-[#2b2e33]">
              No packages found
            </h3>
            <p className="mt-2 text-[#73777f]">
              Try searching for a different destination.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1511px] px-2 pb-3 mt-8">
        <div className="relative overflow-hidden rounded-[20px] bg-[#333]">
          <div className="absolute inset-0">
            <ImageTile
              src={destinations[0].image}
              alt="Travel CTA background"
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative mx-auto flex min-h-[400px] max-w-[700px] flex-col items-center justify-center px-6 py-20 text-center text-white">
            <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
              Ready to Book Your Next Hotel Stay?
            </h2>
            <p className="mt-6 max-w-[480px] text-[14px] font-normal leading-[1.6] text-white/85 lg:text-[16px]">
              Compare prices, explore reviews, and secure the perfect room for
              your trip in just a few clicks.
            </p>
            <a
              href="/search"
              className="mt-10 rounded-full bg-[#1458df] px-10 py-4 text-[15px] font-bold text-white transition hover:bg-[#1049ba]"
            >
              Start Exploring with {siteConfig.projectName}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function DealCard({
  deal,
  onWhatsappRequest,
  submitting,
}: {
  deal: DealCard;
  onWhatsappRequest: (plan: TourPlanSummary) => void;
  submitting: boolean;
}) {
  const ratingClass =
    deal.ratingTone === "blue" ? "bg-[#1877f2]" : "bg-[#00a85a]";

  return (
    <Link href={`/guides/${deal.id}`} className="block group">
      <article className="overflow-hidden rounded-[9px] border border-[#e8ebef] bg-white transition hover:shadow-md h-full flex flex-col justify-between">
        <div>
          <div className="relative h-[274px] overflow-hidden bg-[#f5f5f5]">
            <img
              src={getOptimizedImageUrl(deal.image, 400)}
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
            className="mt-4 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors"
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
  );
}
