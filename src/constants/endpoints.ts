// API Endpoints based on cursorrules

// Users endpoints
export const USERS_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  GET_ALL: "/users/",
  GET_BY_ID: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
} as const;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  GOOGLE: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",
  PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",
} as const;

// Username endpoints
export const USERNAME_ENDPOINTS = {
  CHECK: (username: string) => `/usernames/check/${username}`,
  SUGGESTIONS: "/usernames/suggestions",
  STATUS: "/usernames/status",
  UPDATE: "/usernames/",
} as const;

// Posts endpoints
export const POSTS_ENDPOINTS = {
  GET_ALL: "/posts",
  GET_NEARBY: "/posts/nearby",
  GET_BY_SLUG: (slug: string) => `/posts/slug/${slug}`,
  GET_BY_ID: (id: string) => `/posts/${id}`,
  GET_PROGRESS: (id: string) => `/posts/${id}/processing-status`,
  CREATE: "/posts/",
  GET_MY_POSTS: "/posts/my-posts",
  LIKE: (id: string) => `/posts/${id}/like`,
  BOOKMARK: (id: string) => `/posts/${id}/bookmark`,
  UPDATE: (id: string) => `/posts/${id}`,
  UPDATE_STATUS: (id: string) => `/posts/${id}/status`,
  DELETE: (id: string) => `/posts/${id}`,
} as const;

// Cities endpoints
export const CITIES_ENDPOINTS = {
  GET_ALL: "/cities",
  SEARCH: "/cities/search",
  GET_NEARBY: "/cities/nearby",
  GET_POPULAR: "/cities/popular",
  GET_MOST_POSTS: "/cities/most-posts",
  GET_PROVINCES: "/cities/provinces",
  GET_BY_PROVINCE: (provinceId: string) => `/cities/province/${provinceId}`,
  GET_BY_ID: (id: string) => `/cities/${id}`,
  CREATE: "/cities/",
  UPDATE: (id: string) => `/cities/${id}`,
  DELETE: (id: string) => `/cities/${id}`,
} as const;

// User Details endpoints
export const USER_DETAILS_ENDPOINTS = {
  GET_ALL: "/user-details/all",
  GET_BY_USER_ID: (userId: string) => `/user-details/user/${userId}`,
  CREATE_ME: "/user-details/me",
  GET_ME: "/user-details/me",
  UPDATE_ME: "/user-details/me",
  DELETE_ME: "/user-details/me",
} as const;

// Places endpoints
export const PLACES_ENDPOINTS = {
  GET_ALL: "/places/",
  SEARCH: "/places/search",
  GET_NEARBY: "/places/nearby",
  GET_BY_ID: (id: string) => `/places/${id}`,
  CREATE: "/places/",
  UPDATE: (id: string) => `/places/${id}`,
  DELETE: (id: string) => `/places/${id}`,
} as const;

// All endpoints combined
export const API_ENDPOINTS = {
  USERS: USERS_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  USERNAME: USERNAME_ENDPOINTS,
  POSTS: POSTS_ENDPOINTS,
  CITIES: CITIES_ENDPOINTS,
  USER_DETAILS: USER_DETAILS_ENDPOINTS,
  PLACES: PLACES_ENDPOINTS,
} as const;
