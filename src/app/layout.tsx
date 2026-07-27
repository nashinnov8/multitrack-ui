import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { I18nProvider } from "@/components/I18nProvider";
import { ContinuousTourProvider } from "@/components/ContinuousTourProvider";
import { Navbar } from "@/components/Navbar";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multitrack — Track Your Goals, Build Streaks",
  description: "Track multiple learning goals and skill journeys in parallel. Get daily check-ins, streak alerts, and knowledge gap reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <ContinuousTourProvider>
            <Providers>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <BadgeUnlockModal />
            </Providers>
          </ContinuousTourProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
