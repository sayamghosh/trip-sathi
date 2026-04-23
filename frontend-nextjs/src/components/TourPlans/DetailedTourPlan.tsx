import { MapPin, Clock, Calendar, IndianRupee, Briefcase, Hotel, Utensils, Info } from 'lucide-react';
import { getOptimizedImageUrl } from '../../lib/utils';
import type { TourPlanDetailed } from '../../types/tourPlan';

export default function DetailedTourPlan({ plan }: { plan: TourPlanDetailed }) {
    const getActivityIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'transfer': return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'sightseeing': return <MapPin className="w-5 h-5 text-green-500" />;
            case 'hotel': return <Hotel className="w-5 h-5 text-purple-500" />;
            case 'meal': return <Utensils className="w-5 h-5 text-orange-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {plan.bannerImages && plan.bannerImages.length > 0 && (
                    <div className="w-full h-100 md:h-125 relative">
                        {plan.bannerImages.length === 1 && (
                            <img src={getOptimizedImageUrl(plan.bannerImages[0], 1200)} alt={plan.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        )}

                        {plan.bannerImages.length === 2 && (
                            <div className="flex h-full w-full gap-1">
                                <img src={getOptimizedImageUrl(plan.bannerImages[0], 600)} alt={plan.title} className="w-1/2 h-full object-cover" loading="lazy" decoding="async" />
                                <img src={getOptimizedImageUrl(plan.bannerImages[1], 600)} alt={plan.title} className="w-1/2 h-full object-cover" loading="lazy" decoding="async" />
                            </div>
                        )}

                        {plan.bannerImages.length === 3 && (
                            <div className="flex h-full w-full gap-1">
                                <div className="w-2/3 h-full">
                                    <img src={getOptimizedImageUrl(plan.bannerImages[0], 800)} alt={plan.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                </div>
                                <div className="w-1/3 h-full flex flex-col gap-1">
                                    <img src={getOptimizedImageUrl(plan.bannerImages[1], 400)} alt={plan.title} className="w-full h-1/2 object-cover" loading="lazy" decoding="async" />
                                    <img src={getOptimizedImageUrl(plan.bannerImages[2], 400)} alt={plan.title} className="w-full h-1/2 object-cover" loading="lazy" decoding="async" />
                                </div>
                            </div>
                        )}

                        {plan.bannerImages.length >= 4 && (
                            <div className="flex h-full w-full gap-1">
                                <div className="w-1/2 lg:w-2/3 h-full">
                                    <img src={getOptimizedImageUrl(plan.bannerImages[0], 800)} alt={plan.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                </div>
                                <div className="w-1/2 lg:w-1/3 h-full flex flex-col gap-1">
                                    <img src={getOptimizedImageUrl(plan.bannerImages[1], 400)} alt={plan.title} className="w-full h-1/2 object-cover" loading="lazy" decoding="async" />
                                    <div className="flex w-full h-1/2 gap-1">
                                        <img src={getOptimizedImageUrl(plan.bannerImages[2], 300)} alt={plan.title} className="w-1/2 h-full object-cover" loading="lazy" decoding="async" />
                                        <div className="w-1/2 h-full relative">
                                            <img src={getOptimizedImageUrl(plan.bannerImages[3], 300)} alt={plan.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                            {plan.bannerImages.length > 4 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl md:text-2xl cursor-pointer hover:bg-black/60 transition-colors">
                                                    +{plan.bannerImages.length - 4} More
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/20 to-transparent pointer-events-none"></div>
                    </div>
                )}
                <div className="p-8 md:p-12">
                    {plan.guideId && (
                        <div className="flex items-center gap-4 mb-6">
                            {plan.guideId.profileImage ? (
                                <img
                                    src={getOptimizedImageUrl(plan.guideId.profileImage, 48)}
                                    alt={plan.guideId.name || 'Guide'}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                    {plan.guideId.name?.[0]?.toUpperCase() ?? 'G'}
                                </div>
                            )}
                            <span className="text-lg font-medium text-gray-800">{plan.guideId.name || 'Guide'}</span>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {plan.locations.map((loc, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {loc}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {plan.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-8 text-gray-600 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{plan.durationDays} Days / {plan.durationNights} Nights</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">₹{plan.basePrice}</span>
                            <span className="text-sm font-normal text-gray-500">/ Adult</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">About the Experience</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {plan.description}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Tour Highlights</h3>
                            <ul className="space-y-3">
                                {plan.days.slice(0, 5).map((day, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                                        <span className="font-bold text-blue-600 shrink-0">Day {day.dayNumber}:</span>
                                        {day.title}
                                    </li>
                                ))}
                                {plan.days.length > 5 && (
                                    <li className="text-sm text-blue-600 font-medium">+ {plan.days.length - 5} more days</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Itinerary Section */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 px-4">Daily Itinerary</h2>
                <div className="space-y-8 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                    {plan.days.map((day, dayIndex) => (
                        <div key={dayIndex} className="relative pl-16">
                            <div className="absolute left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg z-10 border-4 border-white">
                                {day.dayNumber}
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">{day.title}</h3>
                                <div className="space-y-6">
                                    {day.activities.map((activity, actIndex) => (
                                        <div key={actIndex} className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                            <div className="shrink-0">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <h4 className="text-xl font-bold text-gray-900">{activity.title}</h4>
                                                    {activity.duration && (
                                                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                            <Clock className="w-4 h-4" /> {activity.duration}
                                                        </span>
                                                    )}
                                                </div>
                                                {activity.description && (
                                                    <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                                                )}
                                                {activity.images && activity.images.length > 0 && (
                                                    <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                                                        {activity.images.map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={getOptimizedImageUrl(img, 400)}
                                                                alt={activity.title}
                                                                className="w-48 h-32 object-cover rounded-xl border border-gray-200 shadow-sm flex-none"
                                                                width={192}
                                                                height={128}
                                                                loading="lazy"
                                                                decoding="async"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
