'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setIsVisible(true);
    setIsExiting(false);

    // Hide loader after navigation completes
    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 300);
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[99999] bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary bg-size-[200%_100%] ${isExiting ? 'animate-loader-out' : 'animate-loader-in'}`}
    />
  );
}