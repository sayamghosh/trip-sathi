"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    MapPin, Hotel,
    Info, ChevronRight, Check, Clock, Image,
    Car, Eye, UtensilsCrossed
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getTourPlanById } from '../../services/tourPlan.service';
import { requestCallback } from '../../services/callback.service';
import { useAuth } from '../../context/AuthContext';
import { useAuthFlow } from '../../context/AuthFlowContext';
import { getOptimizedImageUrl } from '../../lib/utils';
import type { TourPlanDetailed, TourPlanDay } from '../../types/tourPlan';

type PendingPlanPayload = {
    _id: string;
    title: string;
    guideId?: TourPlanDetailed['guideId'];
};

const WhatsappIcon = ({ size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

export default function TravelerDetailedTourPlan() {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const [plan, setPlan] = useState<TourPlanDetailed | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'itinerary' | 'policies' | 'summary'>('itinerary');
    const [activeDay, setActiveDay] = useState(1);
    const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const [submitting, setSubmitting] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { pendingAction, requestAuth, clearPendingAction } = useAuthFlow();

    const queueAuthFlow = useCallback(() => {
        if (!plan) return;
        requestAuth({
            type: 'CALL_GUIDE',
            payload: {
                plan: {
                    _id: plan._id,
                    title: plan.title,
                    guideId: plan.guideId,
                },
            },
        });
    }, [plan, requestAuth]);

    useEffect(() => {
        if (!id) return;
        getTourPlanById(id as string)
            .then(setPlan)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleWhatsappRequest = useCallback(async () => {
        if (!plan) return;
        if (!isAuthenticated || !user) {
            queueAuthFlow();
            toast('Sign in to contact the guide', { icon: '🔐' });
            return;
        }

        if (!plan.guideId?.phone) {
            toast.error('The guide has not provided a phone number.');
            return;
        }

        try {
            setSubmitting(true);
            await requestCallback({
                tourPlanId: plan._id,
            });
            
            const message = encodeURIComponent(`I am interested for the "${plan.title}"`);
            const phone = plan.guideId.phone.replace(/[^0-9+]/g, '');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            
            toast.success('Redirecting to WhatsApp...');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                queueAuthFlow();
                toast.error('Please sign in to contact the guide.');
            } else if ((error as Error)?.message === 'AUTH_REQUIRED') {
                queueAuthFlow();
            } else {
                toast.error('Could not send request, please try again');
            }
        } finally {
            setSubmitting(false);
        }
    }, [plan, isAuthenticated, user, queueAuthFlow]);

    const resumePendingAction = useCallback(() => {
        if (!pendingAction || !isAuthenticated || !plan) return;
        if (pendingAction.type !== 'CALL_GUIDE') return;
        const pendingPlan = pendingAction.payload?.plan as PendingPlanPayload | undefined;
        if (pendingPlan && pendingPlan._id === plan._id) {
            handleWhatsappRequest();
        }
        clearPendingAction();
    }, [pendingAction, isAuthenticated, plan, handleWhatsappRequest, clearPendingAction]);

    useEffect(() => {
        resumePendingAction();
    }, [resumePendingAction]);

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

    const getDayCounts = (day: TourPlanDay) => {
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
        <div className="min-h-screen bg-[#f5f5f5] pb-28 lg:pb-20 pt-20 font-sans text-gray-800">

            {/* ═══════════ HERO SECTION ═══════════ */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 h-85 rounded-lg overflow-hidden">
                            {/* Main large image */}
                            <div className="md:col-span-5 h-full relative group cursor-pointer overflow-hidden">
                                <img
                                    src={getOptimizedImageUrl(plan.bannerImages[0], 600)}
                                    alt="Banner 1"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
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
                                                    src={getOptimizedImageUrl(img, 300)}
                                                    alt={`Banner ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                    decoding="async"
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
            <div className="sticky top-20 md:top-20 bg-white border-b border-gray-200 z-30 shadow-sm">
                <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 mt-6">

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
                        <div className="hidden lg:block w-45 shrink-0 sticky top-37.5">
                            <div className="sticky top-35">
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
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm scroll-mt-35"
                                        >
                                            {/* Day Header */}
                                            <div className="sticky top-32.5 md:top-35 z-20 bg-white rounded-t-lg px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
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
                                                            <div className="absolute left-5.5 top-10 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                                                        )}

                                                        <div className="relative px-5 py-5">
                                                            {/* Activity Type Header */}
                                                            <div className="flex items-center gap-2.5 mb-4">
                                                                <div className="w-4.5 h-4.5 flex items-center justify-center text-gray-500 z-10 bg-white">
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
                                                                <div className="ml-7.5 border border-gray-200 rounded-lg overflow-hidden">
                                                                    <div className="flex flex-col sm:flex-row">
                                                                        {activity.images && activity.images.length > 0 && (
                                                                            <div className="sm:w-65 h-50 sm:h-auto shrink-0 overflow-hidden">
                                                                                <img
                                                                                    src={getOptimizedImageUrl(activity.images[0], 400)}
                                                                                    alt={activity.title}
                                                                                    className="w-full h-full object-cover"
                                                                                    loading="lazy"
                                                                                    decoding="async"
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
                                                                                    src={getOptimizedImageUrl(img, 100)}
                                                                                    alt={`${activity.title} ${i + 2}`}
                                                                                    className="w-14 h-14 object-cover rounded border border-gray-200"
                                                                                    width={56}
                                                                                    height={56}
                                                                                    loading="lazy"
                                                                                    decoding="async"
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
                                                                <div className="ml-7.5 flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-50 h-35 shrink-0 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={getOptimizedImageUrl(activity.images[0], 400)}
                                                                                alt={activity.title}
                                                                                className="w-full h-full object-cover"
                                                                                loading="lazy"
                                                                                decoding="async"
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
                                                                <div className="ml-7.5 flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-45 h-30 shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                                            <img
                                                                                src={getOptimizedImageUrl(activity.images[0], 300)}
                                                                                alt={activity.title}
                                                                                className="max-w-full max-h-full object-contain"
                                                                                loading="lazy"
                                                                                decoding="async"
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
                                                                <div className="ml-7.5 flex flex-col sm:flex-row gap-4">
                                                                    {activity.images && activity.images.length > 0 && (
                                                                        <div className="w-full sm:w-45 h-30 shrink-0 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={getOptimizedImageUrl(activity.images[0], 300)}
                                                                                alt={activity.title}
                                                                                className="w-full h-full object-cover"
                                                                                loading="lazy"
                                                                                decoding="async"
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
                    <div className="sticky top-35 w-full lg:w-75 shrink-0">
                        <div className="space-y-5">

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

                                    <button
                                        className="w-full text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-70"
                                        style={{ backgroundColor: '#25D366' }}
                                        onClick={handleWhatsappRequest}
                                        disabled={submitting}
                                        type="button"
                                    >
                                        <WhatsappIcon size={18} /> Request via WhatsApp
                                    </button>
                                    <p className="text-center text-[11px] text-gray-500 mt-2.5 flex items-center justify-center gap-1">
                                        <Check size={13} className="text-green-500" /> Connect directly with your assigned guide
                                    </p>
                                    {plan.guideId?.phone && (
                                        <p className="text-center text-xs text-gray-600 mt-1">
                                            Guide phone: <span className="font-semibold text-gray-900">{plan.guideId.phone}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Guide Info */}
                                <div className="bg-gray-50 p-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        {plan.guideId?.profileImage ? (
                                            <img
                                                src={getOptimizedImageUrl(plan.guideId.profileImage, 40)}
                                                alt={plan.guideId.name}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                                                width={40}
                                                height={40}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                {plan.guideId?.name?.charAt(0) || 'G'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-medium">Your Local Guide</p>
                                            <p className="font-bold text-gray-900 text-sm">{plan.guideId?.name || 'Assigned Guide'}</p>
                                            {plan.guideId?.phone && (
                                                <p className="text-xs text-gray-600 mt-0.5">Phone: {plan.guideId.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Best Deals Widget */}
                            <div className="bg-linear-to-br from-brand-dark to-brand-primary rounded-lg p-5 text-white shadow-md">
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

            {/* ═══════════ MOBILE STICKY BOTTOM BAR ═══════════ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.05)] lg:hidden flex justify-between items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400 line-through leading-none mb-1">
                        ₹{Math.round(plan.basePrice * 1.2).toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-end gap-1 leading-none">
                        <span className="text-xl font-black text-gray-900 leading-none">
                            ₹{plan.basePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">/Adult</span>
                    </div>
                </div>
                <button
                    className="flex-1 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-sm disabled:opacity-70 whitespace-nowrap"
                    style={{ backgroundColor: '#25D366' }}
                    onClick={handleWhatsappRequest}
                    disabled={submitting}
                    type="button"
                >
                    <WhatsappIcon size={16} /> Request via WhatsApp
                </button>
            </div>
        </div>
    );
}
