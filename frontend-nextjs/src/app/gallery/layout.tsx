import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Travel Gallery - Destination Photos | TripSathi',
  description: 'Explore stunning destination photos from travelers. Get inspired for your next adventure with beautiful captures from across India.',
  robots: 'noindex, follow',
  openGraph: {
    title: 'Travel Gallery - Destination Photos | TripSathi',
    description: 'Explore stunning destination photos from travelers across India.',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}