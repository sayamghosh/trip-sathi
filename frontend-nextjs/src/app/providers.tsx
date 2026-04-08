"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { AuthFlowProvider } from '../context/AuthFlowContext';
import SmoothScroll from '../components/SmoothScroll';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AuthFlowProvider>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <Toaster position="top-center" reverseOrder={false} />
                    <SmoothScroll>{children}</SmoothScroll>
                </GoogleOAuthProvider>
            </AuthFlowProvider>
        </AuthProvider>
    );
}
