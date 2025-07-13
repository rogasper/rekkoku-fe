// Query keys factory for TanStack Query (client-side only)
export const queryKeys = {
  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    byUsername: (username: string) =>
      [...queryKeys.users.all, "username", username] as const,
    stats: (userId: string) =>
      [...queryKeys.users.all, "stats", userId] as const,
  },

  // Auth
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },

  // Username
  username: {
    all: ["username"] as const,
    check: (username: string) =>
      [...queryKeys.username.all, "check", username] as const,
    suggestions: (name?: string) =>
      [...queryKeys.username.all, "suggestions", { name }] as const,
    status: () => [...queryKeys.username.all, "status"] as const,
  },

  // Posts
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    nearby: (params: Record<string, any>) =>
      [...queryKeys.posts.all, "nearby", params] as const,
    myPosts: (filters: Record<string, any>) =>
      [...queryKeys.posts.all, "my-posts", { filters }] as const,
    myDraftPosts: (filters: Record<string, any>) =>
      [...queryKeys.posts.all, "my-draft-posts", { filters }] as const,
    bySlug: (slug: string) => [...queryKeys.posts.all, "slug", slug] as const,
    progress: (id: string) => [...queryKeys.posts.all, "progress", id] as const,
    userLiked: (userId: string, filters: Record<string, any>) =>
      [...queryKeys.posts.all, "user-liked", userId, { filters }] as const,
    userBookmarked: (userId: string, filters: Record<string, any>) =>
      [...queryKeys.posts.all, "user-bookmarked", userId, { filters }] as const,
    userPosts: (userId: string, filters: Record<string, any>) =>
      [...queryKeys.posts.all, "user-posts", userId, { filters }] as const,
  },

  // Cities
  cities: {
    all: ["cities"] as const,
    lists: () => [...queryKeys.cities.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.cities.lists(), { filters }] as const,
    details: () => [...queryKeys.cities.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.cities.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.cities.all, "search", query] as const,
    nearby: (params: Record<string, any>) =>
      [...queryKeys.cities.all, "nearby", params] as const,
    popular: () => [...queryKeys.cities.all, "popular"] as const,
    mostPosts: () => [...queryKeys.cities.all, "most-posts"] as const,
    provinces: () => [...queryKeys.cities.all, "provinces"] as const,
    byProvince: (provinceId: string) =>
      [...queryKeys.cities.all, "province", provinceId] as const,
  },

  // User Details
  userDetails: {
    all: ["user-details"] as const,
    lists: () => [...queryKeys.userDetails.all, "list"] as const,
    me: () => [...queryKeys.userDetails.all, "me"] as const,
    byUserId: (userId: string) =>
      [...queryKeys.userDetails.all, "user", userId] as const,
  },

  // Places
  places: {
    all: ["places"] as const,
    lists: () => [...queryKeys.places.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.places.lists(), { filters }] as const,
    details: () => [...queryKeys.places.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.places.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.places.all, "search", query] as const,
    nearby: (params: Record<string, any>) =>
      [...queryKeys.places.all, "nearby", params] as const,
  },

  // Analytics
  analytics: {
    all: ["analytics"] as const,
    topUsers: (limit?: number) =>
      [...queryKeys.analytics.all, "top-users", { limit }] as const,
    topPosts: (limit?: number) =>
      [...queryKeys.analytics.all, "top-posts", { limit }] as const,
    topCities: (limit?: number) =>
      [...queryKeys.analytics.all, "top-cities", { limit }] as const,
    overview: () => [...queryKeys.analytics.all, "overview"] as const,
  },
} as const;
