import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative pt-32 pb-10 overflow-hidden bg-[#F8FAFC]">

            {/* Simple Top Border or Decoration if needed */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Newsletter / CTA Section */}
                <div className="bg-brand-primary p-10 rounded-[32px] shadow-2xl shadow-blue-200 relative mb-20 max-w-5xl mx-auto text-center overflow-hidden">

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl font-bold text-white mb-8 max-w-lg mx-auto leading-snug font-display relative z-10">
                        Subscribe to get latest package deals and exclusive offers from Trip-Sathi
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
                        <div className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 flex items-center gap-2 text-white placeholder-white/70">
                            <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <input type="email" placeholder="Your email" className="outline-none flex-1 bg-transparent text-white placeholder-white/70" />
                        </div>
                        <button className="bg-white text-brand-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

                    <div className="col-span-2 pr-8">
                        <h2 className="text-3xl font-bold text-brand-primary mb-4">Trip<span className="text-brand-dark">Sathi</span></h2>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            TripSathi connects you directly with confirmed local guides for the best tour packages at the best prices. No middlemen, no extra cost.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg text-brand-dark mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500 text-sm font-medium">
                            <li><a href="#" className="hover:text-brand-primary transition">About</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Mobile</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg text-brand-dark mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-500 text-sm font-medium">
                            <li><a href="#" className="hover:text-brand-primary transition">Help/FAQ</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Press</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Affiliates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg text-brand-dark mb-6">More</h4>
                        <ul className="space-y-4 text-gray-500 text-sm font-medium">
                            <li><a href="#" className="hover:text-brand-primary transition">Airlinefees</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Airline</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition">Low fare tips</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
                    <p className="text-gray-400 text-sm font-medium">All rights reserved@TripSathi.co</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-primary hover:text-white transition-all"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-primary hover:text-white transition-all"><Twitter size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
