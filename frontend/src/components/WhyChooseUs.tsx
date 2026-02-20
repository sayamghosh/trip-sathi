import { motion } from 'framer-motion';

const features = [
    {
        icon: "https://cdn-icons-png.flaticon.com/512/2953/2953363.png", // Wallet/Money
        title: 'Best Price Guaranteed',
        desc: 'Direct connection means no middleman commissions. You save 15-20% on every trip.'
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png", // Chat/Talk
        title: 'Customize Your Trip',
        desc: 'Talk directly to the guide. Tweak the itinerary, add spots, or change dates easily.'
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/1161/1161388.png", // Shield/Verified
        title: 'Verified Locals',
        desc: 'Every guide is KYC verified. We ensure safety and authenticity for your peace of mind.'
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/2099/2099192.png", // Support
        title: '24/7 Support',
        desc: 'Our platform support team is always here to help you before, during, and after your trip.'
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-sky-50/50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <h3 className="text-brand-primary font-semibold uppercase tracking-wider mb-2">Why Trip-Sathi?</h3>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 font-display mb-16">Travel Smart, Pay Less</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-[32px] hover:shadow-xl transition-all duration-300 group text-center border border-gray-100 relative overflow-hidden"
                        >
                            <div className="relative mb-6 inline-block">
                                <img src={feature.icon} alt={feature.title} className="h-16 w-auto mx-auto relative z-10" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-sky-50 rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                            <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
