import { Link } from '@tanstack/react-router';

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
                        to="/search"
                        search={{ destination: 'hotels' }}
                        className="relative flex-1 rounded-2xl overflow-hidden h-[240px] sm:h-[280px] group cursor-pointer block"
                    >
                        {/* Background — paraglider over tropical island */}
                        <img
                            src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop"
                            alt="Stay Longer and Save 15% OFF"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/55 group-hover:bg-black/50 transition-colors duration-300" />

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
                        to="/search"
                        search={{ destination: 'manali' }}
                        className="relative flex-1 rounded-2xl overflow-hidden h-[240px] sm:h-[280px] group cursor-pointer block"
                    >
                        {/* Background — Manali green valley */}
                        <img
                            src="https://images.pexels.com/photos/414807/pexels-photo-414807.jpeg"
                            alt="New Year Holiday Getaway Manali 35% OFF"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Subtle dark overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors duration-300" />

                        {/* MANALI watermark — large, centered-right */}
                        <div className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none">
                            <span
                                className="text-white/25 font-black tracking-widest uppercase select-none leading-none"
                                style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)' }}
                            >
                                MANALI
                            </span>
                        </div>

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
                                All Tripvio Packages
                            </p>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default LimitedTimeDeals;
