"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitContactMessage } from '../services/contact.service';

export function ContactUsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(user?.email || '');
      setMessage('');
      setError(null);
      setSubmitted(false);
    }
  }, [open, user]);

  if (!open || typeof document === 'undefined') return null;

  const handleSubmit = async () => {
    if (!email.trim() || !message.trim()) {
      setError('Please fill in both your email and your issue.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitContactMessage({ email: email.trim(), message: message.trim() });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    // Rendered via a portal into document.body - this modal is triggered
    // from places like the Footer, which sets a white ambient text color
    // for its own content. Without a portal, this modal would stay nested
    // in that DOM subtree and silently inherit the wrong text color via
    // CSS inheritance, regardless of any color classes set here.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 text-gray-900">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <p className="text-lg font-bold text-gray-900 mb-2">Thanks for reaching out!</p>
            <p className="text-sm text-gray-500">We&apos;ve received your message and our team will look into it.</p>
            <button
              onClick={onClose}
              className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow hover:bg-brand-dark transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg font-bold text-gray-900 mb-1">Contact Us</p>
            <p className="text-sm text-gray-500 mb-4">Tell us what&apos;s going on and we&apos;ll take a look.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">What&apos;s the issue?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  placeholder="Describe what you're facing..."
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow hover:bg-brand-dark transition-colors disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export function ContactUsTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Contact Us
      </button>
      <ContactUsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default ContactUsModal;
