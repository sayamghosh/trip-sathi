import { X } from 'lucide-react';
import type { TourPlanGuide } from '../../types/tourPlan';

type GuidePlanSummary = {
  title: string;
  guideId?: TourPlanGuide | null;
};

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  plan: GuidePlanSummary;
  userPhone: string;
  setUserPhone: (value: string) => void;
  userName: string;
  setUserName: (value: string) => void;
  error: string | null;
  onSubmit: () => void;
  submitting: boolean;
}

export function ContactModal({
  open,
  onClose,
  plan,
  userPhone,
  setUserPhone,
  userName,
  setUserName,
  error,
  onSubmit,
  submitting,
}: ContactModalProps) {
  if (!open) return null;

  const guide = plan.guideId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {guide?.profileImage ? (
            <img src={guide.profileImage} alt={guide.name} className="w-12 h-12 rounded-full object-cover border" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center border">
              {guide?.name?.[0]?.toUpperCase() ?? 'G'}
            </div>
          )}
          <div>
            <p className="text-xs uppercase text-gray-500">Call the guide</p>
            <p className="text-lg font-bold text-gray-900">{guide?.name ?? 'Guide'}</p>
            {guide?.address && <p className="text-xs text-gray-500">{guide.address}</p>}
            {guide?.phone && <p className="text-xs text-gray-500">Phone: {guide.phone}</p>}
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4 text-sm text-gray-700">
          <p className="font-semibold text-brand-primary">Direct contact</p>
          {guide?.phone ? (
            <p className="mt-1">Phone: <span className="font-bold">{guide.phone}</span></p>
          ) : (
            <p className="mt-1 text-gray-500">Guide has not added a phone number yet.</p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Your name (optional)</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Your phone number (for callback)</label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g., +91 98765 43210"
            />
          </div>
          <p className="text-[12px] text-gray-500">We share this with the guide so they can call you back about this package.</p>
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
            onClick={onSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow hover:bg-brand-dark transition-colors disabled:opacity-70"
          >
            {submitting ? 'Sending...' : 'Request callback'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
