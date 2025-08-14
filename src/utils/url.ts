/**
 * URL utility functions for consistent URL handling across the app
 */

/**
 * Get properly formatted base URL for the application
 * Handles various environment configurations
 */
export function getBaseUrl(): string {
  // Server-side rendering - check various environment variables
  if (typeof window === "undefined") {
    // Production environment
    if (process.env.NODE_ENV === "production") {
      // Check production URL from environment
      const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (envUrl && envUrl !== "undefined") {
        console.log("Using production NEXT_PUBLIC_BASE_URL:", envUrl);
        return formatUrl(envUrl);
      }

      // Vercel deployment
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }

      // Fallback to default production URL
      return "https://rekkoku.my.id";
    }

    // Development environment - always use localhost
    return "http://localhost:3000";
  }

  // Client-side - use window.location
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * Format URL to ensure proper protocol and remove trailing slash
 */
export function formatUrl(url: string): string {
  if (!url) return "";

  let formattedUrl = url.trim();

  // Add protocol if missing
  if (!formattedUrl.match(/^https?:\/\//)) {
    // For localhost, use http, otherwise https
    const protocol = formattedUrl.includes("localhost") ? "http" : "https";
    formattedUrl = `${protocol}://${formattedUrl}`;
  }

  // Remove trailing slash
  formattedUrl = formattedUrl.replace(/\/$/, "");

  return formattedUrl;
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return formatUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  // Development fallback
  return "http://localhost:3030";
}
