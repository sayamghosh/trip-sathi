import Hero from '../components/Hero';
import PopularPackages from '../components/PopularPackages';
import PlanVacation from '../components/PlanVacation';
import BestSellingDestinations from '../components/BestSellingDestinations';
import LimitedTimeDeals from '../components/LimitedTimeDeals';
import MostVisitedCities from '../components/MostVisitedCities';
import WhyTravelersChooseUs from '../components/WhyTravelersChooseUs';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-display antialiased selection:bg-brand-primary selection:text-white overflow-x-hidden bg-white">
            <Hero />
            <PopularPackages />
            <BestSellingDestinations />
            <LimitedTimeDeals />
            <MostVisitedCities />
            <WhyTravelersChooseUs />
            <PlanVacation />
        </div>
    );
};

export default LandingPage;
