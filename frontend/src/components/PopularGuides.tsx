import { motion } from 'framer-motion';
import { MapPin, Navigation, Star } from 'lucide-react';

const guides = [
    {
        id: 1,
        name: 'Rome, Italy',
        location: '10 Days Trip',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '$5.24k',
        rating: 4.8
    },
    {
        id: 2,
        name: 'London, UK',
        location: '07 Days Trip',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '$4.21k',
        rating: 4.7
    },
    {
        id: 3,
        name: 'Osaka, Japan',
        location: '12 Days Trip',
        image: 'https://images.unsplash.com/photo-1590559318664-4065694452bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '$6.50k',
        rating: 4.9
    },
    {
        id: 4,
        name: 'Bali, Indonesia',
        location: '05 Days Trip',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '$2.30k',
        rating: 4.8
    }
];

const PopularGuides = () => {
    return (
        <section className="py-20 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h3 className="text-gray-500 font-semibold uppercase tracking-wider mb-2">Top Selling</h3>
                    <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark font-display">Top Destinations</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {guides.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[32px] shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="h-[300px] overflow-hidden m-4 rounded-[24px]">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            <div className="px-6 pb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-500 font-medium">{item.location}</p>
                                    <p className="font-bold text-gray-400">$5.42k</p>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-brand-dark">{item.name}</h3>
                                </div>

                                <div className="flex items-center gap-2 mb-6 text-gray-500">
                                    <Navigation size={16} className="text-brand-dark" />
                                    <span>10 Days Trip</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PopularGuides;
