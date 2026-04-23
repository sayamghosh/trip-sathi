"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import tourPlanService from '../../../../services/tourPlan.service';
import DetailedTourPlan from '../../../../components/TourPlans/DetailedTourPlan';
import type { TourPlanDetailed } from '../../../../types/tourPlan';

export default function TourPlanDetailsPage() {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const [plan, setPlan] = useState<TourPlanDetailed | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchPlan = async () => {
            try {
                setIsLoading(true);
                const data = await tourPlanService.getTourPlanById(id);
                setPlan(data);
            } catch (error) {
                console.error('Failed to fetch plan', error);
                toast.error('Failed to load tour plan details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Plan not found</h2>
                <Link href="/guide/dashboard" className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
                <Link href="/guide/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <Link
                    href={`/guide/tour-plans/${id}/edit`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
                >
                    <Edit2 size={18} /> Edit Plan
                </Link>
            </div>

            <DetailedTourPlan plan={plan} />
        </div>
    );
}
