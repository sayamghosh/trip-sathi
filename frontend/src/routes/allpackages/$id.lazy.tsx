import { createLazyFileRoute } from '@tanstack/react-router';
import TravelerDetailedTourPlan from '../../components/TourPlans/TravelerDetailedTourPlan';

export const Route = createLazyFileRoute('/allpackages/$id')({
  component: TravelerDetailedTourPlan,
});
