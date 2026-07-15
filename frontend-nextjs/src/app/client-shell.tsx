"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollRestoration from '../components/ScrollRestoration';
import { PageTransitionLoader } from '../components/PageTransitionLoader';

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hasOwnChrome = pathname?.startsWith('/become-a-guide');

    return (
        <>
            <PageTransitionLoader />
            <ScrollRestoration />
            {!hasOwnChrome && <Navbar />}
            <main id="main-content">
                {children}
            </main>
            {!hasOwnChrome && <Footer />}
        </>
    );
}