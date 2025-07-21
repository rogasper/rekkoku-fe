import type { MetadataRoute } from "next";
import { getAllPublishedPostsForSitemap } from "@/lib/server-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://rekkoku.my.id";

  // Static routes with different priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/top-places`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nearby`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic routes for published posts
  try {
    const publishedPosts = await getAllPublishedPostsForSitemap();

    const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
      url: `${baseUrl}/detail/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    console.log(
      `✅ Sitemap generated with ${staticRoutes.length} static routes and ${postRoutes.length} post routes`
    );

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error("❌ Error fetching posts for sitemap:", error);
    console.log("📄 Generating sitemap with static routes only");
    return staticRoutes;
  }
}
