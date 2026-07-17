import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
