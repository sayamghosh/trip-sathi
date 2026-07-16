"use client";

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

const LENIS_RESIZE_EVENT = 'lenis:resize';

/**
 * Lenis only recalculates scroll boundaries on a 250ms-debounced
 * ResizeObserver. Call this right after content that changes page
 * height mounts (e.g. a loading skeleton swapping for real content)
 * so Lenis doesn't clamp an in-progress scroll gesture to a stale,
 * shorter boundary until the debounce catches up.
 */
export function requestLenisResize() {
    window.dispatchEvent(new Event(LENIS_RESIZE_EVENT));
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

        const handleResizeRequest = () => lenisRef.current?.resize();
        window.addEventListener(LENIS_RESIZE_EVENT, handleResizeRequest);

        // Cleanup on unmount
        return () => {
            window.removeEventListener(LENIS_RESIZE_EVENT, handleResizeRequest);
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
