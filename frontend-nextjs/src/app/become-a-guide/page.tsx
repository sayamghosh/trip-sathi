"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { guideLoginAPI } from '../../services/auth.service';
import { CheckCircle, Shield, XCircle, Globe, Calendar, DollarSign, TrendingUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BecomeAGuidePage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pendingCredential, setPendingCredential] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError('Missing Google credential. Please try again.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Try direct login first; if server already has contact info, this succeeds and skips modal
      const authData = await guideLoginAPI(credentialResponse.credential);
      login(authData);
      router.push('/guide/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message;
      const needsContact = message?.toLowerCase().includes('phone number and address');
      if (needsContact) {
        setPendingCredential(credentialResponse.credential);
        setShowModal(true);
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google Sign-In was unsuccessful. Try again later.');
  };

  const handleSubmitContact = async () => {
    try {
      setLoading(true);
      setError(null);
      const trimmedPhone = phone.trim();
      const trimmedAddress = address.trim();

      if (!trimmedPhone || !trimmedAddress) {
        setError('Phone number and address are required to join as a guide.');
        setLoading(false);
        return;
      }

      if (!pendingCredential) {
        setError('Missing Google credential. Please try signing in again.');
        setLoading(false);
        return;
      }

      const authData = await guideLoginAPI(pendingCredential, trimmedPhone, trimmedAddress);
      login(authData);
      setShowModal(false);
      // Contact info is stored once; subsequent logins skip this step and go straight to dashboard
      router.push('/guide/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-5 font-sans">
      <ContactModal
        open={showModal}
        onClose={() => { if (!loading) { setShowModal(false); setPendingCredential(null); } }}
        phone={phone}
        address={address}
        setPhone={setPhone}
        setAddress={setAddress}
        onSubmit={handleSubmitContact}
        loading={loading}
      />
      {/* Hero Section */}
      <section className="relative bg-brand-primary text-white py-24 px-4 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-sky-400 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 rounded-full bg-brand-dark opacity-30 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-display leading-tight drop-shadow-md">
              Turn Your City Knowledge into a <span className="text-yellow-400">Thriving Business</span>
            </h1>
            <p className="text-xl text-sky-50 mb-10 max-w-xl mx-auto md:mx-0 font-medium opacity-90">
              Join TripSathi's growing network of local guides. Share your culture, meet travelers from around the world, and earn on your own terms.
            </p>

            <div className="flex flex-col items-center md:items-start mb-2">
              <div className="flex items-center gap-2 text-yellow-400 font-bold mb-3 animate-bounce">
                <span className="text-lg">Join now and get 3 months free access</span>
                <ArrowDown className="w-5 h-5 hidden sm:block" />
              </div>
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-left shadow-lg mb-4">
                <p className="text-sm text-sky-50 font-semibold">1) Tap Continue with Google</p>
                <p className="text-sm text-sky-50 mb-3">2) We’ll then ask for your phone and address in a quick modal (only once).</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center md:justify-start">
                <motion.div
                  className="relative rounded-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ opacity: 0, scale: 1 }}
                    whileHover={{ opacity: 1, scale: 1.25 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(56,189,248,0.35) 50%, transparent 75%)',
                      filter: 'blur(10px)',
                    }}
                  />
                  <div className="relative bg-white p-2 rounded-full shadow-2xl flex items-center justify-center">
                    {loading ? (
                      <div className="px-10 py-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mx-auto"></div>
                      </div>
                    ) : (
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="outline"
                        shape="pill"
                        size="large"
                        text="continue_with"
                      />
                    )}
                  </div>
                </motion.div>
                <span className="text-sky-100 text-sm font-medium">It takes only 2 minutes!</span>
              </div>
            </div>
            {error && <p className="text-red-300 text-sm mt-4 bg-red-900/40 p-3 rounded-lg inline-block border border-red-500/50">{error}</p>}
          </div>

          <div className="flex-1 hidden md:block">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&fm=webp"
                alt="Tour guide showing a group a map"
                className="rounded-3xl shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-112.5 w-full"
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">Average Earnings</p>
                  <p className="text-xl font-extrabold text-gray-900">₹40,000/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Features */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 font-display">Why Should You Join TripSathi?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              We provide the tools, the audience, and the trust. You provide the unforgettable experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-sky-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-sky-100">
              <div className="w-14 h-14 bg-sky-200 text-brand-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with thousands of travelers looking for authentic, local experiences that only you can provide.
              </p>
            </div>

            <div className="bg-emerald-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Set Your Own Price</h3>
              <p className="text-gray-600 leading-relaxed">
                You know what your time is worth. Set your own rates for tours and negotiate directly with guests.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-amber-100">
              <div className="w-14 h-14 bg-amber-200 text-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Total Flexibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Be your own boss. Manage your availability calendar, accept the tours you want, and take time off whenever.
              </p>
            </div>

            <div className="bg-violet-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-violet-100">
              <div className="w-14 h-14 bg-violet-200 text-violet-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                We verify all travelers and handle the platform infrastructure so you can focus on giving great tours safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription & Pricing */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-2 block">Simple Pricing</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 font-display">Grow your business with zero upfront risk</h2>
          <p className="text-lg text-gray-600 mb-12">
            We want you to succeed. Enjoy the platform completely free for the first 3 months. No hidden fees.
          </p>

          <div className="bg-white rounded-4xl p-10 shadow-2xl border border-gray-100 relative max-w-xl mx-auto text-left transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-8 bg-linear-to-r from-brand-primary to-sky-400 text-white text-sm font-bold px-4 py-1.5 rounded-b-xl shadow-md uppercase tracking-wide">
              Launch Offer
            </div>

            <div className="flex items-end gap-2 mb-4">
              <h3 className="text-3xl font-extrabold text-gray-900">Guide Pro</h3>
            </div>

            <div className="flex items-baseline mb-6 border-b border-gray-100 pb-8">
              <span className="text-5xl font-black text-brand-primary">₹0</span>
              <span className="text-gray-500 ml-2 font-medium">/ month</span>
              <span className="ml-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">First 3 Months Free</span>
            </div>

            <ul className="space-y-5 mb-10">
              <li className="flex items-start gap-4 text-gray-700">
                <CheckCircle className="text-brand-primary shrink-0 mt-0.5" size={24} />
                <span className="font-medium">Direct Messaging with Travelers</span>
              </li>
              <li className="flex items-start gap-4 text-gray-700">
                <CheckCircle className="text-brand-primary shrink-0 mt-0.5" size={24} />
                <span className="font-medium">Keep 100% of your earnings</span>
              </li>
              <li className="flex items-start gap-4 text-gray-700">
                <CheckCircle className="text-brand-primary shrink-0 mt-0.5" size={24} />
                <span className="font-medium">Premium profile verification badge</span>
              </li>
              <li className="flex items-start gap-4 text-gray-700">
                <XCircle className="text-gray-400 shrink-0 mt-0.5" size={24} />
                <span className="font-medium text-gray-500">Cancel your subscription at any time</span>
              </li>
            </ul>

            <div className="bg-sky-50 p-6 rounded-2xl flex items-center justify-between shadow-inner border border-sky-100">
              <div className="font-semibold text-gray-800">Ready to start?</div>
              <motion.div
                className="relative rounded-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ opacity: 0, scale: 1 }}
                  whileHover={{ opacity: 1, scale: 1.4 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    background: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(14,165,233,0.3) 50%, transparent 75%)',
                    filter: 'blur(12px)',
                  }}
                />
                <div className="relative bg-white rounded-full shadow-md overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="outline"
                    shape="pill"
                    size="medium"
                    text="continue_with"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-brand-dark py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Your City is Waiting to be Explored</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join hundreds of guides who are already making a living doing what they love.</p>
        <div className="flex justify-center flex-wrap gap-4">
          <motion.div
            className="relative rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.35 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(56,189,248,0.4) 50%, transparent 75%)',
                filter: 'blur(14px)',
              }}
            />
            <div className="relative bg-white p-1 rounded-full shadow-lg">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ContactModal({
  open,
  onClose,
  phone,
  address,
  setPhone,
  setAddress,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  phone: string;
  address: string;
  setPhone: (v: string) => void;
  setAddress: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <XCircle size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Add your contact info</h3>
        <p className="text-sm text-gray-600 mb-4">Required once for guide verification. We won't ask again after this.</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="e.g., +91 98765 43210"
              className="w-full rounded-xl border border-gray-200 bg-white text-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="City, State or full address"
              className="w-full rounded-xl border border-gray-200 bg-white text-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <p className="text-[12px] text-gray-500">Travellers will see this on your guide profile. You can edit it later in your profile settings.</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow hover:bg-brand-dark transition-colors disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save & continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
