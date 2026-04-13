import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import OptimizedImage from './ui/OptimizedImage';

// Dummy data for Indian destinations using high-quality Unsplash image URLs
const destinations = [
    {
        id: 1,
        name: 'Munnar',
        image: 'https://images.unsplash.com/photo-1637066742971-726bee8d9f56?w=1000&auto=format&fit=crop&q=80',
    },
    {
        id: 2,
        name: 'Andaman',
        image: 'https://images.unsplash.com/photo-1542429296407-20c78e10f375?w=1000&auto=format&fit=crop&q=80',
    },
    {
        id: 3,
        name: 'Rajasthan',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800&h=1200',
    },
    {
        id: 4,
        name: 'Coorg & Ooty',
        image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cab193?w=1000&auto=format&fit=crop&q=80',
    },
    {
        id: 5,
        name: 'Kashmir',
        image: 'https://images.unsplash.com/photo-1715457573748-8e8a70b2c1be?w=1000&auto=format&fit=crop&q=80',
    },
    {
        id: 6,
        name: 'Kerala',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800&h=1200',
    },
    {
        id: 7,
        name: 'Sikkim',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800&h=1200',
    },
    {
        id: 8,
        name: 'Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800&h=1200',
    },
];

const BestSellingDestinations = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 174; // Width of one card (158px) + gap (16px)
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-gray-900 tracking-tight font-display mb-2">
                            Best Selling Destinations
                        </h2>
                        <p className="text-gray-500 text-lg sm:text-xl font-medium">
                            Get Unbeatable Deals on Top Trending Destinations!
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-brand-primary hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-brand-primary hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scrollable Carousel */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {destinations.map((dest) => (
                        <Link 
                            key={dest.id} 
                            to="/search" 
                            search={{ destination: dest.name.toLowerCase() }}
                            className="relative group shrink-0 w-[158px] h-[220px] rounded-2xl overflow-hidden snap-start cursor-pointer block"
                        >
                            {/* Background Image */}
                            <OptimizedImage 
                                src={dest.image} 
                                alt={dest.name}
                                width={158}
                                height={220}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                containerClassName="w-full h-full"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                            
                            {/* Destination Name */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white text-base sm:text-lg font-black tracking-wide leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                                    {dest.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            <style>
                {`
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
        </section>
    );
};

export default BestSellingDestinations;
