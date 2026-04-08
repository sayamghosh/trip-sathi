import Hero from '../components/Hero';
import PopularPackages from '../components/PopularPackages';
import BestSellingDestinations from '../components/BestSellingDestinations';
import LimitedTimeDeals from '../components/LimitedTimeDeals';
import MostVisitedCities from '../components/MostVisitedCities';
import WhyTravelersChooseUs from '../components/WhyTravelersChooseUs';
import FAQ from '../components/FAQ';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-display antialiased selection:bg-brand-primary selection:text-white overflow-x-hidden bg-white">
            <Hero />
            <PopularPackages />
            <BestSellingDestinations />
            <LimitedTimeDeals />
            <MostVisitedCities />
            <WhyTravelersChooseUs />
            <FAQ />
        </div>
    );
};

export default LandingPage;
