"use client";

import dynamic from 'next/dynamic';
import Hero from './Hero';
import type { TourPlanSummary } from '../types/tourPlan';

// Lazy load below-fold components with framer-motion
const PopularPackages = dynamic(() => import('./PopularPackages'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const BestSellingDestinations = dynamic(() => import('./BestSellingDestinations'), {
    loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const LimitedTimeDeals = dynamic(() => import('./LimitedTimeDeals'), {
    loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const MostVisitedCities = dynamic(() => import('./MostVisitedCities'), {
    loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const WhyTravelersChooseUs = dynamic(() => import('./WhyTravelersChooseUs'), {
    loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const FAQ = dynamic(() => import('./FAQ'), {
    loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

export default function LandingPageClient({
    initialPlans,
}: {
    initialPlans?: TourPlanSummary[];
}) {
    return (
        <div className="min-h-screen font-display antialiased selection:bg-brand-primary selection:text-white overflow-x-hidden bg-white">
            <Hero />
            <PopularPackages initialPlans={initialPlans} />
            <BestSellingDestinations />
            <LimitedTimeDeals />
            <MostVisitedCities />
            <WhyTravelersChooseUs />
            <FAQ />
        </div>
    );
}
