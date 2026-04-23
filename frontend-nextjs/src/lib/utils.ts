import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Optimizes image URLs for faster loading while maintaining quality:
 * - Requests 2x width for retina displays
 * - Cloudinary: f_auto,q_80 (higher quality)
 * - Unsplash: fm=webp&q=85
 * - Pexels: dpr=2 for high-DPI without aggressive compression
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
    if (!url) return url;

    // Request 2x for retina displays
    const retinaWidth = width ? width * 2 : undefined;

    // Cloudinary: inject transforms after /upload/
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        const transforms = [
            'f_auto',       // auto-format (WebP/AVIF per browser)
            'q_80',         // quality 80 (good balance)
            ...(retinaWidth ? [`w_${retinaWidth}`] : []),
        ].join(',');
        return url.replace('/upload/', `/upload/${transforms}/`);
    }

    // Unsplash: add quality and format params
    if (url.includes('images.unsplash.com')) {
        const params = new URLSearchParams();
        params.set('fm', 'webp');
        params.set('q', '85');
        if (retinaWidth) params.set('w', String(retinaWidth));
        
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${params.toString()}`;
    }

    // Pexels: use dpr=2 for retina without over-compression
    if (url.includes('images.pexels.com')) {
        const params = new URLSearchParams();
        params.set('auto', 'compress');
        params.set('cs', 'tinysrgb');
        params.set('dpr', '2');  // Request 2x for retina
        if (width) params.set('w', String(width)); // Original width, dpr handles retina
        
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${params.toString()}`;
    }

    return url;
}
