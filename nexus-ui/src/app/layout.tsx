import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus | The Unified AI Context Layer for Slack",
  description: "Whether it's your first agent or your fiftieth - Slack is where it ships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="min-h-screen bg-grid text-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014] -z-10 pointer-events-none" />
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
