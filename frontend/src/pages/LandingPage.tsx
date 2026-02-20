import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import PopularPackages from '../components/PopularPackages';
import PlanVacation from '../components/PlanVacation';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-display antialiased selection:bg-brand-primary selection:text-white overflow-x-hidden bg-white">
            <Navbar />
            <Hero />
            <PopularPackages />
            <WhyChooseUs />
            <PlanVacation />
            <Footer />
        </div>
    );
};

export default LandingPage;
