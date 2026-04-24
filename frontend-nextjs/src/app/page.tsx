import LandingPageClient from '../components/LandingPageClient';
import type { TourPlanSummary } from '../types/tourPlan';

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
