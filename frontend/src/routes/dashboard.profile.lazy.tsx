import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateGuideProfileAPI } from '../services/profile.service';

export const Route = createLazyFileRoute('/dashboard/profile')({
    component: ProfileCompletionPage,
});

function ProfileCompletionPage() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('You must be logged in to complete your profile.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await updateGuideProfileAPI(token, phoneNumber, address);
            navigate({ to: '/' });
        } catch (err: any) {
            console.error('Profile update failed:', err);
            setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-sky-100 mt-10">
                <div className="px-8 py-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                        <p className="text-gray-500">Almost there! We just need a few more details to set up your guide profile.</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Full Address
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm resize-none"
                                    placeholder="Street address, City, State, ZIP code"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-70"
                            >
                                {isSubmitting ? 'Saving Profile...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="px-8 py-6 bg-sky-50 border-t border-sky-100">
                    <p className="text-xs text-gray-500 text-center">
                        Your contact details are securely stored. They will be shared with travelers only upon a confirmed booking.
                    </p>
                </div>
            </div>
        </div>
    );
}
