'use client';

import { usePathname } from 'next/navigation';

export function PageTransitionLoader() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="fixed top-0 left-0 right-0 h-1 z-[99999] bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary bg-size-[200%_100%] animate-loader-page"
      role="progressbar"
      aria-label="Loading page"
    />
  );
}