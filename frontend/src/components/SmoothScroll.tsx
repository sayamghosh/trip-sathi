import { useEffect, useRef, type ReactNode } from 'react';
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

    return <>{children}</>;
}
