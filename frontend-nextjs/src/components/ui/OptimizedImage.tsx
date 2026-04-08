"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, type ImgHTMLAttributes } from 'react';
import { cn, getOptimizedImageUrl } from '../../lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
    /** Image source URL — automatically optimized for Cloudinary/Unsplash */
    src: string;
    alt: string;
    /** Desired display width — used for Cloudinary resize transforms */
    width?: number;
    /** Desired display height */
    height?: number;
    /** Mark as high-priority LCP image (eager load + fetchpriority high) */
    priority?: boolean;
    /** Fallback image URL on error */
    fallbackSrc?: string;
    /** Extra wrapper className (for the shimmer container) */
    containerClassName?: string;
}

/**
 * Drop-in `<img>` replacement with:
 * - Automatic Cloudinary/Unsplash URL optimisation (WebP/AVIF, auto quality, resize)
 * - Native lazy loading + async decoding for non-priority images
 * - fetchpriority="high" for LCP / above-fold images
 * - CSS shimmer placeholder while loading
 * - Graceful error fallback
 * - Explicit width/height to prevent CLS
 */
export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    fallbackSrc,
    className,
    containerClassName,
    ...rest
}: OptimizedImageProps) {
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    // Optimise URL through Cloudinary/Unsplash transforms
    const primarySrc = getOptimizedImageUrl(src, width);
    const fallbackOptimizedSrc = fallbackSrc ? getOptimizedImageUrl(fallbackSrc, width) : undefined;
    const isPrimaryFailed = failedSrc === primarySrc;
    const optimizedSrc = isPrimaryFailed && fallbackOptimizedSrc ? fallbackOptimizedSrc : primarySrc;
    const isLoaded = loadedSrc === optimizedSrc;

    return (
        <div
            className={cn(
                'relative overflow-hidden',
                !isLoaded && 'animate-shimmer bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]',
                containerClassName,
            )}
            style={{
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined,
            }}
        >
            <img
                src={optimizedSrc}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : undefined}
                className={cn(
                    'transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className,
                )}
                onLoad={() => setLoadedSrc(optimizedSrc)}
                onError={() => {
                    if (optimizedSrc === primarySrc && fallbackOptimizedSrc) {
                        setFailedSrc(primarySrc);
                        return;
                    }
                    setLoadedSrc(optimizedSrc); // stop shimmer even on final error
                }}
                {...rest}
            />
        </div>
    );
}
