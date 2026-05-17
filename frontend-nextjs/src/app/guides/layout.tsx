import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Local Travel Guides - Find Expert Guides | TripSathi',
  description: 'Connect with certified local travel guides across India. Get expert recommendations, insider tips, and personalized travel experiences.',
  keywords: ['local guide', 'travel guide', 'tour guide', 'India guide', 'local expert'],
  openGraph: {
    title: 'Local Travel Guides - Find Expert Guides | TripSathi',
    description: 'Connect with certified local travel guides across India.',
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}