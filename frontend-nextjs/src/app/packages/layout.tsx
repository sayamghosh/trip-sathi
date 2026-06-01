import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: `Tour Packages - Best Travel Deals | ${siteConfig.projectName}`,
  description: 'Browse our curated collection of tour packages. Find the best deals on family trips, adventure tours, honeymoon packages, and more across India.',
  keywords: ['tour packages', 'travel deals', 'holiday packages', 'family tour', 'honeymoon packages', 'adventure tour'],
  openGraph: {
    title: `Tour Packages - Best Travel Deals | ${siteConfig.projectName}`,
    description: 'Explore 120+ destinations with curated tour packages.',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}