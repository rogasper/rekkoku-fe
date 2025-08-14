// Base API Response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Place type
export interface Place {
  id: string;
  gmapsLink: string;
  description: string;
  title: string;
  image: string;
  long: number;
  lat: number;
  createdAt: string;
  updatedAt: string;
  reviewCount?: number;
  averageRating?: number;
}

// Post Place relationship type
export interface PostPlace {
  id: string;
  postId: string;
  placeId: string;
  order: number;
  place: Place;
}

// User type
export interface User {
  id: string;
  name: string;
  avatar: string;
  username?: string; // Added for user profile pages
}

// City type
export interface City {
  id: string;
  name: string;
  altName: string;
  provinceId: string;
  lat: number;
  long: number;
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
}

// Post status enums
export type PostStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type ProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// Full Post type
export interface Post {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  description: string;
  budget: number;
  averageRating: number;
  processingStatus: ProcessingStatus;
  userId: string;
  likeCount: number;
  bookmarksCount: number;
  reviewCount?: number;
  centerLat: number;
  centerLong: number;
  cityId: string;
  categoryId: string | undefined;
  createdAt: string;
  updatedAt: string;
  postPlaces: PostPlace[];
  user: User;
  city: City;
  category: Category | null | undefined;
  _count?: {
    postPlaces: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  distanceKm?: number;
}

// Specific API response types
export type PostDetailResponse = ApiResponse<Post>;
export type PostsListResponse = ApiResponse<{
  posts: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;

// For list/feed items (simplified version)
export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  likeCount: number;
  bookmarksCount: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  postPlaces: {
    place: {
      id: string;
      title: string;
      image: string;
    };
  }[];
}

export interface CategoryListItem {
  id: string;
  name: string;
  parentId: string;
}
