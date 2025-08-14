import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

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
  verification: {
    google: "-9hlbhD_BUIUbjcIj9CKnze9OybrHl47tvb6nRXANHc",
  },

  // Favicon and Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // PWA Manifest
  manifest: "/site.webmanifest",

  // Apple Touch Icon
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rekkoku",
  },

  openGraph: {
    title: "Rekkoku | Rekomendasi dari Aku",
    description:
      "Rekkoku is a platform to share your taste in food, places, and experiences.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rekkoku",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekkoku | Rekomendasi dari Aku",
    description:
      "Rekkoku is a platform to share your taste in food, places, and experiences.",
    images: ["/og.png"],
  },
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
    <html lang="id" translate="no" className="light">
      <head>
        <meta name="google" content="notranslate" />

        {/* Manual Favicon Links for Maximum Compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#EA7B26" />
        <meta name="msapplication-TileColor" content="#EA7B26" />
      </head>
      <GoogleTagManager gtmId="G-B6K7M8PEWL" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#EA7B26" showSpinner={false} zIndex={1000} />
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
        <GoogleAnalytics gaId="G-B6K7M8PEWL" />
      </body>
    </html>
  );
}
