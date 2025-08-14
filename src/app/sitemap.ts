import type { MetadataRoute } from "next";
import { getAllPublishedPostsForSitemap } from "@/lib/server-api";
import { getBaseUrl } from "@/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static routes with different priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
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
    console.log("🔄 Fetching published posts for sitemap...");
    const publishedPosts = await getAllPublishedPostsForSitemap();
    console.log(`📊 Fetched ${publishedPosts.length} posts for sitemap`);

    const postRoutes: MetadataRoute.Sitemap = publishedPosts
      .filter((post) => {
        const isValid =
          post.status === "PUBLISHED" && post.slug && post.slug.trim() !== "";
        if (!isValid) {
          console.warn(
            `⚠️ Filtered out invalid post: ${post.id} - status: ${post.status}, slug: ${post.slug}`
          );
        }
        return isValid;
      })
      .map((post) => ({
        url: `${baseUrl}/detail/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    console.log(
      `✅ Sitemap generated with ${staticRoutes.length} static routes and ${postRoutes.length} post routes`
    );

    // Validate URLs before returning
    const allRoutes = [...staticRoutes, ...postRoutes];
    const validRoutes = allRoutes.filter((route) => {
      try {
        new URL(route.url);
        console.log(`✅ Valid URL: ${route.url}`);
        return true;
      } catch (error) {
        console.warn(`❌ Invalid URL in sitemap: ${route.url}`, error);
        return false;
      }
    });

    console.log(`🎯 Final sitemap has ${validRoutes.length} valid URLs`);
    return validRoutes;
  } catch (error) {
    console.error("❌ Error fetching posts for sitemap:", error);
    console.log("📄 Generating sitemap with static routes only");

    // Validate static routes before returning
    const validStaticRoutes = staticRoutes.filter((route) => {
      try {
        new URL(route.url);
        return true;
      } catch {
        console.warn(`❌ Invalid static URL: ${route.url}`);
        return false;
      }
    });

    return validStaticRoutes;
  }
}
