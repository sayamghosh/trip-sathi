import { motion } from 'framer-motion';
import { Send, Map, BookOpen } from 'lucide-react';

const PlanVacation = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-gray-500 font-semibold uppercase tracking-wider mb-2">Easy and Fast</h3>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark font-display mb-8 leading-tight">
                            Book Your Next Trip <br /> In 3 Easy Steps
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-center group cursor-pointer hover:bg-sky-50 p-4 rounded-xl transition-colors">
                                <div className="bg-sky-100 p-4 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <NavigationIcon className="w-6 h-6 text-brand-primary group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Choose Package</h4>
                                    <p className="text-gray-500 text-sm">Browse verified tour plans from local guides.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-center group cursor-pointer hover:bg-sky-50 p-4 rounded-xl transition-colors">
                                <div className="bg-sky-100 p-4 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <PaymentIcon className="w-6 h-6 text-brand-primary group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Contact Guide</h4>
                                    <p className="text-gray-500 text-sm">Call the guide directly to negotiate and finalize.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-center group cursor-pointer hover:bg-sky-50 p-4 rounded-xl transition-colors">
                                <div className="bg-sky-100 p-4 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <CarIcon className="w-6 h-6 text-brand-primary group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Enjoy Your Trip</h4>
                                    <p className="text-gray-500 text-sm">Reach the destination and start your adventure.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Card Visual */}
                    <div className="relative flex justify-center">
                        {/* Background Blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-sky-200/50 filter blur-[80px] rounded-full"></div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-[32px] shadow-2xl relative z-[1] w-[370px] border border-gray-100"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80&fm=webp"
                                className="w-full h-[180px] object-cover rounded-[24px] mb-6 shadow-md"
                                alt="Trip to Greece"
                                width={600}
                                height={180}
                                loading="lazy"
                                decoding="async"
                            />
                            <h4 className="font-bold text-xl text-brand-dark mb-2">Greece Getaway</h4>
                            <p className="text-gray-400 text-sm mb-4 font-medium">14-29 June | by Robbin joseph</p>

                            <div className="flex gap-4 mb-8">
                                <span className="bg-gray-50 p-3 rounded-full"><LeafIcon size={18} className="text-gray-400" /></span>
                                <span className="bg-gray-50 p-3 rounded-full"><MapIcon size={18} className="text-gray-400" /></span>
                                <span className="bg-gray-50 p-3 rounded-full"><SendIcon size={18} className="text-gray-400" /></span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center text-gray-500 text-sm font-medium">
                                    <BuildingIcon size={18} /> 24 people interested
                                </div>
                                <HeartIcon size={22} className="text-red-500 fill-red-500" />
                            </div>

                            {/* Floating Ongoing Card */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 30, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                viewport={{ once: true }}
                                className="absolute bottom-12 -right-16 bg-white p-4 rounded-2xl shadow-xl flex gap-4 w-[240px] border border-gray-50"
                            >
                                <img src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80&fm=webp" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Rome" width={48} height={48} loading="lazy" decoding="async" />
                                <div>
                                    <p className="text-gray-400 text-xs font-medium">Ongoing</p>
                                    <h5 className="font-bold text-brand-dark text-sm">Trip to Rome</h5>
                                    <p className="text-brand-primary text-xs font-bold mt-1">40% completed</p>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                        <div className="w-[40%] bg-brand-primary h-full rounded-full"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

// Icons
import { Navigation as NavigationIcon } from 'lucide-react';
const PaymentIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
const CarIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>;
const LeafIcon = (props: any) => <Map {...props} />;
const MapIcon = (props: any) => <Send {...props} />; // Placeholder
const SendIcon = (props: any) => <Send {...props} />;
const BuildingIcon = (props: any) => <BookOpen {...props} />;
const HeartIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;


export default PlanVacation;
