"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, History, ArrowRight, X, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const trendingDestinations = [
    { name: "Munnar", region: "Kerala", image: "https://images.unsplash.com/photo-1591089101324-2280d9260000?w=800&q=80" },
    { name: "Leh", region: "Ladakh", image: "https://images.unsplash.com/photo-1542429296407-20c78e10f375?w=800&q=80" },
    { name: "Udaipur", region: "Rajasthan", image: "https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?w=800&q=80" },
    { name: "Manali", region: "Himachal", image: "https://images.unsplash.com/photo-1627370778723-4d26700cd972?w=800&q=80" },
];

const popularDestinations = [
    "Kashmir", "Goa", "Sikkim", "Andaman", "Coorg", "Rishikesh", "Varanasi", 
    "Hampi", "Mysore", "Agra", "Jaipur", "Jodhpur", "Pushkar", "Jaisalmer", 
    "Mount Abu", "Chittorgarh", "Bikaner", "Alwar", "Kota", "Bharatpur",
    "Darjeeling", "Gangtok", "Shimla", "Kodaikanal", "Ooty", "Pondicherry"
];

const popularThemes = ["Adventure", "Beaches", "Cultural", "Luxury"];

interface NavbarSearchProps {
    isMobile?: boolean;
    autoFocus?: boolean;
    onClose?: () => void;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ isMobile = false, autoFocus = false, onClose }) => {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(autoFocus);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            try {
                const parsedSearches = JSON.parse(saved).slice(0, 5);
                setRecentSearches(parsedSearches);
            } catch {
                setRecentSearches([]);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setSelectedIndex(-1);
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const allSuggestions = useMemo(() => {
        return [
            ...trendingDestinations.map((d) => d.name),
            ...popularThemes,
            ...popularDestinations,
            ...recentSearches,
        ];
    }, [recentSearches]);

    const filteredSuggestions = useMemo(() => {
        if (!query.trim()) return [];
        return [...new Set(allSuggestions)].filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allSuggestions]);

    const handleSearch = (searchTerm: string) => {
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        const updated = [
            trimmed,
            ...recentSearches.filter((s) => s !== trimmed),
        ].slice(0, 5);

        localStorage.setItem("recentSearches", JSON.stringify(updated));
        setRecentSearches(updated);
        
        setIsFocused(false);
        setQuery("");
        inputRef.current?.blur();
        onClose?.();
        
        router.push(`/search?destination=${encodeURIComponent(trimmed)}`);
    };

    const clearRecentSearches = (e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.removeItem("recentSearches");
        setRecentSearches([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setIsFocused(false);
            inputRef.current?.blur();
        }
        if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
        }
        if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
            e.preventDefault();
            setSelectedIndex((prev) => prev <= 0 ? filteredSuggestions.length - 1 : prev - 1);
        }
        if (e.key === "Enter") {
            if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
                handleSearch(filteredSuggestions[selectedIndex]);
            } else {
                handleSearch(query);
            }
        }
    };

    return (
        <div 
            ref={containerRef} 
            className={`relative ${isMobile ? 'flex-1 mx-4 my-2' : 'mr-5'}`}
        >
            {/* Search Input Box */}
            <div 
                className={`relative flex items-center transition-all duration-300 ease-in-out bg-white rounded-full z-[60] ${
                    isFocused 
                    ? `border-[#1458df] ring-4 ring-[#1458df]/10 shadow-lg ${isMobile ? 'w-full' : 'w-[320px]'}` 
                    : `border-gray-200 bg-gray-50/80 hover:bg-white hover:border-[#1458df]/30 ${isMobile ? 'w-full' : 'w-[240px]'}`
                } border`}
            >
                <Search size={16} className={`ml-3.5 mr-2 shrink-0 transition-colors ${isFocused ? 'text-[#1458df]' : 'text-gray-400'}`} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={isMobile ? "Search..." : "Search destinations..."}
                    className={`flex-1 bg-transparent py-2 text-[13px] font-medium outline-none text-gray-900 placeholder:text-gray-500 pr-8 ${isMobile ? 'py-2.5 text-[14px]' : ''}`}
                />
                
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="absolute right-3 text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100"
                        >
                            <X size={14} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Backdrop */}
            {isMobile && isFocused && (
                <div className="fixed top-[60px] inset-x-0 bottom-0 bg-white z-[40]" onClick={() => {
                    setIsFocused(false);
                    onClose?.();
                }} />
            )}

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={isMobile
                            ? "fixed top-[60px] left-0 right-0 h-[calc(100vh-60px)] bg-white rounded-none border-t border-gray-100 shadow-none overflow-y-auto z-[50]"
                            : "absolute top-[calc(100%+8px)] right-0 w-[420px] max-h-[480px] bg-white rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-y-auto z-[60]"
                        }
                    >
                        <div className="p-4 sm:p-5">
                            {/* Suggestions List */}
                            {query.trim() ? (
                                <div className="space-y-1">
                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map((item, index) => (
                                            <button
                                                key={item}
                                                onClick={() => handleSearch(item)}
                                                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                                                    selectedIndex === index ? "bg-[#f4f7fd]" : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-[#1458df]/10 group-hover:text-[#1458df] transition-colors">
                                                        <Search size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-medium text-gray-900 group-hover:text-[#1458df]">{item}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-[#1458df] transition-all" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-[13px] font-medium text-gray-900">No matches for "{query}"</p>
                                            <p className="text-[12px] text-gray-500 mt-1">Try a different destination</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                                    <History size={13} />
                                                    Recent Searches
                                                </h3>
                                                <button onClick={clearRecentSearches} className="text-[11px] font-medium text-[#1458df] hover:underline">
                                                    Clear All
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {recentSearches.map((search) => (
                                                    <button
                                                        key={search}
                                                        onClick={() => handleSearch(search)}
                                                        className="px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trending */}
                                    <div>
                                        <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                            <TrendingUp size={13} />
                                            Trending Destinations
                                        </h3>
                                        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-3`}>
                                            {trendingDestinations.map((dest) => (
                                                <button
                                                    key={dest.name}
                                                    onClick={() => handleSearch(dest.name)}
                                                    className="group relative aspect-[4/5] overflow-hidden rounded-xl"
                                                >
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-2 left-2 right-2 text-left">
                                                        <p className="text-[12px] font-medium text-white">{dest.name}</p>
                                                        <p className="text-[10px] text-gray-300">{dest.region}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavbarSearch;
