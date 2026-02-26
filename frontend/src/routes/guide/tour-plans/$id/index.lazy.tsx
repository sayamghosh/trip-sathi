import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import tourPlanService from '../../../../services/tourPlan.service';
import DetailedTourPlan from '../../../../components/TourPlans/DetailedTourPlan';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export const Route = createLazyFileRoute('/guide/tour-plans/$id/')({
    component: TourPlanDetailsPage,
});

function TourPlanDetailsPage() {
    const { id } = Route.useParams() as any;
    const [plan, setPlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlan();
    }, [id]);

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
                <Link to="/guide/dashboard" className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
                <Link to="/guide/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <Link
                    to="/guide/tour-plans/$id/edit"
                    params={{ id }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
                >
                    <Edit2 size={18} /> Edit Plan
                </Link>
            </div>

            <DetailedTourPlan plan={plan} />
        </div>
    );
}
