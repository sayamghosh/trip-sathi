import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ClientShell from "./client-shell";

export const metadata: Metadata = {
  title: "Trip Sathi",
  description: "Discover local guides and curated travel experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
