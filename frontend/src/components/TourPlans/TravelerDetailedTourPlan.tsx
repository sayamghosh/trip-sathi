import { useEffect, useRef, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import {
    MapPin, Calendar, Briefcase, Hotel, Utensils,
    Info, ChevronRight, Check, Clock, Image,
    Car, Eye, UtensilsCrossed
} from 'lucide-react';
import { getTourPlanById } from '../../services/tourPlan.service';

interface Activity {
    type: string;
    title: string;
    description?: string;
    duration?: string;
    images?: string[];
    hotelRef?: any;
}

interface Day {
    dayNumber: number;
    title: string;
    activities: Activity[];
}

interface TourPlan {
    _id: string;
    title: string;
    description: string;
    basePrice: number;
    durationDays: number;
    durationNights: number;
    locations: string[];
    bannerImages?: string[];
    days: Day[];
    guideId?: {
        name: string;
        profileImage?: string;
    } | null;
}

export default function TravelerDetailedTourPlan() {
    const { id } = useParams({ strict: false });
    const [plan, setPlan] = useState<TourPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'itinerary' | 'policies' | 'summary'>('itinerary');
    const [activeDay, setActiveDay] = useState(1);
    const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (!id) return;
        getTourPlanById(id as string)
            .then(setPlan)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    // Scroll spy: update active day based on scroll position
    useEffect(() => {
        if (!plan) return;
        const handleScroll = () => {
            let currentDay = 1;
            for (const day of plan.days) {
                const el = dayRefs.current[day.dayNumber];
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200) {
                        currentDay = day.dayNumber;
                    }
                }
            }
            setActiveDay(currentDay);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [plan]);

    const scrollToDay = (dayNumber: number) => {
        setActiveDay(dayNumber);
        const el = dayRefs.current[dayNumber];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'transfer': return <Car className="w-4 h-4" />;
            case 'sightseeing': return <Eye className="w-4 h-4" />;
            case 'hotel': return <Hotel className="w-4 h-4" />;
            case 'meal': return <UtensilsCrossed className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    const getStatsCount = (type: string) => {
        if (!plan) return 0;
        let count = 0;
        plan.days.forEach(day => {
            day.activities.forEach(act => {
                if (act.type.toLowerCase() === type.toLowerCase()) count++;
            });
        });
        return count;
    };

    const getDayCounts = (day: Day) => {
        const counts: Record<string, number> = {};
        day.activities.forEach(act => {
            const t = act.type.toLowerCase();
            counts[t] = (counts[t] || 0) + 1;
        });
        return counts;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-primary"></div>
                    <p className="text-gray-500 text-sm font-medium">Loading tour plan...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Plan Not Found</h2>
                    <p className="text-gray-500">The package you are looking for might have been removed.</p>
                </div>
            </div>
        );
    }

    const hotelCount = getStatsCount('hotel');
    const transferCount = getStatsCount('transfer');
    const mealCount = getStatsCount('meal');
    const activityCount = getStatsCount('sightseeing');

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-20 pt-20 font-sans text-gray-800">

            {/* ═══════════ HERO SECTION ═══════════ */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                        {plan.title}
                    </h1>

                    {/* Badges + Locations */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-5">
                        <span className="border border-gray-300 rounded px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                            {plan.durationNights}N/{plan.durationDays}D
                        </span>
                        {plan.locations.map((loc, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>}
                                <span className="font-medium text-gray-800">{loc}</span>
                            </span>
                        ))}
                    </div>

                    {/* Image Gallery */}
                    {plan.bannerImages && plan.bannerImages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 h-[340px] rounded-lg overflow-hidden">
                            {/* Main large image */}
                            <div className="md:col-span-5 h-full relative group cursor-pointer overflow-hidden">
                                <img
                                    src={plan.bannerImages[0]}
                                    alt="Banner 1"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-2 transition-colors">
                                    <Image size={14} /> VIEW GALLERY →
                                </button>
                            </div>
                            {/* Right grid of 4 images */}
                            <div className="md:col-span-7 grid grid-cols-4 gap-1.5 h-full">
                                {[1, 2, 3, 4, 5, 6].map((idx) => {
                                    const img = plan.bannerImages?.[idx];
                                    if (idx >= 6) return null;
                                    if (!img && idx > (plan.bannerImages?.length ?? 0) - 1) return (
                                        <div key={idx} className="bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <span className="text-xs text-gray-400">No Image</span>
                                        </div>
                                    );
                                    const isLast = idx === 5 && (plan.bannerImages?.length ?? 0) > 6;
                                    return (
                                        <div key={idx} className="relative overflow-hidden group cursor-pointer">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={`Banner ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">No Image</span>
                                                </div>
                                            )}
                                            {isLast && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                                    +{(plan.bannerImages?.length ?? 0) - 6}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════ STICKY TAB NAVIGATION ═══════════ */}
            <div className="sticky top-16 md:top-[80px] bg-white border-b border-gray-200 z-30 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            {(['ITINERARY', 'POLICIES', 'SUMMARY'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                    className={`py-4 px-5 text-sm font-bold tracking-wide transition-colors border-b-[3px] ${activeTab === tab.toLowerCase()
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                {/* ─── Stats Bar ─── */}
                <div className="bg-white border border-gray-200 rounded-lg mb-6 flex items-center flex-wrap shadow-sm">
                    <div className="px-5 py-3">
                        <span className="text-sm font-bold text-brand-primary border border-brand-primary rounded px-3 py-1">
                            {plan.durationDays} DAY PLAN
                        </span>
                    </div>
                    {transferCount > 0 && (
                        <div className="px-5 py-3 border-l border-gray-200 text-center">
                            <span className="text-sm font-bold text-gray-700">{transferCount}</span>
                            <span className="text-sm text-gray-500 ml-1.5 uppercase tracking-wide">Transfers</span>
                        </div>
                    )}
                    {hotelCount > 0 && (
                        <div className="px-5 py-3 border-l border-gray-200 text-center">
                            <span className="text-sm font-bold text-gray-700">{hotelCount}</span>
                            <span className="text-sm text-gray-500 ml-1.5 uppercase tracking-wide">Hotels</span>
                        </div>
                    )}
                    {activityCount > 0 && (
                        <div className="px-5 py-3 border-l border-gray-200 text-center">
                            <span className="text-sm font-bold text-gray-700">{activityCount}</span>
                            <span className="text-sm text-gray-500 ml-1.5 uppercase tracking-wide">Activities</span>
                        </div>
                    )}
                    {mealCount > 0 && (
                        <div className="px-5 py-3 border-l border-gray-200 text-center">
                            <span className="text-sm font-bold text-gray-700">{mealCount}</span>
                            <span className="text-sm text-gray-500 ml-1.5 uppercase tracking-wide">Meals</span>
                        </div>
                    )}
                </div>

                {/* ─── Three-Column Layout ─── */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ═══ LEFT: Day Sidebar ═══ */}
                    {activeTab === 'itinerary' && (
                        <div className="hidden lg:block w-[180px] shrink-0 sticky top-[150px]">
                            <div className="sticky top-[140px]">
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Day Plan</h4>
                                <ul className="space-y-0.5">
                                    {plan.days.map((day) => (
                                        <li key={day.dayNumber}>
                                            <button
                                                onClick={() => scrollToDay(day.dayNumber)}
                                                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2.5 ${activeDay === day.dayNumber
                                                        ? 'bg-brand-primary text-white shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${activeDay === day.dayNumber ? 'bg-white' : 'bg-gray-300'
                                                    }`}></span>
                                                Day {day.dayNumber}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ═══ CENTER: Main Content ═══ */}
                    <div className="flex-1 min-w-0">

                        {/* ITINERARY Tab */}
                        {activeTab === 'itinerary' && (
                            <div className="space-y-6">
                                {plan.days.map((day) => {
                                    const counts = getDayCounts(day);
                                    return (
                                        <div
                                            key={day.dayNumber}
                                            ref={(el) => { dayRefs.current[day.dayNumber] = el; }}
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden scroll-mt-[140px]"
                                        >
                                            {/* Day Header */}
                                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
                                                <span className="bg-[#eb6120] text-white font-bold px-3 py-1 rounded text-sm">
                                                    Day {day.dayNumber}
                                                </span>
                                                <span className="font-semibold text-gray-900">{day.title}</span>
                                                <div className="flex items-center gap-3 ml-auto text-xs text-gray-500 font-medium">
                                                    <span className="uppercase tracking-wide text-gray-400">Included:</span>
                                                    {counts['hotel'] && (
                                                        <span className="flex items-center gap-1">
                                                            <Hotel size={13} /> {counts['hotel']} Hotel{counts['hotel'] > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                    {counts['transfer'] && (
                                                        <span className="flex items-center gap-1">
                                                            <Car size={13} /> {counts['transfer']} Transfer{counts['transfer'] > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                    {counts['sightseeing'] && (
                                                        <span className="flex items-center gap-1">
                                                            <Eye size={13} /> {counts['sightseeing']} Activit{counts['sightseeing'] > 1 ? 'ies' : 'y'}
                                                        </span>
                                                    )}
                                                    {counts['meal'] && (
                                                        <span className="flex items-center gap-1">
                                                            <UtensilsCrossed size={13} /> {counts['meal']} Meal{counts['meal'] > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Activities Timeline */}
                                            <div className="relative">
                                                {day.activities.map((activity, actIdx) => (
                                                    <div key={actIdx} className="relative">
                                                        {/* Timeline vertical line */}
                                                        {actIdx < day.activities.length - 1 && (
                                                            <div className="absolute left-[22px] top-[40px] bottom-0 w-[2px] bg-gray-200 z-0"></div>
                                                        )}

                                                        <div className="relative px-5 py-5">
                                                            {/* Activity Type Header */}
                                                            <div className="flex items-center gap-2.5 mb-4">
                                                                <div className="w-[18px] h-[18px] flex items-center justify-center text-gray-500 z-10 bg-white">
                                                                    {getActivityIcon(activity.type)}
                                                                </div>
                                                                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                                                    {activity.type}
                                                                </span>
                                                                {activity.duration && (
                                                                    <>
                                                                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                                        <span className="text-xs text-gray-500">{activity.duration}</span>
                                                                    </>
                                                                )}
                                                                {activity.type.toLowerCase() !== 'hotel' && (
                                                                    <>
                                                                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                                        <span className="text-xs text-gray-500">{day.title}</span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Activity Content — Horizontal Layout */}
                                                            {activity.type.toLowerCase() === 'hotel' ? (
                                                                /* ─── Hotel Card ─── */
                                                                <div className="ml-[30px] border border-gray-200 rounded-lg overflow-hidden">
                                                                    <div className="flex flex-col sm:flex-row">
                                                                        {activity.images && activity.images.length > 0 && (
                                                                            <div className="sm:w-[260px] h-[200px] sm:h-auto shrink-0 overflow-hidden">
                                                                                <img
                                                                                    src={activity.images[0]}
                                                                                    alt={activity.title}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="p-4 flex-1">
                                                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{activity.title}</h4>
                                                                            {activity.description && (
                                                                                <p className="text-sm text-gray-500 mb-3 line-clamp-3">{activity.description}</p>
                                                                            )}
                                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded border border-green-100">
                                                                                    <Check size={12} /> Breakfast Included
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Hotel thumbnail row */}
                                                                    {activity.images && activity.images.length > 1 && (
                                                                        <div className="px-4 pb-3 flex gap-2">
                                                                            {activity.images.slice(1, 4).map((img, i) => (
                                                                                <img
                                                                                    key={i}
                                                                                    src={img}
                                                                                    alt={`${activity.title} ${i + 2}`}
                                                                                    className="w-14 h-14 object-cover rounded border border-gray-200"
                                                                                />
                                                                            ))}
                                                                            {activity.images.length > 4 && (
                                                                                <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                                                                                    {activity.images.length - 4}+
                                                                                    <br />
                                                                                    <span className="text-[10px]">View All</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : activity.type.toLowerCase() === 'sightseeing' ? (
                                                                /* ─── Sightseeing Card ─── */
                                                                <div className="ml-[30px] flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-[200px] h-[140px] shrink-0 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={activity.images[0]}
                                                                                alt={activity.title}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <h4 className="text-base font-bold text-gray-900 mb-1">{activity.title}</h4>
                                                                        {activity.duration && (
                                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                                                <Clock size={12} /> Duration: {activity.duration}
                                                                            </p>
                                                                        )}
                                                                        {activity.description && (
                                                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                                                {activity.description}
                                                                                {activity.description.length > 150 && (
                                                                                    <span className="text-brand-primary font-medium cursor-pointer ml-1">Read More...</span>
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : activity.type.toLowerCase() === 'transfer' ? (
                                                                /* ─── Transfer Card ─── */
                                                                <div className="ml-[30px] flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-[180px] h-[120px] shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                                            <img
                                                                                src={activity.images[0]}
                                                                                alt={activity.title}
                                                                                className="max-w-full max-h-full object-contain"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <h4 className="text-base font-bold text-gray-900 mb-1">{activity.title}</h4>
                                                                        {activity.description && (
                                                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                                                {activity.description}
                                                                            </p>
                                                                        )}
                                                                        {activity.duration && (
                                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                                                <Clock size={12} /> {activity.duration}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* ─── Generic / Meal Card ─── */
                                                                <div className="ml-[30px] flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-[180px] h-[120px] shrink-0 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={activity.images[0]}
                                                                                alt={activity.title}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <h4 className="text-base font-bold text-gray-900 mb-1">{activity.title}</h4>
                                                                        {activity.description && (
                                                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                                                {activity.description}
                                                                            </p>
                                                                        )}
                                                                        {activity.duration && (
                                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                                                <Clock size={12} /> {activity.duration}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Divider between activities */}
                                                        {actIdx < day.activities.length - 1 && (
                                                            <div className="mx-5 border-b border-gray-100"></div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* POLICIES Tab */}
                        {activeTab === 'policies' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                                <h3 className="text-xl font-bold mb-5 text-gray-900">Cancellation & Policies</h3>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                                        <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                                        <p>Standard policies apply. Please connect with the guide for specific rules regarding this tour plan.</p>
                                    </div>
                                    <ul className="space-y-3 ml-1">
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            Free cancellation up to 7 days before the trip.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            50% refund for cancellations within 3-7 days.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Info size={16} className="text-orange-500 mt-0.5 shrink-0" />
                                            Non-refundable within 48 hours of the journey.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* SUMMARY Tab */}
                        {activeTab === 'summary' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                                <h3 className="text-xl font-bold mb-5 text-gray-900">Tour Summary</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{plan.description}</p>

                                {/* Locations Overview */}
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Places Covered</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.locations.map((loc, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
                                                <MapPin size={13} /> {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ RIGHT: Sticky Pricing Sidebar ═══ */}
                    <div className="w-full lg:w-[300px] shrink-0">
                        <div className="sticky top-[140px] space-y-5">

                            {/* Price Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{Math.round(plan.basePrice * 1.2).toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-xs font-bold text-red-500 uppercase">
                                            20% Off
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-1 mb-0.5">
                                        <span className="text-3xl font-extrabold text-gray-900">
                                            ₹{plan.basePrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-gray-500 text-sm mb-0.5 font-medium">/Adult</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mb-5">Excluding applicable taxes</p>

                                    <button className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm tracking-wide">
                                        REQUEST CALLBACK <ChevronRight size={16} />
                                    </button>
                                    <p className="text-center text-[11px] text-gray-500 mt-2.5 flex items-center justify-center gap-1">
                                        <Check size={13} className="text-green-500" /> Connect directly with your assigned guide
                                    </p>
                                </div>

                                {/* Guide Info */}
                                <div className="bg-gray-50 p-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        {plan.guideId?.profileImage ? (
                                            <img
                                                src={plan.guideId.profileImage}
                                                alt={plan.guideId.name}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                {plan.guideId?.name?.charAt(0) || 'G'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-medium">Your Local Guide</p>
                                            <p className="font-bold text-gray-900 text-sm">{plan.guideId?.name || 'Assigned Guide'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Best Deals Widget */}
                            <div className="bg-gradient-to-br from-brand-dark to-brand-primary rounded-lg p-5 text-white shadow-md">
                                <h4 className="font-bold text-base mb-3 flex items-center gap-2">Best Deals For You</h4>
                                <ul className="space-y-2 mb-4">
                                    <li className="text-sm flex items-start gap-2">
                                        <Check size={14} className="mt-0.5 shrink-0 text-green-300" />
                                        Connect Directly with Local Guides
                                    </li>
                                    <li className="text-sm flex items-start gap-2">
                                        <Check size={14} className="mt-0.5 shrink-0 text-green-300" />
                                        No Hidden Charges
                                    </li>
                                    <li className="text-sm flex items-start gap-2">
                                        <Check size={14} className="mt-0.5 shrink-0 text-green-300" />
                                        Flexible Payment Options
                                    </li>
                                </ul>
                                <button className="w-full bg-white text-brand-primary hover:bg-gray-50 font-bold py-2 rounded-lg text-sm transition-colors">
                                    VIEW OFFERS
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
