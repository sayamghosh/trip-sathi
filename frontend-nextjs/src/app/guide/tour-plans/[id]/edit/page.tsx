"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import tourPlanService from '../../../../../services/tourPlan.service';
import CreateTourPlanForm from '../../../../../components/TourPlans/CreateTourPlanForm';
import type { TourPlanDetailed } from '../../../../../types/tourPlan';

type EditableTourPlan = Omit<TourPlanDetailed, 'locations'> & { locations: string };

export default function EditTourPlanPage() {
    const params = useParams();
    const router = useRouter();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const [plan, setPlan] = useState<EditableTourPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchPlan = async () => {
            try {
                setIsLoading(true);
                const data = await tourPlanService.getTourPlanById(id);
                const formattedPlan: EditableTourPlan = {
                    ...data,
                    locations: data.locations.join(', '),
                };
                setPlan(formattedPlan);
            } catch (error) {
                console.error('Failed to fetch plan', error);
                toast.error('Failed to load tour plan for editing');
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
            <div className="max-w-5xl mx-auto mb-8">
                <Link href={`/guide/tour-plans/${id}`} className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to Details
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Tour Plan</h1>
            </div>

            <div className="max-w-5xl mx-auto">
                <CreateTourPlanForm
                    initialData={plan}
                    editId={id}
                    onSuccess={() => router.push(`/guide/tour-plans/${id}`)}
                />
            </div>
        </div>
    );
}
