/**
 * Server-side API utilities
 * For use in generateMetadata, generateStaticParams, and other server-side functions
 */

import { Post, ApiResponse, City } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030";

/**
 * Server-side fetch utility
 */
async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(
        `Server fetch error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server fetch error:", error);
    return null;
  }
}

/**
 * Fetch post data by slug for metadata generation
 */
export async function getPostBySlugForMetadata(
  slug: string
): Promise<Post | null> {
  const response = await serverFetch<ApiResponse<Post>>(`/posts/slug/${slug}`);
  return response?.data || null;
}

export async function getCityByIdForMetadata(id: string): Promise<City | null> {
  const response = await serverFetch<ApiResponse<City>>(`/cities/${id}`);
  return response?.data || null;
}

/**
 * Fetch all published posts for sitemap generation
 * Uses pagination to get all posts in chunks to avoid memory issues
 */
export async function getAllPublishedPostsForSitemap(): Promise<Post[]> {
  const allPosts: Post[] = [];
  let page = 1;
  const limit = 100; // Fetch in chunks of 100
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await serverFetch<ApiResponse<Post[]>>(
        `/posts?page=${page}&limit=${limit}&status=PUBLISHED`
      );

      if (!response?.data || !Array.isArray(response.data)) {
        break;
      }

      const posts = response.data;
      allPosts.push(...posts);

      // If we got fewer posts than the limit, we've reached the end
      hasMore = posts.length === limit;
      page++;

      // Safety check to prevent infinite loops
      if (page > 100) {
        console.warn("Sitemap: Reached maximum page limit, stopping fetch");
        break;
      }
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching published posts for sitemap:", error);
    return [];
  }
}

/**
 * Generate SEO-friendly description from post data
 */
export function generatePostDescription(post: Post): string {
  const cityName = post.city.altName || post.city.name;
  const placeCount = post.postPlaces.length;
  const placeTitles = post.postPlaces
    .slice(0, 3) // Take first 3 places
    .map((pp) => pp.place.title)
    .join(", ");

  if (placeTitles) {
    return `Discover ${placeCount} amazing places in ${cityName} including ${placeTitles}${
      placeCount > 3 ? " and more" : ""
    }. Curated by ${post.user.name} (@${post.user.username}).`;
  }

  return `Explore ${placeCount} handpicked locations in ${cityName}. A curated travel guide by ${post.user.name} (@${post.user.username}).`;
}

/**
 * Generate keywords from post data
 */
export function generatePostKeywords(post: Post): string[] {
  const baseKeywords = [
    "travel guide",
    "rekomendasi tempat",
    "wisata",
    "kuliner",
    "tempat menarik",
  ];

  const cityKeywords = [
    post.city.name.toLowerCase(),
    post.city.altName.toLowerCase(),
    `wisata ${post.city.altName.toLowerCase()}`,
    `tempat menarik ${post.city.altName.toLowerCase()}`,
  ];

  const placeKeywords = post.postPlaces
    .slice(0, 5) // Take first 5 places
    .map((pp) => pp.place.title.toLowerCase());

  return [...baseKeywords, ...cityKeywords, ...placeKeywords];
}

/**
 * Get best image for Open Graph from post places
 */
export function getBestPostImage(post: Post): string {
  // Try to get the first place image
  const firstPlaceWithImage = post.postPlaces
    .sort((a, b) => a.order - b.order)
    .find((pp) => pp.place.image && pp.place.image.trim() !== "");

  if (firstPlaceWithImage?.place.image) {
    return firstPlaceWithImage.place.image;
  }

  // Fallback to default image
  return "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg";
}

/**
 * Generate JSON-LD structured data for SEO
 */
export function generatePostJsonLd(post: Post, baseUrl: string): object {
  const cityName = post.city.altName || post.city.name;
  const image = getBestPostImage(post);
  const description = generatePostDescription(post);

  return {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "@id": `${baseUrl}/detail/${post.slug}`,
    name: post.title,
    description: description,
    image: [image],
    url: `${baseUrl}/detail/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.user.name,
      url: `${baseUrl}/u/${post.user.username}`,
      identifier: `@${post.user.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Rekkoku",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`,
        width: 60,
        height: 60,
      },
    },
    about: {
      "@type": "Place",
      name: cityName,
      geo: {
        "@type": "GeoCoordinates",
        latitude: post.centerLat,
        longitude: post.centerLong,
      },
    },
    mentions: post.postPlaces.map((postPlace, index) => ({
      "@type": "TouristAttraction",
      name: postPlace.place.title,
      description: postPlace.place.description,
      image: postPlace.place.image,
      url: postPlace.place.gmapsLink,
      geo: {
        "@type": "GeoCoordinates",
        latitude: postPlace.place.lat,
        longitude: postPlace.place.long,
      },
      containedInPlace: {
        "@type": "City",
        name: cityName,
      },
      position: postPlace.order,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.5, // Could be calculated from likes/bookmarks
      ratingCount: post.likeCount + post.bookmarksCount,
      bestRating: 5,
      worstRating: 1,
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likeCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/BookmarkAction",
        userInteractionCount: post.bookmarksCount,
      },
    ],
  };
}
