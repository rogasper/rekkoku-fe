import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/utils/url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/detail/*",
          "/u/*",
          "/nearby",
          "/search",
          "/top-places",
          "/about",
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
          "/*.json",
          "/loading",
          "/error",
        ],
      },
      // Specific rules for search engines
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/detail/*",
          "/u/*",
          "/nearby",
          "/search",
          "/top-places",
          "/about",
        ],
        disallow: ["/edit/*", "/review/*", "/auth/*", "/api/*", "/_next/*"],
      },
      // Allow social media crawlers for detail pages
      {
        userAgent: ["facebookexternalhit", "twitterbot"],
        allow: ["/", "/detail/*", "/u/*"],
        disallow: ["/api/*", "/_next/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
