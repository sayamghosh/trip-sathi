import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative pt-32 pb-10 overflow-hidden bg-[#F8FAFC]">

            {/* Simple Top Border or Decoration if needed */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">




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
