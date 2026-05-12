"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollRestoration = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Small delay to ensure navigation has completed
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 10);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollRestoration;