import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";
import { env } from "@/config/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Rekkoku | Rekomendasi dari Aku - Travel Guide Indonesia",
  description:
    "Temukan dan bagikan rekomendasi tempat wisata, kuliner, dan destinasi terbaik di Indonesia. Platform travel guide berbasis komunitas untuk mengeksplorasi keindahan Nusantara.",
  keywords: [
    "travel guide Indonesia",
    "rekomendasi tempat wisata",
    "rekomendasi makanan murah",
    "kuliner Indonesia",
    "destinasi wisata",
    "tempat menarik Indonesia",
    "travel blog",
    "wisata lokal",
    "kuliner nusantara",
    "jalan-jalan Indonesia",
  ].join(", "),
  authors: [{ name: "Rekkoku Team" }],
  creator: "Rekkoku",
  publisher: "Rekkoku",
  robots: "index,follow",

  // Open Graph
  openGraph: {
    type: "website",
    title: "Rekkoku | Rekomendasi dari Aku - Travel Guide Indonesia",
    description:
      "Temukan dan bagikan rekomendasi tempat wisata, kuliner, dan destinasi terbaik di Indonesia.",
    url: "/",
    siteName: "Rekkoku",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Rekkoku - Travel Guide Indonesia",
      },
    ],
    locale: "id_ID",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Rekkoku | Rekomendasi dari Aku",
    description:
      "Platform travel guide Indonesia untuk berbagi rekomendasi tempat wisata dan kuliner terbaik.",
    images: ["/android-chrome-512x512.png"],
    site: "@rekkoku",
  },

  // Additional metadata
  alternates: {
    canonical: "/",
  },

  // Application metadata
  other: {
    "theme-color": "#f97316",
    "application-name": "Rekkoku",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Rekkoku",
    "mobile-web-app-capable": "yes",
  },
};

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  // You can add session handling here
  // For example:
  // const session = await verifySession();
  // if (!session) {
  //   redirect('/login');
  // }

  const params = await searchParams;
  const { page = "1", limit = "10" } = params;

  // Validate and sanitize parameters
  const initialPage = Math.max(1, parseInt(page as string) || 1);
  const initialLimit = Math.min(
    10,
    Math.max(1, parseInt(limit as string) || 10)
  );

  // Extract other possible search parameters for posts filtering
  const filters = {
    cityId: params.cityId as string,
    search: params.search as string,
    status: params.status as string,
  };

  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  return (
    <HomeContent
      initialPage={initialPage}
      initialLimit={initialLimit}
      initialFilters={cleanFilters}
      initialSearchParams={params}
    />
  );
}
