"use client";

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { googleLoginAPI } from '../services/auth.service';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            setError(null);
            if (credentialResponse.credential) {
                // Send the token to your backend
                const authData = await googleLoginAPI(credentialResponse.credential);

                // Update global auth state
                login(authData);

                // Redirect to homepage or user dashboard
                router.push('/');
            }
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleError = () => {
        setError('Google Sign-In was unsuccessful. Try again later.');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to Trip Sathi</h1>
                    <p className="text-gray-500">Sign in to find your perfect travel guide</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="pt-4 flex justify-center w-full">
                    {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            useOneTap
                            theme="filled_blue"
                            shape="rectangular"
                            size="large"
                        />
                    )}
                </div>

                <p className="text-xs text-gray-400 pt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
