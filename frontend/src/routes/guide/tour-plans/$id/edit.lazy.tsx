import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import tourPlanService from '../../../../services/tourPlan.service';
import CreateTourPlanForm from '../../../../components/TourPlans/CreateTourPlanForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export const Route = createLazyFileRoute('/guide/tour-plans/$id/edit')({
    component: EditTourPlanPage,
});

function EditTourPlanPage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlan();
    }, [id]);

    const fetchPlan = async () => {
        try {
            setIsLoading(true);
            const data = await tourPlanService.getTourPlanById(id);
            // Format locations back to comma string for the form
            const formattedPlan = {
                ...data,
                locations: data.locations.join(', ')
            };
            setPlan(formattedPlan);
        } catch (error) {
            console.error('Failed to fetch plan', error);
            toast.error('Failed to load tour plan for editing');
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
            <div className="max-w-5xl mx-auto mb-8">
                <Link to={`/guide/tour-plans/${id}`} className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to Details
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Tour Plan</h1>
            </div>

            <div className="max-w-5xl mx-auto">
                <CreateTourPlanForm
                    initialData={plan}
                    editId={id}
                    onSuccess={() => navigate({ to: `/guide/tour-plans/${id}` })}
                />
            </div>
        </div>
    );
}
