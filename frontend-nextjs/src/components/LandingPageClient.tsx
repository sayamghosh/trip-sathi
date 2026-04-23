"use client";

import Hero from './Hero';
import PopularPackages from './PopularPackages';
import BestSellingDestinations from './BestSellingDestinations';
import LimitedTimeDeals from './LimitedTimeDeals';
import MostVisitedCities from './MostVisitedCities';
import WhyTravelersChooseUs from './WhyTravelersChooseUs';
import FAQ from './FAQ';
import type { TourPlanSummary } from '../types/tourPlan';

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
