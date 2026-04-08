"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How do I book a trip with Trip Sathi?",
        answer: "You can easily browse destinations, select dates, and book your entire trip—including flights, hotels, and activities—directly through our platform."
    },
    {
        question: "Can I change or cancel my booking?",
        answer: "Many properties and packages offer free changes or cancellations. Check the policy on each listing before you confirm your booking."
    },
    {
        question: "Is it safe to pay through Trip Sathi?",
        answer: "Yes, we use bank-level encryption and secure payment gateways to ensure your transactions and personal information are always protected."
    },
    {
        question: "Do you offer support if something goes wrong during my trip?",
        answer: "Absolutely! Our 24/7 customer support team is always on standby to assist you with any issues before, during, or after your trip."
    },
    {
        question: "Can I customize a pre-made trip package?",
        answer: "Yes, our flexible platform allows you to tweak itineraries, add specific spots, or change dates easily before confirming."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-gray-50/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-3">
                        Need Help Before You Book?
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                        Learn how Trip Sathi helps you explore options, compare prices, and book with confidence.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
                                >
                                    <span className="text-base font-semibold text-gray-900">
                                        {faq.question}
                                    </span>
                                    <span className="ml-4 shrink-0 text-gray-400">
                                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </span>
                                </button>
                                
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-5 pt-0 text-gray-500 text-sm leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQ;
