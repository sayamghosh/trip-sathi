import LandingPageClient from '../components/LandingPageClient';
import type { TourPlanSummary } from '../types/tourPlan';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TripSathi - Best Travel Packages & Local Guides in India',
  description: 'Book your dream vacation with TripSathi. Discover 120+ destinations, compare tour packages, find local guides, and get the best deals on hotels and experiences.',
  keywords: ['travel packages India', 'book tour', 'local guide', 'holiday packages', 'best deals travel', 'India tourism', 'tour operator'],
  openGraph: {
    title: 'TripSathi - Best Travel Packages & Local Guides in India',
    description: 'Discover 120+ destinations with trusted local guides. Book your perfect trip today.',
  },
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:5000';

async function getInitialPlans(): Promise<TourPlanSummary[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/tour-plans/public?limit=6`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return [];
        }

        return res.json();
    } catch {
        return [];
    }
}

export default async function Home() {
    const initialPlans = await getInitialPlans();
    return <LandingPageClient initialPlans={initialPlans} />;
}
