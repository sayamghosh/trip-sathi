"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ArrowRight, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getAllTourPlans } from '../services/tourPlan.service';
import { requestCallback } from '../services/callback.service';
import { useAuth } from '../context/AuthContext';
import { useAuthFlow } from '../context/AuthFlowContext';
import { getOptimizedImageUrl } from '../lib/utils';
import type { TourPlanSummary } from '../types/tourPlan';

const WhatsappIcon = ({ size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

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
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80`;
};

const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

const formatDuration = (days: number, nights: number) =>
    `${nights} Night${nights !== 1 ? 's' : ''} / ${days} Day${days !== 1 ? 's' : ''}`;

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

type PopularPackagesProps = {
    initialPlans?: TourPlanSummary[];
};

const PopularPackages = ({ initialPlans }: PopularPackagesProps) => {
    const hasInitialPlans = (initialPlans?.length ?? 0) > 0;
    const [plans, setPlans] = useState<TourPlanSummary[]>(initialPlans ?? []);
    const [loading, setLoading] = useState(!hasInitialPlans);
    const [submitting, setSubmitting] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { pendingAction, requestAuth, clearPendingAction } = useAuthFlow();

    useEffect(() => {
        if (hasInitialPlans) {
            getAllTourPlans(6)
                .then(setPlans)
                .catch(console.error);
            return;
        }

        getAllTourPlans(6)
            .then(setPlans)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [hasInitialPlans]);

    const handleWhatsappRequest = useCallback(async (plan: TourPlanSummary) => {
        if (!isAuthenticated || !user) {
            requestAuth({ type: 'CALL_GUIDE', payload: { plan } });
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
                requestAuth({ type: 'CALL_GUIDE', payload: { plan } });
                toast.error('Please sign in to contact the guide.');
            } else if ((error as Error)?.message === 'AUTH_REQUIRED') {
                requestAuth({ type: 'CALL_GUIDE', payload: { plan } });
            } else {
                toast.error('Could not send request, please try again');
            }
        } finally {
            setSubmitting(false);
        }
    }, [isAuthenticated, user, requestAuth]);

    const resumePendingAction = useCallback(() => {
        if (!pendingAction || !isAuthenticated) return;
        if (pendingAction.type === 'CALL_GUIDE') {
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

    return (
        <section className="py-20 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                        <h3 className="text-brand-primary font-semibold uppercase tracking-wider mb-2">Best Selling</h3>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 font-display">Popular Tour Packages</h2>
                    </div>
                    <Link href="/guides" className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
                        View All Packages <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : plans.length === 0 ? (
                        <p className="col-span-full text-center text-gray-400 py-12 text-lg">No tour plans available yet.</p>
                    ) : (
                        plans.map((plan, index) => (
                            <Link href={`/guides/${plan._id}`} key={plan._id} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-[#F8FAFF] rounded-[20px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full overflow-hidden"
                                >
                                    <div className="h-55 overflow-hidden relative">
                                        <img
                                            src={getOptimizedImageUrl(getFirstImage(plan), 600)}
                                            alt={plan.title}
                                            width={600}
                                            height={220}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80&fm=webp';
                                            }}
                                        />
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-gray-800 shadow-sm">
                                            <Clock size={14} className="text-brand-primary" />
                                            {formatDuration(plan.durationDays, plan.durationNights)}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                                    {plan.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 mt-2 text-[12px] text-gray-500 font-medium">
                                                    {(plan.locations ?? []).slice(0, 3).map((loc) => (
                                                        <span key={loc} className="inline-flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-1">
                                                            <MapPin size={12} className="text-brand-primary" /> {loc}
                                                        </span>
                                                    ))}
                                                    {(!plan.locations || plan.locations.length === 0) && (
                                                        <span className="inline-flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-1">
                                                            <MapPin size={12} className="text-brand-primary" /> India
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                                <Star size={12} fill="currentColor" /> 5.0
                                            </div>
                                        </div>

                                        <ul className="space-y-2 text-sm text-gray-700">
                                            {buildFeatureList(plan).map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto bg-linear-to-r from-[#e3f2ff] via-white to-[#f4fbff] border border-sky-100 rounded-xl p-4 shadow-inner flex items-center justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                                                    <Info size={12} /> Limited season offer
                                                </div>
                                                <div className="text-xs text-gray-500">All taxes & fees included</div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">Per person</p>
                                                <p className="text-2xl font-black text-brand-primary leading-tight">{formatPrice(plan.basePrice)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                {plan.guideId?.profileImage ? (
                                                    <img
                                                        src={getOptimizedImageUrl(plan.guideId.profileImage, 40)}
                                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                                        alt={plan.guideId.name}
                                                        width={40}
                                                        height={40}
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full border border-gray-200 bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                                        {plan.guideId?.name?.[0]?.toUpperCase() ?? 'G'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[11px] text-gray-500">Guided by</p>
                                                    <p className="text-sm font-semibold text-gray-800">{plan.guideId?.name ?? 'Experienced Guide'}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Verified</div>
                                        </div>
                                        <button
                                            className="mt-3 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors"
                                            style={{ backgroundColor: '#25D366' }}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWhatsappRequest(plan); }}
                                            disabled={submitting}
                                        >
                                            <WhatsappIcon size={16} /> Request via WhatsApp
                                        </button>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default PopularPackages;
