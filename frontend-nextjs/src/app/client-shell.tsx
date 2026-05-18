"use client";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollRestoration from '../components/ScrollRestoration';
import { PageTransitionLoader } from '../components/PageTransitionLoader';

export default function ClientShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PageTransitionLoader />
            <ScrollRestoration />
            <Navbar />
            <div className="pt-12 lg:pt-0">{children}</div>
            <Footer />
        </>
    );
}