import { createLazyFileRoute } from '@tanstack/react-router';
import CreateTourPlanForm from '../../../components/TourPlans/CreateTourPlanForm';

export const Route = createLazyFileRoute('/guide/tour-plans/create')({
    component: TourPlanCreate,
});

function TourPlanCreate() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Detailed Tour Plan</h1>
                <CreateTourPlanForm />
            </div>
        </div>
    );
}
