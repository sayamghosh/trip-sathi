'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);
  const mountedRef = useRef(false);

  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    // Skip on initial mount
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setIsActive(true);
    const timer = setTimeout(() => setIsActive(false), 1200);

    return () => clearTimeout(timer);
  }, [routeKey]);

  // Don't render on initial mount
  if (!mountedRef.current) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[99999] bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary bg-size-[200%_100%] ${
        isActive ? 'animate-loader-page' : 'opacity-0'
      } transition-opacity duration-200`}
      role="progressbar"
      aria-label="Loading page"
    />
  );
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}