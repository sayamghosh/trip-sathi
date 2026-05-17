import type { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: `Become a Guide - Join ${siteConfig.projectName} | ${siteConfig.projectName}`,
  description: `Join ${siteConfig.projectName} as a local guide. Share your expertise, grow your travel business, and connect with travelers seeking authentic experiences.`,
  keywords: ['become a guide', 'join as guide', 'travel guide business', 'local guide partner'],
  openGraph: {
    title: `Become a Guide - Join ${siteConfig.projectName}`,
    description: `Share your expertise and grow your travel business with ${siteConfig.projectName}.`,
  },
};

export default function BecomeAGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}