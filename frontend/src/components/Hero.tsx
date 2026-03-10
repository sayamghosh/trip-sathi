import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import OptimizedImage from './ui/OptimizedImage';
import bannerImg from '../assets/banner-tripsathi.png';

type SlideDirection = 'down' | 'up';

const searchBarVariants: Variants = {
    enter: (direction: SlideDirection) => ({
        y: direction === 'down' ? -48 : 48,
        opacity: 0,
    }),
    center: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 320, damping: 32 },
    },
    exit: (direction: SlideDirection) => ({
        y: direction === 'down' ? -48 : 48,
        opacity: 0,
        transition: { duration: 0.2 },
    }),
};

const Hero = () => {
    const [destination, setDestination] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    const rafRef = useRef<number | null>(null);

    // Throttled scroll handler using requestAnimationFrame
    const handleScroll = useCallback(() => {
        if (rafRef.current) return; // Skip if already scheduled
        
        rafRef.current = requestAnimationFrame(() => {
            setIsSticky(window.scrollY > 350);
            rafRef.current = null;
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    const handleSearch = () => {
        if (destination.trim()) {
            navigate({
                to: '/search',
                search: { destination: destination.trim() }
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-28 pb-8 sm:pb-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Image Container with rounded corners */}
                <div
                    className="relative w-full mx-auto rounded-[20px] sm:rounded-[32px] overflow-hidden h-[450px] sm:h-[500px] lg:h-[550px] flex flex-col items-center justify-center text-center shadow-xl sm:shadow-2xl"
                >
                    {/* Banner Image - Priority loaded for LCP */}
                    <OptimizedImage
                        src={bannerImg}
                        alt="Trip Sathi banner - explore India"
                        priority
                        className="absolute inset-0 w-full h-full object-cover"
                        containerClassName="absolute inset-0 w-full h-full"
                    />
                    
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20 sm:bg-black/10"></div>

                    {/* Content over image */}
                    <div className="relative z-10 w-full px-4 sm:px-6 flex flex-col items-center">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-6 sm:mb-8 font-display tracking-wide font-light leading-tight">
                            Discovery&Beyond
                        </h1>

                        {/* Search Bar Wrapper */}
                        <div className="h-[56px] sm:h-[64px] w-full max-w-xl sm:max-w-2xl mb-8 sm:mb-12 relative z-[99999]">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={isSticky ? 'sticky-search' : 'hero-search'}
                                    custom={isSticky ? 'down' : 'up'}
                                    variants={searchBarVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    layout
                                    className={`bg-white p-1 sm:p-1.5 rounded-full flex items-center shadow-lg ${
                                        isSticky
                                            ? 'fixed top-24 left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl shadow-2xl border border-gray-200 z-[99999]'
                                            : 'relative z-50 w-full max-w-xl sm:max-w-2xl'
                                    }`}
                                >
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Where do you want to go?"
                                        className="flex-1 bg-transparent outline-none text-gray-700 font-medium px-4 sm:px-6 text-sm sm:text-base w-full placeholder-gray-500"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="bg-[#1868D5] hover:bg-blue-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-full flex items-center gap-2 font-medium transition-colors cursor-pointer text-xs sm:text-sm"
                                    >
                                        <Search size={16} className="sm:hidden" />
                                        <Search size={18} className="hidden sm:block" />
                                        <span className="hidden sm:inline">search</span>
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 sm:gap-8 text-white mt-2 sm:mt-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">28</span>
                                <div className="text-left text-[11px] sm:text-[13px] font-medium leading-tight text-white/90 uppercase tracking-wide">
                                    States<br/>Covered
                                </div>
                            </div>
                            <div className="w-px h-8 sm:h-12 bg-white/30"></div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">120</span>
                                <div className="text-left text-[11px] sm:text-[13px] font-medium leading-tight text-white/90 uppercase tracking-wide">
                                    Incredible<br/>Journeys
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Text Area */}
                <div className="mt-3 sm:mt-4 text-center max-w-3xl mx-auto px-2 sm:px-0">
                    <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-800 mb-2 sm:mb-3 tracking-tight">
                        Unforgettable Trips & Unbeatable Prices
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        Browse thousands of tour packages created by certified local guides.<br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>No middleman commissions—just direct connections.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;;
