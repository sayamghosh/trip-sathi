"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { AuthFlowProvider } from '../context/AuthFlowContext';
import SmoothScroll from '../components/SmoothScroll';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AuthFlowProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <SmoothScroll>{children}</SmoothScroll>
            </AuthFlowProvider>
        </AuthProvider>
    );
}
