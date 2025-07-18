import AnalyticsHome from "@/components/AnalyticsHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tempat Terpopuler | Rekkoku",
  description:
    "Temukan tempat-tempat wisata dan kuliner terpopuler di Indonesia berdasarkan rekomendasi komunitas. Lihat statistik top destinasi, kota populer, dan kreator terbaik.",
  keywords: [
    "tempat populer Indonesia",
    "wisata terpopuler",
    "kuliner terpopuler",
    "destinasi trending",
    "top places Indonesia",
    "analytics wisata",
    "statistik travel",
    "ranking tempat wisata",
    "trending destinations",
  ].join(", "),
  authors: [{ name: "Rekkoku Team" }],
  creator: "Rekkoku",
  publisher: "Rekkoku",
  robots: "index,follow",

  // Open Graph
  openGraph: {
    type: "website",
    title: "Tempat Terpopuler di Indonesia | Rekkoku",
    description:
      "Jelajahi tempat-tempat wisata dan kuliner terpopuler berdasarkan rekomendasi komunitas travel Indonesia.",
    url: "/top-places",
    siteName: "Rekkoku",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Rekkoku - Top Places Indonesia",
      },
    ],
    locale: "id_ID",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tempat Terpopuler di Indonesia | Rekkoku",
    description:
      "Temukan destinasi wisata dan kuliner trending di Indonesia berdasarkan rekomendasi komunitas.",
    images: ["/android-chrome-512x512.png"],
    site: "@rekkoku",
  },

  // Additional metadata
  alternates: {
    canonical: "/top-places",
  },

  // Page-specific metadata
  other: {
    "page-type": "analytics",
    "content-category": "travel-statistics",
  },
};

const TopPlaces = () => {
  return <AnalyticsHome />;
};

export default TopPlaces;
