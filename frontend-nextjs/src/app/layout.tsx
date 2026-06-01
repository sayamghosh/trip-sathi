import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientShell from "./client-shell";
import { siteConfig } from "../config/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tripsathi.vercel.app'),

  title: {
    default: `${siteConfig.projectName} - Discover Local Guides & Travel Experiences`,
    template: `%s | ${siteConfig.projectName}`,
  },
  description: `Find and book local travel guides, curated tour packages, and unique experiences across India. Discover destinations, compare prices, and plan your perfect trip with ${siteConfig.projectName}.`,
  keywords: ['travel', 'tour', 'guide', 'booking', 'India tourism', 'travel packages', 'local guide', 'holiday packages', 'trip planning'],
  authors: [{ name: siteConfig.projectName }],
  creator: siteConfig.projectName,
  publisher: siteConfig.projectName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tripsathi.vercel.app/',
    siteName: siteConfig.projectName,
    title: `${siteConfig.projectName} - Discover Local Guides & Travel Experiences`,
    description: 'Find and book local travel guides, curated tour packages, and unique experiences across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.projectName} - Travel with Local Guides`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.projectName} - Discover Local Guides & Travel Experiences`,
    description: 'Find and book local travel guides and curated tour packages across India.',
    creator: '@tripsathi',
    images: ['/og-image.jpg'],
  },

  alternates: {
    languages: {
      'en-IN': 'https://tripsathi.vercel.app/',
    },
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1458df',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.projectName,
  "url": "https://tripsathi.vercel.app",
  "description": "Travel platform connecting travelers with local guides and curated experiences across India.",
  "sameAs": [
    "https://www.facebook.com/tripsathi",
    "https://www.instagram.com/tripsathi",
    "https://twitter.com/tripsathi",
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "India"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600"
        >
          Skip to main content
        </a>
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
