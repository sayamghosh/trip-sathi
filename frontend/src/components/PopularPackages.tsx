import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

const packages = [
    {
        id: 1,
        title: 'Majestic Manali Retreat',
        location: 'Himachal Pradesh',
        duration: '3 Nights / 4 Days',
        price: '₹5,999',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        guide: {
            name: 'Amit Kumar',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        }
    },
    {
        id: 2,
        title: 'Goa Beach Paradise',
        location: 'Goa, India',
        duration: '4 Nights / 5 Days',
        price: '₹8,499',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        rating: 4.7,
        guide: {
            name: 'Sarah J.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        }
    },
    {
        id: 3,
        title: 'Kerala Backwaters',
        location: 'Alleppey, Kerala',
        duration: '2 Nights / 3 Days',
        price: '₹4,500',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        guide: {
            name: 'Rahul V.',
            image: 'https://randomuser.me/api/portraits/men/85.jpg'
        }
    },
    {
        id: 4,
        title: 'Jaipur Royal Tour',
        location: 'Rajasthan, India',
        duration: '2 Nights / 3 Days',
        price: '₹3,999',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        guide: {
            name: 'Priya S.',
            image: 'https://randomuser.me/api/portraits/women/68.jpg'
        }
    }
];

const PopularPackages = () => {
    return (
        <section className="py-20 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                        <h3 className="text-brand-primary font-semibold uppercase tracking-wider mb-2">Best Selling</h3>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 font-display">Popular Tour Packages</h2>
                    </div>
                    <button className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
                        View All Packages <ArrowRight size={20} />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[24px] border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="h-[220px] overflow-hidden rounded-t-[24px] relative">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-800">
                                    <Clock size={14} className="text-brand-primary" /> {pkg.duration}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-primary transition-colors">{pkg.title}</h3>
                                    <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                        <Star size={12} fill="currentColor" /> {pkg.rating}
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                                    <MapPin size={14} /> {pkg.location}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase font-bold">Starts From</p>
                                        <p className="text-xl font-bold text-brand-primary">{pkg.price}</p>
                                    </div>

                                    {/* Guided By Badge */}
                                    <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
                                        <img src={pkg.guide.image} className="w-8 h-8 rounded-full border border-gray-200" alt={pkg.guide.name} />
                                        <div>
                                            <p className="text-[10px] text-gray-400">Guided by</p>
                                            <p className="text-xs font-bold text-gray-700">{pkg.guide.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PopularPackages;
