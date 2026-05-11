import Link from 'next/link';
import { Badge } from './ui/badge';
import OptimizedImage from './ui/OptimizedImage';
import goaImage from '../assets/landing-page/goa.jpg';
import rajasthanImage from '../assets/landing-page/rajasthan.jpg';
import delhiImage from '../assets/landing-page/delhi.jpg';
import kolkataImage from '../assets/landing-page/kolkata.jpg';
import mumbaiImage from '../assets/landing-page/mumbai.jpg';

const cities = [
    {
        name: 'Delhi, India',
        query: 'delhi',
        hotels: '1,450+',
        description: 'Delhi, India’s capital territory, is a massive metropolitan area in the country’s north.',
        image: delhiImage.src,
    },
    {
        name: 'Goa, India',
        query: 'goa',
        hotels: '4,320+',
        description: 'Cliffside temples with ocean views and stunning golden hours.',
        image: goaImage.src,
    },
    {
        name: 'Jaipur, India',
        query: 'jaipur',
        hotels: '7,850+',
        description: 'Panoramic skyline views with a luxe ambience and iconic backdrop.',
        image: rajasthanImage.src,
    },
    {
        name: 'Kolkata, India',
        query: 'kolkata',
        hotels: '7,850+',
        description: 'The capital and largest city of the Indian state of West Bengal.',
        image: kolkataImage.src,
    },
    {
        name: 'Mumbai, India',
        query: 'Mumbai',
        hotels: '7,850+',
        description: 'Mumbai (formerly called Bombay) is a densely populated city on India’s west coast.',
        image: mumbaiImage.src,
    }
];

const MostVisitedCities = () => {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                {/* Header Area */}
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-gray-900 tracking-tight font-display mb-4">
                        Most Visited Cities in India
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                        Plan your itinerary around iconic landmarks, must-see spots, and unforgettable local experiences.
                    </p>
                </div>

                {/* Grid Area – horizontal scroll on mobile, 5 columns on desktop */}
                <div className="-mx-6 sm:mx-0">
                    <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory px-6 sm:px-0 scroll-pl-6 sm:scroll-pl-0 pb-6 sm:pb-0 scrollbar-hide">
                        {cities.map((city) => (
                            <Link
                                key={city.name}
                                href={{ pathname: '/search', query: { destination: city.query } }}
                                className="group block w-64 sm:w-auto shrink-0 sm:shrink snap-start"
                            >
                                <div className="rounded-2xl overflow-hidden aspect-3/4 border border-gray-100 mb-5 relative bg-gray-50">
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
