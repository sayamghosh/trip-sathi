"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Search,
    TrendingUp,
    History,
    Mountain,
    Palmtree,
    Landmark,
    Sparkles,
    ArrowRight,
    MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const trendingDestinations = [
    {
        name: "Munnar",
        region: "Kerala",
        image:
            "https://images.unsplash.com/photo-1591089101324-2280d9260000?w=800&q=80",
    },
    {
        name: "Leh",
        region: "Ladakh",
        image:
            "https://images.unsplash.com/photo-1542429296407-20c78e10f375?w=800&q=80",
    },
    {
        name: "Udaipur",
        region: "Rajasthan",
        image:
            "https://images.unsplash.com/flagged/photo-1577605047476-202951cec757?w=800&q=80",
    },
    {
        name: "Manali",
        region: "Himachal",
        image:
            "https://images.unsplash.com/photo-1627370778723-4d26700cd972?w=800&q=80",
    },
];

const popularDestinations = [
    "Kashmir", "Goa", "Sikkim", "Andaman", "Coorg", "Rishikesh", "Varanasi", 
    "Hampi", "Mysore", "Agra", "Jaipur", "Jodhpur", "Pushkar", "Jaisalmer", 
    "Mount Abu", "Chittorgarh", "Bikaner", "Alwar", "Kota", "Bharatpur",
    "Darjeeling", "Gangtok", "Shimla", "Kodaikanal", "Ooty", "Pondicherry"
];

const popularThemes = [
    {
        name: "Adventure",
        image:
            "https://images.unsplash.com/photo-1533240332313-0db3604539a2?w=800&q=80",
        icon: <Mountain size={18} />,
    },
    {
        name: "Beaches",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        icon: <Palmtree size={18} />,
    },
    {
        name: "Cultural",
        image:
            "https://images.unsplash.com/photo-1524492718563-54485d268571?w=800&q=80",
        icon: <Landmark size={18} />,
    },
    {
        name: "Luxury",
        image:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        icon: <Sparkles size={18} />,
    },
];

const SearchModal: React.FC<SearchModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 120);

            const saved = localStorage.getItem("recentSearches");

            if (saved) {
                try {
                    const parsedSearches = JSON.parse(saved).slice(0, 5);
                    queueMicrotask(() => setRecentSearches(parsedSearches));
                } catch {
                    queueMicrotask(() => setRecentSearches([]));
                }
            }
        }

    }, [isOpen]);

    const allSuggestions = useMemo(() => {
        return [
            ...trendingDestinations.map((d) => d.name),
            ...popularThemes.map((t) => t.name),
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

        localStorage.setItem(
            "recentSearches",
            JSON.stringify(updated)
        );

        onClose();

        router.push(
            `/search?destination=${encodeURIComponent(trimmed)}`
        );
    };

    const clearRecentSearches = () => {
        localStorage.removeItem("recentSearches");
        setRecentSearches([]);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Escape") {
            onClose();
        }

        if (
            e.key === "ArrowDown" &&
            filteredSuggestions.length > 0
        ) {
            e.preventDefault();

            setSelectedIndex(
                (prev) => (prev + 1) % filteredSuggestions.length
            );
        }

        if (
            e.key === "ArrowUp" &&
            filteredSuggestions.length > 0
        ) {
            e.preventDefault();

            setSelectedIndex((prev) =>
                prev === 0
                    ? filteredSuggestions.length - 1
                    : prev - 1
            );
        }

        if (e.key === "Enter") {
            if (filteredSuggestions[selectedIndex]) {
                handleSearch(filteredSuggestions[selectedIndex]);
            } else {
                handleSearch(query);
            }
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-[#202124]/55 px-2 py-2 backdrop-blur-md sm:px-4 sm:py-6 md:px-6 md:py-[5vh]"
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.96,
                        y: -20,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.96,
                        y: -20,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 26,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex h-auto max-h-[90vh] w-full max-w-[820px] flex-col rounded-[18px] border border-[#e7e9ee] bg-white text-[#202124] shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:rounded-[20px] xl:max-w-[700px]"
                >
                    {/* Header */}
                    <div className="relative border-b border-[#edf0f4] px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4 md:px-8 md:pb-6 md:pt-6 lg:pb-5 lg:pt-5">
                        <div className="mb-3 flex items-start justify-between gap-4 sm:mb-4 sm:gap-5 lg:mb-5">
                            <div className="min-w-0">
                                <p className="text-[12px] lg:text-[14px] font-medium uppercase tracking-[0.18em] text-[#9aa0a9]">
                                    Tripsathi Search
                                </p>
                                <h2 className="mt-1 text-[24px] lg:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-[#202124]">
                                    Where do you want to go?
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="grid h-9 w-9 cursor-pointer shrink-0 place-items-center rounded-full border border-[#edf0f4] text-[#73777f] transition hover:border-[#d9dde4] hover:bg-[#f7f8fa] hover:text-[#202124] sm:h-10 sm:w-10"
                                type="button"
                                aria-label="Close search"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="group flex min-h-[54px] items-center rounded-full border border-[#eaedf1] bg-white p-1 pl-3 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] focus-within:border-[#1458df] focus-within:ring-4 focus-within:ring-[#1458df]/5 sm:min-h-[58px] sm:pl-5 md:pl-6">
                            <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#1458df] sm:mr-3 sm:h-5 sm:w-5" />

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search destinations, themes, experiences..."
                                className="h-11 min-w-0 flex-1 bg-transparent text-[14px] lg:text-[16px] font-medium text-[#2a2d31] outline-none placeholder:text-[#767b84] sm:h-12"
                            />

                            <button
                                onClick={() => handleSearch(query)}
                                className="ml-2 inline-flex h-[42px] cursor-pointer shrink-0 items-center justify-center gap-2 rounded-full bg-[#1458df] px-4 text-[12px] font-medium text-white shadow-[0_4px_12px_rgba(20,88,223,0.15)] transition-all hover:bg-[#1049ba] hover:shadow-[0_8px_16px_rgba(20,88,223,0.25)] active:scale-95 sm:ml-3 sm:h-[48px] sm:px-6 sm:text-[13px] md:px-6"
                                type="button"
                            >
                                <Search size={17} />
                                <span className="hidden sm:inline text-[12px] lg:text-[14px]">
                                    Search
                                </span>
                            </button>
                        </div>

                        {/* Suggestions Dropdown (Absolute) */}
                        <div className="relative">
                            <AnimatePresence>
                                {query.trim() && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 4,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: 4,
                                        }}
                                        className="absolute left-0 right-0 z-[10] mt-2 max-h-[380px] overflow-y-auto rounded-[16px] border border-[#edf0f4] bg-white p-2 shadow-xl"
                                    >
                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map(
                                            (item, index) => (
                                                <button
                                                    key={item}
                                                    onClick={() =>
                                                        handleSearch(item)
                                                    }
                                                    className={`group flex w-full items-center justify-between rounded-[12px] px-3 py-3 text-left transition-all sm:px-4 ${
                                                        selectedIndex === index
                                                            ? "bg-white shadow-sm border border-gray-100"
                                                            : "hover:bg-white border border-transparent"
                                                    }`}
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f3f6] text-[#73777f] transition-colors group-hover:bg-[#1458df]/10 group-hover:text-[#1458df]">
                                                            <Search size={14} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-[12px] lg:text-[14px] font-medium text-[#202124] transition-colors group-hover:text-[#1458df]">
                                                                {item}
                                                            </p>

                                                            <p className="text-[10px] lg:text-[12px] font-normal text-[#9aa0a9]">
                                                                Explore destination
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <ArrowRight
                                                        size={14}
                                                        className="ml-3 shrink-0 text-[#cbd1d9] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#1458df]"
                                                    />
                                                </button>
                                            )
                                        )
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                                <Search size={20} />
                                            </div>
                                            <p className="text-[14px] font-medium text-[#202124]">
                                                No matches for "{query}"
                                            </p>
                                            <p className="mt-1 text-[12px] text-[#73777f]">
                                                Try searching for a different destination or theme.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Content Area with Clipping */}
                    <div className="relative flex-1 overflow-hidden rounded-b-[18px] sm:rounded-b-[20px]">
                        <div className="relative h-full overflow-y-auto px-3 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5 md:px-6 md:pb-7 md:pt-6 lg:pb-7 lg:pt-7">
                            <div className="space-y-6 sm:space-y-7 md:space-y-8">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <section>
                                        <div className="mb-5 flex items-end justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="flex items-center gap-2 text-[12px] lg:text-[14px] font-medium uppercase tracking-[0.2em] text-[#9aa0a9]">
                                                    <History size={13} />
                                                    Recent Searches
                                                </h3>

                                                <p className="mt-2 text-[14px] lg:text-[16px] font-normal leading-[1.6] text-[#73777f]">
                                                    Quickly jump back into places
                                                    you explored recently.
                                                </p>
                            </div>

                                            <button
                                                onClick={clearRecentSearches}
                                                className="mb-1 shrink-0 text-[12px] lg:text-[14px] font-medium text-[#1458df] transition-all hover:opacity-70 active:scale-95 cursor-pointer"
                                            >
                                                Clear All
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {recentSearches.map(
                                                (search) => (
                                                    <motion.button
                                                        whileHover={{
                                                            y: -2,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.97,
                                                        }}
                                                        key={search}
                                                        onClick={() =>
                                                            handleSearch(
                                                                search
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-full border border-[#eaedf1] bg-white px-4 py-2.5 text-[12px] lg:text-[14px] font-medium text-[#565b63] shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all hover:border-[#1458df]/20 hover:bg-[#1458df]/5 hover:text-[#1458df] sm:px-5 sm:py-3"
                                                    >
                                                        {search}
                                                    </motion.button>
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Trending */}
                                <section>
                                    <div className="mb-6">
                                        <h3 className="flex items-center gap-2 text-[12px] lg:text-[14px] font-medium uppercase tracking-[0.2em] text-[#9aa0a9]">
                                            <TrendingUp size={13} />
                                            Trending Destinations
                                        </h3>

                                        <p className="mt-2 text-[14px] lg:text-[16px] font-normal leading-[1.6] text-[#73777f]">
                                            Curated destinations loved by
                                            travelers this season.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                                        {trendingDestinations.map(
                                            (dest) => (
                                                <motion.button
                                                    whileHover={{
                                                        y: -4,
                                                    }}
                                                    whileTap={{
                                                        scale: 0.98,
                                                    }}
                                                    key={dest.name}
                                                    onClick={() =>
                                                        handleSearch(
                                                            dest.name
                                                        )
                                                    }
                                                    className="group relative aspect-[1/1.2] cursor-pointer overflow-hidden rounded-[15px] bg-[#f5f5f5] lg:aspect-[4/5]"
                                                >
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/70" />

                                                    <div className="absolute bottom-3 left-3 right-3 text-left sm:bottom-4 sm:left-4 sm:right-4">
                                                        <p className="text-[14px] lg:text-[16px] font-medium text-white">
                                                            {dest.name}
                                                        </p>

                                                        <p className="mt-1 text-[11px] lg:text-[12px] font-medium uppercase tracking-[0.15em] text-white/75">
                                                            {dest.region}
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            )
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default SearchModal;``