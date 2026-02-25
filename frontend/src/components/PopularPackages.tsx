import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { getAllTourPlans } from '../services/tourPlan.service';

interface TourPlan {
    _id: string;
    title: string;
    locations: string[];
    durationDays: number;
    durationNights: number;
    basePrice: number;
    bannerImages?: string[];
    days: { activities: { images: string[] }[] }[];
    guideId: {
        name: string;
        profileImage?: string;
    } | null;
}

const getFirstImage = (plan: TourPlan): string => {
    if (plan.bannerImages && plan.bannerImages.length > 0) {
        return plan.bannerImages[0];
    }
    for (const day of plan.days ?? []) {
        for (const activity of day.activities ?? []) {
            if (activity.images?.length > 0) return activity.images[0];
        }
    }
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80`;
};

const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

const formatDuration = (days: number, nights: number) =>
    `${nights} Night${nights !== 1 ? 's' : ''} / ${days} Day${days !== 1 ? 's' : ''}`;

const buildFeatureList = (plan: TourPlan) => {
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

const PopularPackages = () => {
    const [plans, setPlans] = useState<TourPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTourPlans(4)
            .then(setPlans)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                        <h3 className="text-brand-primary font-semibold uppercase tracking-wider mb-2">Best Selling</h3>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 font-display">Popular Tour Packages</h2>
                    </div>
                    <Link to="/guides" className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
                        View All Packages <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : plans.length === 0 ? (
                        <p className="col-span-4 text-center text-gray-400 py-12 text-lg">No tour plans available yet.</p>
                    ) : (
                        plans.map((plan, index) => (
                            <Link to="/guides/$id" params={{ id: plan._id }} key={plan._id} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-[#F8FAFF] rounded-[20px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full overflow-hidden"
                                >
                                    <div className="h-[220px] overflow-hidden relative">
                                        <img
                                            src={getFirstImage(plan)}
                                            alt={plan.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
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

                                        <div className="mt-auto bg-gradient-to-r from-[#e3f2ff] via-white to-[#f4fbff] border border-sky-100 rounded-xl p-4 shadow-inner flex items-center justify-between gap-4">
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
                                                        src={plan.guideId.profileImage}
                                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                                        alt={plan.guideId.name}
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
