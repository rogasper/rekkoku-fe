import DetailContent from "@/components/DetailContent";
import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import {
  getPostBySlugForMetadata,
  generatePostDescription,
  generatePostKeywords,
  getBestPostImage,
  generatePostJsonLd,
} from "@/lib/server-api";
import { capitalizeWords } from "@/utils/strings";
import { verifySession } from "@/lib/auth";
import { getBaseUrl } from "@/utils/url";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch post data for metadata
  const post = await getPostBySlugForMetadata(slug);

  // Fallback metadata if post not found
  if (!post) {
    return {
      title: "Post Not Found | Rekkoku",
      description: "The requested post could not be found.",
      robots: "noindex,nofollow",
    };
  }

  // Don't index draft posts
  if (post.status !== "PUBLISHED") {
    return {
      title: `${post.title} | Rekkoku`,
      description: "This post is not yet published.",
      robots: "noindex,nofollow",
    };
  }

  const title = `${post.title} | Rekkoku`;
  const description = generatePostDescription(post);
  const keywords = generatePostKeywords(post);
  const image = getBestPostImage(post);
  const cityName = capitalizeWords(post.city.altName || post.city.name);
  const authorName = post.user.name;
  const authorUsername = post.user.username;
  const publishedTime = new Date(post.createdAt).toISOString();
  const modifiedTime = new Date(post.updatedAt).toISOString();

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/detail/${slug}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: authorName, url: `/u/${authorUsername}` }],
    creator: authorName,
    publisher: "Rekkoku",
    robots: "index,follow",

    // Open Graph
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Rekkoku",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${post.title} - Travel guide for ${cityName}`,
        },
        {
          url: image,
          width: 1200,
          height: 800,
          alt: `${post.title} - Travel guide for ${cityName}`,
        },
      ],
      locale: "id_ID",
      publishedTime,
      modifiedTime,
      authors: [`${authorName} (@${authorUsername})`],
      section: "Travel",
      tags: keywords,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: `@${authorUsername}`,
      site: "@rekkoku",
    },

    // Additional metadata
    alternates: {
      canonical: url,
    },

    // Article-specific metadata
    other: {
      "article:author": authorName,
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:section": "Travel",
      "article:tag": keywords.join(","),
      "geo.region": cityName,
      "geo.position": `${post.centerLat};${post.centerLong}`,
      ICBM: `${post.centerLat}, ${post.centerLong}`,
      "place:location:latitude": post.centerLat.toString(),
      "place:location:longitude": post.centerLong.toString(),
      // SEO enhancements
      "og:see_also": post.postPlaces.map((pp) => pp.place.gmapsLink).join(","),
      "theme-color": "#f97316",
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
    },
  };
}

const DetailPage = async ({ params }: DetailPageProps) => {
  const { user } = await verifySession();
  const { slug } = await params;

  // Fetch post data for JSON-LD
  const post = await getPostBySlugForMetadata(slug);

  // Generate JSON-LD if post exists and is published
  let jsonLd = null;
  if (post && post.status === "PUBLISHED") {
    const jsonLdBaseUrl = getBaseUrl();
    jsonLd = generatePostJsonLd(post, jsonLdBaseUrl);
  }

  console.log("server post", post);

  const isOwner = user?.userId === post?.userId;

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <Script
          id={`jsonld-post-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      <div className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
        <main className="mx-auto pb-24">
          <DetailContent slug={slug} isOwner={isOwner} />
        </main>
      </div>
    </>
  );
};

export default DetailPage;
