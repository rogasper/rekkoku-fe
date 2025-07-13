import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Rekkoku | Rekomendasi dari Aku",
  description:
    "Rekkoku is a platform to share your taste in food, places, and experiences.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const { isAuthenticated, user } = await verifySession();

  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers
          initialSession={isAuthenticated ? user : null}
          initialToken={sessionCookie || null}
        >
          {children}
        </Providers>

        <Script
          defer
          src="https://umami-analytic.rogasper.com/script.js"
          data-website-id="1b463dcf-3329-4d19-9586-704a1b84d0e2"
        ></Script>
      </body>
    </html>
  );
}
