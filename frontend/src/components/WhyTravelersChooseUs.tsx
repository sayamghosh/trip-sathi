import { motion } from 'framer-motion';
import { Banknote, Building2, Headset, Copy } from 'lucide-react';

const features = [
    {
        icon: Banknote,
        title: 'Best Price Transparency',
        desc: 'Every hotel and activity is screened for quality, location, and guest satisfaction.'
    },
    {
        icon: Building2,
        title: 'Curated Stays & Experiences',
        desc: 'Every hotel and activity is screened for quality, location, and guest satisfaction.'
    },
    {
        icon: Headset,
        title: '24/7 Travel Support',
        desc: 'From last-minute changes to urgent help, our support team is always on standby.'
    },
    {
        icon: Copy,
        title: 'Flexible Plans & Free Cancellations',
        desc: 'Many stays and packages offer flexible dates and generous cancellation policies.'
    }
];

const WhyTravelersChooseUs = () => {
    return (
        <section className="py-12 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-[36px] font-bold text-gray-900 font-display mb-8 leading-tight">
                            Why Travelers Continue<br />Choosing Trip Sathi
                        </h2>

                        <div className="flex flex-col">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`flex items-start gap-5 py-4 border-b border-gray-100 ${index === features.length - 1 ? 'border-none' : ''}`}
                                >
                                    <div className="flex-shrink-0 mt-1 text-gray-700">
                                        <feature.icon className="w-6 h-6 stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h4>
                                        <p className="text-gray-500 leading-relaxed text-sm pr-4 lg:pr-12">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[400px] lg:h-[500px] w-full lg:w-[450px] ml-auto"
                    >
                        <img 
                            src="https://images.pexels.com/photos/868097/pexels-photo-868097.jpeg" 
                            alt="Travelers smiling together on a mountain" 
                            className="w-full h-full object-cover rounded-[24px]"
                            loading="lazy"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default WhyTravelersChooseUs;
