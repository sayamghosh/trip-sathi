import Link from 'next/link';
import OptimizedImage from './ui/OptimizedImage';

const LimitedTimeDeals = () => {
    return (
        <section className="py-16 sm:py-24 bg-[#f8f8f8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-gray-900 tracking-tight font-display leading-tight mb-10">
                    Limited-Time Deals for<br />Smart Travelers
                </h2>

                {/* Deal Cards */}
                <div className="flex flex-col sm:flex-row gap-4">

                    {/* Card 1 — 15% OFF */}
                    <Link
                        href={{ pathname: '/search', query: { destination: 'hotels' } }}
                        className="relative flex-1 rounded-2xl overflow-hidden h-60 sm:h-70 group cursor-pointer block"
                    >
                        {/* Background — paraglider over tropical island */}
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80"
                            alt="Stay Longer and Save 15% OFF"
                            width={600}
                            height={280}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            containerClassName="w-full h-full"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300" />

                        {/* Content — bottom left */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <p className="text-white/80 text-sm font-semibold leading-snug">
                                Stay Longer &amp; Save:
                            </p>
                            <p className="text-white/80 text-sm font-semibold leading-snug mb-1">
                                Up to
                            </p>
                            <h3 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
                                15% OFF
                            </h3>
                            <p className="text-white/55 text-xs font-medium mt-4">
                                Only for Selected Hotels
                            </p>
                        </div>
                    </Link>

                    {/* Card 2 — 35% OFF Manali */}
                    <Link
                        href={{ pathname: '/search', query: { destination: 'manali' } }}
                        className="relative flex-1 rounded-2xl overflow-hidden h-60 sm:h-70 group cursor-pointer block"
                    >
                        {/* Background — Manali green valley */}
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1684089696366-17ed91c386ca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="New Year Holiday Getaway Manali 35% OFF"
                            width={600}
                            height={280}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            containerClassName="w-full h-full"
                        />

                        {/* Subtle dark overlay */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />

                        {/* MANALI watermark — large, centered-right */}
                        {/* <div className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none">
                            <span
                                className="text-white font-black tracking-widest uppercase select-none leading-none"
                                style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)' }}
                            >
                                MANALI
                            </span>
                        </div> */}

                        {/* Content — bottom left */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <p className="text-white/80 text-sm font-semibold leading-snug">
                                New Year Holiday
                            </p>
                            <p className="text-white/80 text-sm font-semibold leading-snug mb-1">
                                Getaway
                            </p>
                            <h3 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
                                35% OFF
                            </h3>
                            <p className="text-white/55 text-xs font-medium mt-4">
                                All Travel Sathi Packages
                            </p>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default LimitedTimeDeals;
