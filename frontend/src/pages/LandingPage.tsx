import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import PopularPackages from '../components/PopularPackages';
import PlanVacation from '../components/PlanVacation';
import BestSellingDestinations from '../components/BestSellingDestinations';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-display antialiased selection:bg-brand-primary selection:text-white overflow-x-hidden bg-white">
            <Hero />
            <PopularPackages />
            <BestSellingDestinations />
            <WhyChooseUs />
            <PlanVacation />
        </div>
    );
};

export default LandingPage;
