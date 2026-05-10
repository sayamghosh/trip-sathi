'use client';
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Search, Check } from "lucide-react";
import tourPlanService from "@/services/tourPlan.service";
import type { TourPlanSummary } from "@/types/tourPlan";

type DealCard = {
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
};

const destinations = [
  {
    id: 1,
    name: 'Munnar',
    image: 'https://images.unsplash.com/photo-1591089101324-2280d9260000?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Andaman',
    image: 'https://images.unsplash.com/photo-1574616343659-f67de01e2681?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?auto=format&fit=crop&q=80&w=800&h=1200',
  },
  {
    id: 4,
    name: 'Punjab',
    image: 'https://images.unsplash.com/photo-1716541792733-1e90c165c411?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1637558929744-024c00b06075?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800&h=1200',
  },
  {
    id: 7,
    name: 'Sikkim',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800&h=1200',
  },
  {
    id: 8,
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800&h=1200',
  },
];

export default function PackagesPage() {
    const [realDeals, setRealDeals] = useState<DealCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPlans = async (query = "") => {
        setLoading(true);
        try {
            const data = query 
                ? await tourPlanService.searchTourPlans(query)
                : await tourPlanService.getAllTourPlans();
            
            // Map backend data to DealCard structure
            const mappedDeals: DealCard[] = data.map((plan: TourPlanSummary) => ({
                label: plan.locations.length > 1 ? "Multi-city Package" : "Tour Package",
                location: plan.locations.join(", "),
                name: plan.title,
                rating: "4.7", // Default rating as not in schema
                ratingTone: "green",
                ratingText: "Good",
                reviews: "120 Ratings",
                features: [
                    `${plan.durationDays} Days / ${plan.durationNights} Nights`,
                    "Guided Tours",
                    "Local Transfers"
                ],
                more: plan.locations.length > 2 ? `+${plan.locations.length - 2} more cities` : "+5 more",
                price: `₹${plan.basePrice.toLocaleString('en-IN')}`,
                normalPrice: `₹${Math.round(plan.basePrice * 1.15).toLocaleString('en-IN')}`,
                discount: "-15%",
                rooms: "Limited slots available",
                image: plan.bannerImages?.[0] || destinations[0].image
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
                        Browse hotels by location, price, and real reviews, then compare options side by side before you book.
                    </p>
                </div>

                <div className="mt-[66px] grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {destinations.slice(0, 5).map((destination) => (
                        <div className="relative h-[236px] overflow-hidden rounded-[10px] bg-[#f3f3f3]" key={destination.name}>
                            <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1390px] px-6 pb-[108px] sm:px-10 lg:px-12">
                <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.72fr]">
                    <h2 className="max-w-[440px] text-[24px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px] lg:text-[40px]">
                        Best-Value Destination for Your Next Trip
                    </h2>
                    <p className="max-w-[420px] justify-self-start pt-7 text-[14px] font-normal leading-[1.65] text-[#73777f] lg:justify-self-center lg:text-[16px]">
                        Highly rated stays with great locations, fair prices, and trusted guest reviews.
                    </p>
                </div>

                <div className="mt-[60px] flex min-h-[92px] items-center rounded-[10px] border border-[#eaedf1] bg-white px-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                    <label className="flex flex-1 flex-col gap-1.5 pl-1">
                        <span className="text-[12px] font-semibold text-[#404348]">Destination</span>
                        <input
                            className="h-5 w-full border-0 p-0 text-[13px] font-medium text-[#767b84] outline-none placeholder:text-[#767b84]"
                            placeholder="Enter destination"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </label>
                    <div className="mr-8 hidden h-10 w-px bg-[repeating-linear-gradient(to_right,#edf0f4_0,#edf0f4_1px,transparent_1px,transparent_10px)] sm:block sm:w-[88px]" />
                    <button 
                        onClick={handleSearch}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1458df] px-6 text-[12px] font-semibold text-white transition hover:bg-[#1049ba]" 
                        type="button"
                    >
                        <Search className="h-3.5 w-3.5" />
                        {loading ? "Searching..." : "Search Best Deals"}
                    </button>
                </div>

                {loading ? (
                    <div className="mt-20 flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1458df] border-t-transparent" />
                        <p className="mt-4 text-[#73777f]">Fetching real-time packages...</p>
                    </div>
                ) : realDeals.length > 0 ? (
                    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {realDeals.map((deal, index) => (
                            <DealCard deal={deal} key={`${deal.name}-${index}`} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-20 py-20 text-center">
                        <h3 className="text-[20px] font-medium text-[#2b2e33]">No packages found</h3>
                        <p className="mt-2 text-[#73777f]">Try searching for a different destination.</p>
                    </div>
                )}
            </section>

            <section className="mx-auto max-w-[1504px] px-2 pb-2 mt-8">
                <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[20px] bg-[#9d9d9d] text-center text-white">
                    <img src={destinations[4].image} alt="Travel stay" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
                    <div className="absolute inset-0 bg-[#777]/45" />
                    <div className="relative max-w-[560px] px-5">
                        <h2 className="text-[28px] font-medium leading-tight tracking-[-0.03em] sm:text-[36px] lg:text-[42px]">
                            Ready to Book Your Next Hotel Stay?
                        </h2>
                        <p className="mx-auto mt-4 max-w-[430px] text-[14px] font-normal leading-[1.55] text-white/85 lg:text-[16px]">
                            Compare prices, explore reviews, and secure the perfect room for your trip in just a few clicks.
                        </p>
                        <button className="mt-8 rounded-full bg-[#1458df] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1049ba]">
                            Start Exploring with Tripsathi
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

function DealCard({ deal }: { deal: DealCard }) {
    const ratingClass = deal.ratingTone === "blue" ? "bg-[#1877f2]" : "bg-[#00a85a]";

    return (
        <article className="overflow-hidden rounded-[9px] border border-[#e8ebef] bg-white">
            <div className="relative h-[274px] overflow-hidden bg-[#f5f5f5]">
                <img src={deal.image} alt={deal.name} className="h-full w-full object-cover" />
                <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white" type="button" aria-label={`Save ${deal.name}`}>
                    <Heart className="h-4 w-4 fill-current" />
                </button>
                <button className="absolute left-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white" type="button" aria-label="Previous image">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white" type="button" aria-label="Next image">
                    <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
            </div>

            <div className="px-5 pb-5 pt-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#8a8f98]">
                    <span className="rounded-full bg-[#f1f3f5] px-2 py-1 text-[#6b7078]">{deal.label}</span>
                    <span>&middot;</span>
                    <span>{deal.location}</span>
                </div>
                <h3 className="mt-4 text-[18px] font-medium leading-tight tracking-[-0.02em] text-[#2a2d31] lg:text-[22px]">{deal.name}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                    <span className={`${ratingClass} rounded-full px-2 py-0.5 font-bold leading-none text-white`}>{deal.rating}</span>
                    <span className={deal.ratingTone === "blue" ? "font-semibold text-[#1877f2]" : "font-semibold text-[#00a85a]"}>{deal.ratingText}</span>
                    <span className="text-[#9aa0a9]">&middot;</span>
                    <span className="font-medium text-[#858b94]">{deal.reviews}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] font-medium text-[#969ca5]">
                    {deal.features.map((feature) => (
                        <span className="flex min-w-0 items-center gap-1.5" key={feature}>
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#b7bcc4]" strokeWidth={3} />
                            <span className="truncate">{feature}</span>
                        </span>
                    ))}
                    <span className="font-semibold text-[#1458df]">{deal.more}</span>
                </div>

                <div className="mt-[58px]">
                    <div className="flex items-end gap-1">
                        <span className="text-[30px] font-semibold leading-none tracking-[-0.045em] text-[#2b2e33]">{deal.price}</span>
                        <span className="text-[12px] font-medium text-[#565b63]">/night</span>
                    </div>
                    {deal.normalPrice && deal.discount ? (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#7b818a]">
                            <span>Normal price</span>
                            <span className="line-through">{deal.normalPrice}/night</span>
                            <span className="rounded-full bg-[#ff2f2f] px-2 py-0.5 text-[11px] font-bold text-white">{deal.discount}</span>
                        </div>
                    ) : (
                        <div className="mt-2 h-[18px]" />
                    )}
                    <p className="mt-5 text-[12px] font-medium text-[#7b818a]">{deal.rooms}</p>
                </div>
            </div>
        </article>
    );
}
