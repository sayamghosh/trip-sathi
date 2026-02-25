import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { getAllTourPlans } from '../services/tourPlan.service';
import { requestCallback } from '../services/callback.service';

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
        _id?: string;
        name: string;
        profileImage?: string;
        phone?: string;
        address?: string;
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
    const [contactOpen, setContactOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<TourPlan | null>(null);
    const [userPhone, setUserPhone] = useState('');
    const [userName, setUserName] = useState('');
    const [callbackError, setCallbackError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getAllTourPlans(4)
            .then(setPlans)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openContactModal = (plan: TourPlan) => {
        setSelectedPlan(plan);
        setContactOpen(true);
        setCallbackError(null);
    };

    const handleSubmitCallback = async () => {
        if (!selectedPlan) return;
        if (!userPhone.trim()) {
            setCallbackError('Please enter your phone number');
            return;
        }
        try {
            setSubmitting(true);
            setCallbackError(null);
            await requestCallback({ tourPlanId: selectedPlan._id, requesterPhone: userPhone.trim(), requesterName: userName.trim() || undefined });
            setContactOpen(false);
            setUserPhone('');
            setUserName('');
            setSelectedPlan(null);
            alert('Callback request sent to the guide!');
        } catch (error: any) {
            setCallbackError(error?.response?.data?.message || 'Could not send request, please try again');
        } finally {
            setSubmitting(false);
        }
    };

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
                                            <button
                                                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-brand-dark transition-colors"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openContactModal(plan); }}
                                            >
                                                Call the guide
                                            </button>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
            {selectedPlan && (
                <ContactModal
                    open={contactOpen}
                    onClose={() => { if (!submitting) { setContactOpen(false); setSelectedPlan(null); setUserPhone(''); setUserName(''); setCallbackError(null); } }}
                    plan={selectedPlan}
                    userPhone={userPhone}
                    setUserPhone={setUserPhone}
                    userName={userName}
                    setUserName={setUserName}
                    error={callbackError}
                    onSubmit={handleSubmitCallback}
                    submitting={submitting}
                />
            )}
        </section>
    );
};

export default PopularPackages;

// ─── Contact Modal ────────────────────────────────────────────────────────
function ContactModal({
    open,
    onClose,
    plan,
    userPhone,
    setUserPhone,
    userName,
    setUserName,
    error,
    onSubmit,
    submitting,
}: {
    open: boolean;
    onClose: () => void;
    plan: TourPlan;
    userPhone: string;
    setUserPhone: (v: string) => void;
    userName: string;
    setUserName: (v: string) => void;
    error: string | null;
    onSubmit: () => void;
    submitting: boolean;
}) {
    if (!open) return null;

    const guide = plan.guideId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    X
                </button>

                <div className="flex items-center gap-3 mb-4">
                    {guide?.profileImage ? (
                        <img src={guide.profileImage} alt={guide.name} className="w-12 h-12 rounded-full object-cover border" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center border">
                            {guide?.name?.[0]?.toUpperCase() ?? 'G'}
                        </div>
                    )}
                    <div>
                        <p className="text-xs uppercase text-gray-500">Call the guide</p>
                        <p className="text-lg font-bold text-gray-900">{guide?.name ?? 'Guide'}</p>
                        {guide?.address && <p className="text-xs text-gray-500">{guide.address}</p>}
                    </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4 text-sm text-gray-700">
                    <p className="font-semibold text-brand-primary">Direct contact</p>
                    {guide?.phone ? (
                        <p className="mt-1">Phone: <span className="font-bold">{guide.phone}</span></p>
                    ) : (
                        <p className="mt-1 text-gray-500">Guide has not added a phone number yet.</p>
                    )}
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-700">Your name (optional)</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-700">Your phone number (for callback)</label>
                        <input
                            type="tel"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="e.g., +91 98765 43210"
                        />
                    </div>
                    <p className="text-[12px] text-gray-500">We share this with the guide so they can call you back.</p>
                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow hover:bg-brand-dark transition-colors disabled:opacity-70"
                    >
                        {submitting ? 'Sending...' : 'Request callback'}
                    </button>
                </div>
            </div>
        </div>
    );
}
