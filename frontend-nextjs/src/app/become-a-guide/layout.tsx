import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import { siteConfig } from "../../config/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-guide-space-grotesk",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-guide-instrument-serif",
});

export const metadata: Metadata = {
  title: `Become a Guide - Join ${siteConfig.projectName} | ${siteConfig.projectName}`,
  description: `Join ${siteConfig.projectName} as a local guide. Share your expertise, grow your travel business, and connect with travelers seeking authentic experiences.`,
  keywords: ['become a guide', 'join as guide', 'travel guide business', 'local guide partner'],
  alternates: { canonical: '/become-a-guide' },
  openGraph: {
    title: `Become a Guide - Join ${siteConfig.projectName}`,
    description: `Share your expertise and grow your travel business with ${siteConfig.projectName}.`,
    url: '/become-a-guide',
  },
};

export default function BecomeAGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${spaceGrotesk.variable} ${instrumentSerif.variable}`}>
      {children}
    </div>
  );
}
