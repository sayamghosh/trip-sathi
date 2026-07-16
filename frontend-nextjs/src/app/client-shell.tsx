"use client";

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollRestoration from '../components/ScrollRestoration';
import { PageTransitionLoader } from '../components/PageTransitionLoader';

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSearchPage = pathname === '/search';
    const hasOwnChrome = pathname?.startsWith('/become-a-guide');

    return (
        <>
            <PageTransitionLoader />
            <ScrollRestoration />
            {!hasOwnChrome && (
                <Suspense fallback={null}>
                    <Navbar />
                </Suspense>
            )}
            <main id="main-content" className="min-h-screen">
                {children}
            </main>
            {!hasOwnChrome && (
                <div className={isSearchPage ? "hidden md:block" : "block"}>
                    <Footer />
                </div>
            )}
        </>
    );
}