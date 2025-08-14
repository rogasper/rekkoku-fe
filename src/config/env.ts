export const env = {
  // App URL for metadata and social media
  APP_URL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
      : "http://localhost:3000"),

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  // API URLs
  API_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",

  // Auth
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",

  // Analytics
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || "",
} as const;
