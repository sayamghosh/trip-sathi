const BECOME_TRAVEL_AGENT_URL =
    process.env.NEXT_PUBLIC_ADMIN_APP_URL || "http://localhost:3001/login";

const Footer = () => {
    return (
        <footer className="w-[1512px] px-1 sm:px-2 lg:px-3 pb-2 mx-auto">
            <div className="w-full bg-[#1452D9] rounded-[20px] text-white overflow-hidden">
                <div className="px-6 sm:px-8 lg:px-12 pt-10 lg:pt-14 pb-8">
                    {/* TOP SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
                        {/* LEFT SECTION */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div>
                                <h2 className="text-[20px] font-semibold tracking-tight mb-12">
                                    tripsathi
                                </h2>

                                <h3 className="text-[32px] sm:text-[40px] leading-[1.1] font-medium max-w-[520px]">
                                    Get Fresh Deals & Travel Tips in Your Inbox
                                </h3>
                            </div>

                            {/* SUBSCRIBE */}
                            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full sm:w-[320px] h-[52px] rounded-full bg-[#2E69E3] px-6 text-white placeholder:text-white/70 outline-none border border-white/10 focus:border-white/40"
                                />

                                <button className="h-[52px] px-8 rounded-full bg-white text-black font-medium cursor-pointer hover:bg-neutral-200">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="lg:col-span-6 lg:col-start-7">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                                {/* COLUMN 1 */}
                                <div>
                                    <h4 className="text-white font-medium mb-6">TripSathi</h4>

                                    <ul className="space-y-4 text-white/75 text-sm">
                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                About Us
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                How It Works
                                            </a>
                                        </li>

                                        <li><a href={BECOME_TRAVEL_AGENT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Become a Agent</a></li>
                                    </ul>
                                </div>

                                {/* COLUMN 2 */}
                                <div>
                                    <h4 className="text-white font-medium mb-6">Explore</h4>

                                    <ul className="space-y-4 text-white/75 text-sm">
                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Destinations
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Packages
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Experiences
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* COLUMN 3 */}
                                <div>
                                    <h4 className="text-white font-medium mb-6">Support</h4>

                                    <ul className="space-y-4 text-white/75 text-sm">
                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Help Center
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Contact Us
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Terms & Conditions
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className="hover:text-white transition-all">
                                                Privacy Policy
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-full h-[1px] bg-white/15 my-10 lg:my-12" />

                    {/* BOTTOM SECTION */}
                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                        {/* CONTACT */}
                        <div>
                            <h4 className="font-medium mb-5">Contact</h4>

                            <div className="space-y-3 text-sm text-white/75">
                                <div className="flex gap-3 items-center flex-wrap">
                                    <p>1, Madhyamgram, Kolkata - 700132</p>
                                    <span className="opacity-40">•</span>
                                    <p>support@tripsathi.com</p>
                                </div>

                                <p>+91 91X XXX XXX0</p>
                            </div>
                        </div>

                        {/* SOCIAL */}
                        <div>
                            <h4 className="font-medium mb-5">Social</h4>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
                                <a href="#" className="hover:text-white transition-all">
                                    Facebook
                                </a>

                                <span className="opacity-40">•</span>

                                <a href="#" className="hover:text-white transition-all">
                                    Instagram
                                </a>

                                <span className="opacity-40">•</span>

                                <a href="#" className="hover:text-white transition-all">
                                    X
                                </a>

                                <span className="opacity-40">•</span>

                                <a href="#" className="hover:text-white transition-all">
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;