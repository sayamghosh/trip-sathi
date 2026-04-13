import { Link } from '@tanstack/react-router';
import { Badge } from './ui/badge';
import OptimizedImage from './ui/OptimizedImage';

const cities = [
    {
        name: 'Delhi, India',
        query: 'delhi',
        hotels: '1,450+',
        description: 'Delhi, India’s capital territory, is a massive metropolitan area in the country’s north.',
        image: 'https://images.pexels.com/photos/31709020/pexels-photo-31709020.jpeg',
    },
    {
        name: 'Goa, India',
        query: 'goa',
        hotels: '4,320+',
        description: 'Cliffside temples with ocean views and stunning golden hours.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    },
    {
        name: 'Jaipur, India',
        query: 'jaipur',
        hotels: '7,850+',
        description: 'Panoramic skyline views with a luxe ambience and iconic backdrop.',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80',
    },
    {
        name: 'Kolkata, India',
        query: 'kolkata',
        hotels: '7,850+',
        description: 'The capital and largest city of the Indian state of West Bengal.',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&auto=format&fit=crop&q=80',
    },
    {
        name: 'Mumbai, India',
        query: 'Mumbai',
        hotels: '7,850+',
        description: 'Mumbai (formerly called Bombay) is a densely populated city on India’s west coast.',
        image: 'https://images.unsplash.com/photo-1598434192043-71111c1b3f41?w=1000&auto=format&fit=crop&q=80',
    }
];

const MostVisitedCities = () => {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Area */}
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-gray-900 tracking-tight font-display mb-4">
                        Most Visited Cities in India
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                        Plan your itinerary around iconic landmarks, must-see spots, and unforgettable local experiences.
                    </p>
                </div>

                {/* Grid Area – horizontal scroll on mobile, wrap on md+ */}
                <div className="-mx-4 sm:mx-0">
                    <div className="flex flex-row md:flex-wrap md:justify-center gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pl-5 pr-4 sm:px-0 scroll-pl-5 md:scroll-pl-0 pb-4 md:pb-0 scrollbar-hide">
                        {cities.map((city) => (
                            <Link
                                key={city.name}
                                to="/search"
                                search={{ destination: city.query }}
                                className="group block w-[200px] sm:w-[220px] shrink-0 snap-start"
                            >
                                <div className="rounded-2xl overflow-hidden aspect-[3/4] border border-gray-100 mb-5 relative bg-gray-50">
                                    <OptimizedImage
                                        src={city.image}
                                        alt={city.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        containerClassName="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="flex flex-row items-center justify-between gap-4 mb-2">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                                        {city.name}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 border-none shrink-0"
                                    >
                                        {city.hotels} Hotels
                                    </Badge>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed max-w-[95%]">
                                    {city.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MostVisitedCities;
