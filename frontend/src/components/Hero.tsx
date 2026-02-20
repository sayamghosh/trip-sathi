import { motion } from 'framer-motion';
import { Search, MapPin, Calendar } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 overflow-hidden bg-gradient-to-br from-sky-50 to-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content (Left) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left"
                    >
                        <div className="inline-block px-4 py-2 bg-sky-100 rounded-full text-brand-primary font-semibold text-sm mb-6">
                            ✈️ Direct from Locals
                        </div>
                        <h1 className="text-5xl lg:text-[64px] font-bold text-gray-900 leading-[1.1] mb-6 font-display">
                            Unforgettable Trips <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">Unbeatable Prices</span>
                        </h1>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-lg">
                            Browse thousands of tour packages created by certified local guides. No middleman commissions—just direct connections.
                        </p>

                        {/* Search Box */}
                        <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 max-w-xl">
                            <div className="flex flex-col md:flex-row gap-2">

                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl flex-1">
                                    <MapPin className="text-brand-primary" size={20} />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-400 font-medium">Destination</p>
                                        <input type="text" placeholder="Where to?" className="bg-transparent outline-none text-gray-700 font-semibold w-full placeholder-gray-400" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl flex-1">
                                    <Calendar className="text-brand-primary" size={20} />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-400 font-medium">Duration</p>
                                        <select className="bg-transparent outline-none text-gray-700 font-semibold w-full cursor-pointer">
                                            <option>Any Days</option>
                                            <option>1-3 Days</option>
                                            <option>4-7 Days</option>
                                            <option>7+ Days</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="bg-brand-primary hover:bg-brand-secondary text-white p-4 rounded-xl transition-colors shadow-lg shadow-sky-200">
                                    <Search size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex -space-x-3">
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" />
                            </div>
                            <p>10k+ Travelers connected this month</p>
                        </div>

                    </motion.div>

                    {/* Hero Image / Package Teaser (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 w-full max-w-[500px] mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Switzerland Landscape"
                                className="w-full h-[500px] object-cover rounded-[32px] shadow-2xl"
                            />

                            {/* Floating "Best Seller" Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-10 -left-6 md:-left-10 bg-white p-4 rounded-2xl shadow-xl max-w-[200px]"
                            >
                                <div className="flex gap-2 items-center mb-2">
                                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Trending</span>
                                    <div className="flex text-yellow-400 text-[10px]">★★★★★</div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1">Manali Mountains</h3>
                                <p className="text-xs text-gray-400 mb-2">3 Nights • 4 Days</p>
                                <p className="font-bold text-brand-primary">₹5,999 <span className="text-gray-400 text-[10px] font-normal">/ person</span></p>
                            </motion.div>

                            {/* Floating "Verified Guide" Badge */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 -right-4 md:-right-6 bg-white p-3 pr-5 rounded-full shadow-xl flex items-center gap-3"
                            >
                                <div className="relative">
                                    <img src="https://randomuser.me/api/portraits/men/1.jpg" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="Guide" />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Guided By</p>
                                    <p className="text-xs font-bold text-gray-800">Amit Sharma</p>
                                </div>
                            </motion.div>

                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-100/50 rounded-full blur-3xl -z-10"></div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
