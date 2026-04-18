

const BECOME_TRAVEL_AGENT_URL = import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:3001/login"

const Footer = () => {
    return (
        <footer className="w-full bg-[#f8fafc] sm:bg-transparent p-0 sm:p-6 lg:p-8">
            <div className="max-w-[90rem] mx-auto bg-[#1351D8] sm:rounded-3xl p-8 md:p-14 lg:p-16 text-white overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Left Section */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div className="text-xl font-bold mb-8 lg:mb-12">Trip Sathi</div>
                        <div>
                            <h2 className="text-3xl md:text-[2.5rem] font-medium mb-4 leading-tight">
                                Get Fresh Deals & Travel Tips<br className="hidden md:block" /> in Your Inbox
                            </h2>
                            <p className="text-white/80 mb-8 max-w-md text-sm md:text-base leading-relaxed">
                                Be the first to know about flash sales, new packages,<br className="hidden md:block" /> and destination ideas.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="bg-[#306CE6] text-white placeholder-white/80 rounded-full px-6 py-3.5 w-full sm:w-[280px] outline-none focus:ring-2 focus:ring-white/50 text-sm"
                                />
                                <button className="bg-white text-gray-900 font-medium rounded-full px-8 py-3.5 hover:bg-gray-100 transition-colors whitespace-nowrap text-sm">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Links */}
                    <div className="lg:col-span-6 lg:col-start-7 pt-2 lg:pt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-semibold text-white mb-6">Trip Sathi</h4>
                                <ul className="space-y-4 text-white/80 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
                                    <li><a href={BECOME_TRAVEL_AGENT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Become a Travel Agent</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-6">Explore</h4>
                                <ul className="space-y-4 text-white/80 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Packages</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Experiences</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-6">Support</h4>
                                <ul className="space-y-4 text-white/80 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Payment & Refunds</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-10 lg:my-12 border-[#306CE6]" />

                <div className="flex flex-col md:flex-row justify-between gap-8 md:items-start">
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <div className="text-white/80 text-sm space-y-2">
                            <p className="flex flex-wrap items-center gap-2">
                                Kolkata, Madhyamgram - 700132. 
                                <span className="hidden sm:inline opacity-50">•</span> 
                                support@tripsathi.com
                            </p>
                            <p>+62 21 0000 1234</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Social</h4>
                        <div className="text-white/80 text-sm flex flex-wrap items-center gap-2 sm:gap-3">
                            <a href="#" className="hover:text-white transition-colors">Facebook</a>
                            <span className="opacity-50">•</span>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                            <span className="opacity-50">•</span>
                            <a href="#" className="hover:text-white transition-colors">X</a>
                            <span className="opacity-50">•</span>
                            <a href="#" className="hover:text-white transition-colors">YouTube</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
