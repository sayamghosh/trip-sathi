import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Optimizes image URLs for faster loading:
 * - Cloudinary: injects f_auto,q_auto,w_{width} transforms (serves WebP/AVIF automatically)
 * - Unsplash: appends fm=webp for modern format delivery
 * - Other URLs: pass through unchanged
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
    if (!url) return url;

    // Cloudinary: inject transforms after /upload/
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        const transforms = [
            'f_auto',   // auto-format (WebP/AVIF per browser)
            'q_auto',   // auto quality
            ...(width ? [`w_${width}`] : []),
        ].join(',');
        return url.replace('/upload/', `/upload/${transforms}/`);
    }

    // Unsplash: add fm=webp if not already present
    if (url.includes('images.unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        if (!url.includes('fm=')) {
            url = `${url}${separator}fm=webp`;
        }
        return url;
    }

    return url;
}
