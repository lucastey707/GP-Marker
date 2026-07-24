import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["400", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "GP Essay Marker",
  description: "AI-powered marking and feedback for Singapore A-Level GP essays.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable}`}>
      <body className="font-body bg-paper text-ink">{children}</body>
    </html>
  );
}
