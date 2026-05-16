import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tour Packages - Best Travel Deals | TripSathi',
  description: 'Browse our curated collection of tour packages. Find the best deals on family trips, adventure tours, honeymoon packages, and more across India.',
  keywords: ['tour packages', 'travel deals', 'holiday packages', 'family tour', 'honeymoon packages', 'adventure tour'],
  openGraph: {
    title: 'Tour Packages - Best Travel Deals | TripSathi',
    description: 'Explore 120+ destinations with curated tour packages.',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}