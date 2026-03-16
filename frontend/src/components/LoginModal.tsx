import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { googleLoginAPI } from '../services/auth.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Star, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const features = [
    {
        icon: <Users className="w-8 h-8 text-sky-500" />,
        title: 'Connect with Local Experts',
        description: 'Browse hundreds of verified local guides ready to show you the real side of every destination.',
        bg: 'from-sky-50 to-blue-50',
    },
    {
        icon: <MapPin className="w-8 h-8 text-emerald-500" />,
        title: 'Discover Hidden Gems',
        description: 'Go beyond tourist traps. Your local guide knows the secret spots that no travel blog will tell you.',
        bg: 'from-emerald-50 to-teal-50',
    },
    {
        icon: <Star className="w-8 h-8 text-amber-500" />,
        title: 'Trusted by 10,000+ Travellers',
        description: 'Real reviews, real experiences. Every guide on Trip Sathi is rated by travellers just like you.',
        bg: 'from-amber-50 to-orange-50',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-violet-500" />,
        title: '100% Verified Guides',
        description: 'Every guide is identity-verified and background-checked so you can travel with complete confidence.',
        bg: 'from-violet-50 to-purple-50',
    },
];

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const { login } = useAuth();

    // Auto-cycle through features
    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 2800);
        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            setError(null);
            if (credentialResponse.credential) {
                const authData = await googleLoginAPI(credentialResponse.credential);
                login(authData);
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const feature = features[activeFeature];

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center px-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            >
                <motion.div
                    key="modal-card"
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 20 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl bg-white"
                    style={{ minHeight: '500px' }}
                >
                    {/* ── LEFT PANEL: Scenic photo ── */}
                    <div className="hidden md:block relative w-[42%] flex-shrink-0 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&fm=webp"
                            alt="Beautiful mountain landscape"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(160deg, rgba(3,30,60,0.60) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.70) 100%)' }}
                        />
                        <div className="relative z-10 flex flex-col justify-between h-full p-8">
                            {/* Brand */}
                            <div>
                                <p className="text-white text-3xl font-bold drop-shadow-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                    Trip Sathi
                                </p>
                                <p className="text-white/75 text-xs mt-2 leading-relaxed max-w-[180px]">
                                    "Travel is the only purchase that enriches you beyond material wealth."
                                </p>
                            </div>
                            {/* Stats at bottom */}
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-white text-xl font-bold leading-none">500+</p>
                                    <p className="text-white/70 text-xs mt-0.5">Local Guides</p>
                                </div>
                                <div>
                                    <p className="text-white text-xl font-bold leading-none">10K+</p>
                                    <p className="text-white/70 text-xs mt-0.5">Travellers</p>
                                </div>
                                <div>
                                    <p className="text-white text-xl font-bold leading-none">4.9★</p>
                                    <p className="text-white/70 text-xs mt-0.5">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL: Feature showcase + Login ── */}
                    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="flex flex-col h-full px-12 py-12 justify-between">
                            {/* Heading */}
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Welcome back <span className="text-sky-500">✈</span>
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Sign in to explore local guides &amp; hidden gems.</p>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
                                    {error}
                                </div>
                            )}

                            {/* Google button */}
                            {loading ? (
                                <div className="flex items-center justify-center gap-3 py-4">
                                    <div className="h-5 w-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm text-gray-400">Signing you in…</span>
                                </div>
                            ) : (
                                <div className="flex justify-center w-full">
                                    <GoogleLogin
                                        onSuccess={handleSuccess}
                                        onError={() => setError('Sign-in failed. Please try again.')}
                                        theme="outline"
                                        shape="pill"
                                        size="large"
                                        logo_alignment="center"
                                        width="340"
                                        text="continue_with"
                                    />
                                </div>
                            )}

                            {/* Subtle divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-grow border-t border-gray-100" />
                                <span className="text-xs text-gray-300 uppercase tracking-widest font-medium">Why Trip Sathi?</span>
                                <div className="flex-grow border-t border-gray-100" />
                            </div>

                            {/* Subtle animated feature row */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="mt-0.5 shrink-0">{feature.icon}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{feature.title}</p>
                                        <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{feature.description}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dot indicators */}
                            <div className="flex gap-1.5 mt-3">
                                {features.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveFeature(i)}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === activeFeature ? 'w-5 bg-sky-400' : 'w-1 bg-gray-200'}`}
                                    />
                                ))}
                            </div>

                            {/* Footer note */}
                            <p className="text-xs text-center text-gray-300 leading-relaxed">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-sky-400 hover:underline">Terms</a>
                                {' '}&amp;{' '}
                                <a href="#" className="text-sky-400 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default LoginModal;
