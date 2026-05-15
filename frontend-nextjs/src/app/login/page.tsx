"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from '../../legacy-pages/LoginPage';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function Login() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginPage />
        </GoogleOAuthProvider>
    );
}
