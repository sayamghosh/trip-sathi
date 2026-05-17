import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: `Search Tour Packages - Find Your Perfect Trip | ${siteConfig.projectName}`,
  description: 'Search and compare tour packages across India. Find the best deals on family trips, adventure tours, and honeymoon packages from local guides.',
  keywords: ['search tour packages', 'find travel', 'trip search', 'compare tours'],
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}