"use client";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollRestoration from '../components/ScrollRestoration';

export default function ClientShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollRestoration />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
