import ExploreContent from "@/components/ExploreContent";
import React from "react";
import type { Metadata } from "next";
import { getCityByIdForMetadata } from "@/lib/server-api";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    cityId?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  const cityId = params.cityId;

  // Dynamic title based on search query
  const title = query
    ? `Pencarian "${query}" | Rekkoku`
    : "Jelajahi Tempat Menarik | Rekkoku";

  const description = query
    ? `Temukan tempat wisata, kuliner, dan destinasi menarik terkait "${query}" di Indonesia. Jelajahi rekomendasi dari komunitas Rekkoku.`
    : "Jelajahi dan temukan tempat wisata, kuliner, dan destinasi menarik di seluruh Indonesia. Cari berdasarkan nama tempat, kota, atau kategori.";

  const keywords = [
    "pencarian tempat wisata",
    "jelajahi Indonesia",
    "cari destinasi wisata",
    "temukan kuliner",
    query && `${query} Indonesia`,
    "search travel guide",
    "explore Indonesia",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    robots: "index,follow",

    // Open Graph
    openGraph: {
      type: "website",
      title,
      description,
      url: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
      siteName: "Rekkoku",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "Rekkoku - Search Travel Guide",
        },
      ],
      locale: "id_ID",
    },

    // Twitter Card
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/android-chrome-512x512.png"],
      site: "@rekkoku",
    },

    // Additional metadata
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const city = await getCityByIdForMetadata(params.cityId || "");

  return (
    <ExploreContent
      searchQuery={params.q}
      cityId={params.cityId}
      initialCity={city}
    />
  );
};

export default SearchPage;
