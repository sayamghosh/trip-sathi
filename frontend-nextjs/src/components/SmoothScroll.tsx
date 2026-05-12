"use client";

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

/**
 * Butter-smooth scroll wrapper using Lenis.
 * Provides a native-feeling, momentum-based scroll experience.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Initialize Lenis with optimized settings for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,           // Scroll duration (higher = smoother but slower)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease-out expo
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,      // Default wheel sensitivity
            touchMultiplier: 2,      // Touch/trackpad sensitivity
        });

        lenisRef.current = lenis;

        // RAF loop for smooth updates
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup on unmount
        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Reset scroll position on route change
    useEffect(() => {
        // Small delay to ensure page transition completes
        const timer = setTimeout(() => {
            lenisRef.current?.scrollTo(0, { immediate: true });
        }, 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    return <>{children}</>;
}
