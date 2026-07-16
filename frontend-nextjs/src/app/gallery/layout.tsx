import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: `Travel Gallery - Destination Photos | ${siteConfig.projectName}`,
  description: 'Explore stunning destination photos from travelers. Get inspired for your next adventure with beautiful captures from across India.',
  robots: 'noindex, follow',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: `Travel Gallery - Destination Photos | ${siteConfig.projectName}`,
    description: 'Explore stunning destination photos from travelers across India.',
    url: '/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}