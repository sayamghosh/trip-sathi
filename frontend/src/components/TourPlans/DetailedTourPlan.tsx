import { MapPin, Clock, Calendar, IndianRupee, Briefcase, Hotel, Utensils, Info } from 'lucide-react';

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

export default function DetailedTourPlan({ plan }: { plan: TourPlan }) {
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
                    <div className="w-full h-64 md:h-96 relative">
                        <img
                            src={plan.bannerImages[0]}
                            alt={plan.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                )}
                <div className="p-8 md:p-12">
                    {plan.guideId && (
                        <div className="flex items-center gap-4 mb-6">
                            {plan.guideId.profileImage ? (
                                <img
                                    src={plan.guideId.profileImage}
                                    alt={plan.guideId.name}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                    {plan.guideId.name?.[0]?.toUpperCase() ?? 'G'}
                                </div>
                            )}
                            <span className="text-lg font-medium text-gray-800">{plan.guideId.name}</span>
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
                                                                src={img}
                                                                alt={activity.title}
                                                                className="w-48 h-32 object-cover rounded-xl border border-gray-200 shadow-sm flex-none"
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
