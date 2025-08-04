import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://rekkoku.my.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/detail/*",
          "/u/*",
          "/nearby/*",
          "/search/*",
          "/top-places/*",
        ],
        disallow: [
          "/edit/*",
          "/review/*",
          "/auth/*",
          "/unauthorized",
          "/settings",
          "/notifications",
          "/api/*",
          "/_next/*",
          "/favicon.ico",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
