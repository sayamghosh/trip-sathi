import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Become a Guide - Join TripSathi | TripSathi',
  description: 'Join TripSathi as a local guide. Share your expertise, grow your travel business, and connect with travelers seeking authentic experiences.',
  keywords: ['become a guide', 'join as guide', 'travel guide business', 'local guide partner'],
  openGraph: {
    title: 'Become a Guide - Join TripSathi',
    description: 'Share your expertise and grow your travel business with TripSathi.',
  },
};

export default function BecomeAGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}