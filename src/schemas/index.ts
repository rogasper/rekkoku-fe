import { z } from "zod";

// Enums
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// ===== USERS SCHEMAS =====
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid user ID format"),
  }),
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid user ID format"),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid user ID format"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    search: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
  }),
});

// ===== USERNAME SCHEMAS =====
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be less than 20 characters long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .refine((val) => {
    const reservedUsernames = [
      "admin",
      "administrator",
      "root",
      "api",
      "www",
      "mail",
      "support",
      "help",
      "info",
      "contact",
      "about",
      "terms",
      "privacy",
      "blog",
      "news",
      "test",
      "demo",
      "example",
      "user",
      "guest",
      "null",
      "undefined",
    ];
    return !reservedUsernames.includes(val.toLowerCase());
  }, "This username is reserved and cannot be used");

export const updateUsernameSchema = z.object({
  body: z.object({
    username: usernameSchema,
  }),
});

export const checkUsernameSchema = z.object({
  params: z.object({
    username: usernameSchema,
  }),
});

export const usernameSuggestionsSchema = z.object({
  query: z.object({
    name: z.string().optional(),
  }),
});

// ===== AUTH SCHEMAS =====
export const googleCallbackSchema = z.object({
  query: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
    state: z.string().optional(),
  }),
});

// ===== POSTS SCHEMAS =====
const postBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(1, "Content is required"),
  cityId: z.string().min(1, "City ID is required"),
  mapPlaceUrls: z
    .array(z.string().url("Invalid URL format"))
    .optional()
    .default([]),
});

const postParamsSchema = z.object({
  id: z.string().cuid("Invalid post ID"),
});

const postSlugParamsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

const postQuerySchema = z.object({
  status: z.nativeEnum(PostStatus).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  cityId: z.string().min(1).optional(),
});

const nearbyPostsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90, "Invalid latitude"),
  long: z.coerce.number().min(-180).max(180, "Invalid longitude"),
  radius: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.nativeEnum(PostStatus).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const statusUpdateBodySchema = z.object({
  status: z.nativeEnum(PostStatus),
});

export const createPostSchema = z.object({
  body: postBodySchema,
});

export const updatePostSchema = z.object({
  body: postBodySchema.partial(),
  params: postParamsSchema,
});

export const getPostSchema = z.object({
  params: postParamsSchema,
});

export const getPostBySlugSchema = z.object({
  params: postSlugParamsSchema,
});

export const likePostSchema = z.object({
  params: postParamsSchema,
});

export const bookmarkPostSchema = z.object({
  params: postParamsSchema,
});

export const deletePostSchema = z.object({
  params: postParamsSchema,
});

export const getPostsSchema = z.object({
  query: postQuerySchema,
});

export const getNearbyPostsSchema = z.object({
  query: nearbyPostsQuerySchema,
});

export const updatePostStatusSchema = z.object({
  body: statusUpdateBodySchema,
  params: postParamsSchema,
});

export const getMyPostsSchema = z.object({
  query: postQuerySchema,
});

// ===== CITIES SCHEMAS =====
export const createCitySchema = z.object({
  body: z.object({
    name: z.string().min(1, "City name is required"),
    provinceId: z.string().min(1, "Province ID is required"),
    lat: z.number(),
    long: z.number(),
    altName: z.string().optional(),
  }),
});

export const updateCitySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    provinceId: z.string().min(1).optional(),
    lat: z.number().optional(),
    long: z.number().optional(),
    altName: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "City ID is required"),
  }),
});

export const getCityByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "City ID is required"),
  }),
});

export const getCitiesByProvinceSchema = z.object({
  params: z.object({
    provinceId: z.string().min(1, "Province ID is required"),
  }),
});

export const searchCitiesSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search query is required"),
  }),
});

export const getNearbyCitiesSchema = z.object({
  query: z.object({
    lat: z.coerce.number(),
    long: z.coerce.number(),
    radius: z.coerce.number().optional(),
  }),
});

// ===== USER DETAILS SCHEMAS =====
const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "tiktok", "website"], {
    errorMap: () => ({
      message: "Platform must be instagram, tiktok, or website",
    }),
  }),
  url: z.string().url("Invalid URL format"),
  username: z.string().optional(),
});

export const createUserDetailSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  socialLinks: z
    .array(socialLinkSchema)
    .max(3, "Maximum 3 social links allowed")
    .optional(),
});

export const updateUserDetailSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  socialLinks: z
    .array(socialLinkSchema)
    .max(3, "Maximum 3 social links allowed")
    .optional(),
});

// ===== PLACES SCHEMAS =====
export const createPlaceSchema = z.object({
  gmapsLink: z
    .string()
    .url()
    .regex(
      /(https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\/[^\s]+)/,
      "Must be a valid Google Maps URL"
    ),
  title: z.string().max(200, "Title too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
  long: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
});

export const updatePlaceSchema = z.object({
  gmapsLink: z
    .string()
    .url()
    .regex(
      /(https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\/[^\s]+)/,
      "Must be a valid Google Maps URL"
    )
    .optional(),
  title: z.string().max(200, "Title too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
  long: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
  lat: z
    .number()
    .min(-90)
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
});

export const nearbyPlaceQuerySchema = z.object({
  lat: z.string().transform(Number),
  long: z.string().transform(Number),
  radiusKm: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const placeParamsSchema = z.object({
  id: z.string().cuid("Invalid place ID"),
});

// Type exports
export type UpdateUsernameRequest = z.infer<typeof updateUsernameSchema>;
export type CheckUsernameRequest = z.infer<typeof checkUsernameSchema>;
export type UsernameSuggestionsRequest = z.infer<
  typeof usernameSuggestionsSchema
>;
