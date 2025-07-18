import NearbyContent from "@/components/NearbyContent";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tempat Terdekat | Rekkoku",
  description:
    "Temukan tempat wisata dan kuliner terdekat dari lokasi Anda. Jelajahi rekomendasi destinasi menarik di sekitar Anda berdasarkan komunitas travel Indonesia.",
  keywords: [
    "tempat terdekat",
    "wisata sekitar",
    "kuliner dekat saya",
    "nearby places",
    "lokasi terdekat",
    "destinasi sekitar",
    "travel guide lokal",
    "tempat menarik terdekat",
    "location based travel",
  ].join(", "),
  authors: [{ name: "Rekkoku Team" }],
  creator: "Rekkoku",
  publisher: "Rekkoku",
  robots: "index,follow",

  // Open Graph
  openGraph: {
    type: "website",
    title: "Tempat Terdekat dari Lokasi Anda | Rekkoku",
    description:
      "Jelajahi tempat wisata dan kuliner menarik di sekitar lokasi Anda. Temukan destinasi tersembunyi berdasarkan rekomendasi komunitas.",
    url: "/nearby",
    siteName: "Rekkoku",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Rekkoku - Nearby Places",
      },
    ],
    locale: "id_ID",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tempat Terdekat | Rekkoku",
    description:
      "Temukan wisata dan kuliner menarik di sekitar lokasi Anda dengan panduan komunitas travel Indonesia.",
    images: ["/android-chrome-512x512.png"],
    site: "@rekkoku",
  },

  // Additional metadata
  alternates: {
    canonical: "/nearby",
  },

  // Page-specific metadata
  other: {
    "page-type": "location-based",
    "content-category": "nearby-travel-guide",
    "geo-enabled": "true",
  },
};

interface NearbyProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Nearby = async ({ searchParams }: NearbyProps) => {
  const params = await searchParams;
  const { page = "1", limit = "10" } = params;

  const initialPage = Math.max(1, parseInt(page as string) || 1);
  const initialLimit = Math.min(
    10,
    Math.max(1, parseInt(limit as string) || 10)
  );

  const filters = {
    cityId: params.cityId as string,
    search: params.search as string,
    longitude: params.longitude as string,
    latitude: params.latitude as string,
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  return (
    <NearbyContent
      initialPage={initialPage}
      initialLimit={initialLimit}
      initialFilters={cleanFilters}
      initialSearchParams={params}
    />
  );
};

export default Nearby;
