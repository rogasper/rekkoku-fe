"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import apiClient from "@/utils/api";
import { queryKeys } from "@/lib/queryKeys";
import { API_ENDPOINTS } from "@/constants/endpoints";

// ===== AUTH HOOKS =====
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => apiClient.get(API_ENDPOINTS.AUTH.PROFILE),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });
}

// ===== USERS HOOKS =====
export function useUsers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL, filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(id)),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post(API_ENDPOINTS.USERS.REGISTER, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(API_ENDPOINTS.USERS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

// ===== USERNAME HOOKS =====
export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: queryKeys.username.check(username),
    queryFn: () => apiClient.get(API_ENDPOINTS.USERNAME.CHECK(username)),
    enabled: !!username && username.length >= 3,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUsernameSuggestions(name?: string) {
  return useQuery({
    queryKey: queryKeys.username.suggestions(name),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.USERNAME.SUGGESTIONS, { params: { name } }),
    enabled: !!name,
  });
}

export function useUsernameStatus() {
  return useQuery({
    queryKey: queryKeys.username.status(),
    queryFn: () => apiClient.get(API_ENDPOINTS.USERNAME.STATUS),
  });
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { username: string }) =>
      apiClient.put(API_ENDPOINTS.USERNAME.UPDATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.username.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
}

// ===== POSTS HOOKS =====
export function usePosts(filters?: Record<string, any>) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(filters || {}),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_ALL, {
        params: {
          ...filters,
          page: pageParam,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const currentPage = lastPage.meta?.page || allPages.length;
      const limit = lastPage.meta?.limit || 10;
      const dataLength = lastPage.data?.length || 0;

      const hasNextPage = dataLength >= limit;

      return hasNextPage ? currentPage + 1 : undefined;
    },
  });
}

export function useNearbyPosts(
  params: Record<string, any>,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.nearby(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_NEARBY, {
        params: {
          ...params,
          page: pageParam,
        },
      }),
    enabled: options?.enabled ?? true,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const currentPage = lastPage.meta?.page || allPages.length;
      const limit = lastPage.meta?.limit || 10;
      const dataLength = lastPage.data?.length || 0;

      const hasNextPage = dataLength >= limit;

      return hasNextPage ? currentPage + 1 : undefined;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => apiClient.get(API_ENDPOINTS.POSTS.GET_BY_ID(id)),
    enabled: !!id,
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.posts.bySlug(slug),
    queryFn: () => apiClient.get(API_ENDPOINTS.POSTS.GET_BY_SLUG(slug)),
  });
}

export function useMyPosts(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.posts.myPosts(filters || {}),
    queryFn: () => apiClient.get(API_ENDPOINTS.POSTS.GET_MY_POSTS, filters),
  });
}

export function useMyDraftPosts(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.posts.myPosts({ ...filters, status: "DRAFT" }),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_MY_POSTS, {
        params: {
          ...filters,
          status: "DRAFT",
        },
      }),
  });
}

export function useProgressPost(id: string, shouldPoll: boolean = true) {
  return useQuery({
    queryKey: queryKeys.posts.progress(id),
    queryFn: () => apiClient.get(API_ENDPOINTS.POSTS.GET_PROGRESS(id)),
    enabled: !!id,
    refetchInterval: shouldPoll ? 2000 : false, // Poll every 2 seconds when shouldPoll is true
    refetchIntervalInBackground: false, // Don't poll when tab is not active
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post(API_ENDPOINTS.POSTS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(API_ENDPOINTS.POSTS.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      // Invalidate ALL bySlug queries (since we don't know the specific slug)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => {
          // This will invalidate any query that starts with ["posts", "slug", ...]
          return query.queryKey.includes("slug");
        },
      });
    },
  });
}

export function useUpdatePostStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(API_ENDPOINTS.POSTS.UPDATE_STATUS(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.progress(id) });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(API_ENDPOINTS.POSTS.LIKE(id)),
    onSuccess: (_, id) => {
      // Invalidate post detail by ID
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      // Invalidate all lists (including infinite queries)
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      // Invalidate ALL bySlug queries (since we don't know the specific slug)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => {
          // This will invalidate any query that starts with ["posts", "slug", ...]
          return query.queryKey.includes("slug");
        },
      });
    },
  });
}

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(API_ENDPOINTS.POSTS.BOOKMARK(id)),
    onSuccess: (_, id) => {
      // Invalidate post detail by ID
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      // Invalidate all lists (including infinite queries)
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      // Invalidate ALL bySlug queries (since we don't know the specific slug)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => {
          // This will invalidate any query that starts with ["posts", "slug", ...]
          return query.queryKey.includes("slug");
        },
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

// ===== CITIES HOOKS =====
export function useCities(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.cities.list(filters || {}),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.CITIES.GET_ALL, { params: filters }),
  });
}

export function useSearchCities(query: string) {
  return useQuery({
    queryKey: queryKeys.cities.search(query),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.CITIES.SEARCH, { params: { q: query } }),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useNearbyCities(params: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.cities.nearby(params),
    queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.GET_NEARBY, params),
    enabled: !!(params.lat && params.long),
  });
}

export function usePopularCities() {
  return useQuery({
    queryKey: queryKeys.cities.popular(),
    queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.GET_POPULAR),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCitiesWithMostPosts() {
  return useQuery({
    queryKey: queryKeys.cities.mostPosts(),
    queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.GET_MOST_POSTS),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: queryKeys.cities.provinces(),
    queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.GET_PROVINCES),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useCitiesByProvince(provinceId: string) {
  return useQuery({
    queryKey: queryKeys.cities.byProvince(provinceId),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.CITIES.GET_BY_PROVINCE(provinceId)),
    enabled: !!provinceId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCity(id: string) {
  return useQuery({
    queryKey: queryKeys.cities.detail(id),
    queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.GET_BY_ID(id)),
    enabled: !!id,
  });
}

// ===== USER DETAILS HOOKS =====
export function useUserDetails() {
  return useQuery({
    queryKey: queryKeys.userDetails.me(),
    queryFn: () => apiClient.get(API_ENDPOINTS.USER_DETAILS.GET_ME),
  });
}

export function useUserDetailsByUserId(userId: string) {
  return useQuery({
    queryKey: queryKeys.userDetails.byUserId(userId),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.USER_DETAILS.GET_BY_USER_ID(userId)),
    enabled: !!userId,
  });
}

export function useCreateUserDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post(API_ENDPOINTS.USER_DETAILS.CREATE_ME, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userDetails.me() });
    },
  });
}

export function useUpdateUserDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(API_ENDPOINTS.USER_DETAILS.UPDATE_ME, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userDetails.me() });
    },
  });
}

// ===== PLACES HOOKS =====
export function usePlaces(filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.places.list(filters || {}),
    queryFn: () => apiClient.get(API_ENDPOINTS.PLACES.GET_ALL, filters),
  });
}

export function useSearchPlaces(query: string) {
  return useQuery({
    queryKey: queryKeys.places.search(query),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.PLACES.SEARCH, { params: { q: query } }),
    enabled: !!query,
  });
}

export function useNearbyPlaces(params: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.places.nearby(params),
    queryFn: () => apiClient.get(API_ENDPOINTS.PLACES.GET_NEARBY, params),
    enabled: !!(params.lat && params.long),
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: queryKeys.places.detail(id),
    queryFn: () => apiClient.get(API_ENDPOINTS.PLACES.GET_BY_ID(id)),
    enabled: !!id,
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post(API_ENDPOINTS.PLACES.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

export function useUpdatePlace(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(API_ENDPOINTS.PLACES.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.places.lists() });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(API_ENDPOINTS.PLACES.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

// ===== USER PROFILE HOOKS =====
export function useUserByUsername(username: string) {
  return useQuery({
    queryKey: queryKeys.users.byUsername(username),
    queryFn: () => apiClient.get(API_ENDPOINTS.USERS.GET_BY_USERNAME(username)),
    enabled: !!username,
  });
}

export function useUserLikedPosts(
  userId: string,
  filters?: Record<string, any>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.userLiked(userId, filters || {}),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_USER_LIKED(userId), {
        params: {
          ...filters,
          page: pageParam,
        },
      }),
    enabled: !!userId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const currentPage = lastPage.meta?.page || allPages.length;
      const limit = lastPage.meta?.limit || 20;
      const dataLength = lastPage.data?.length || 0;

      const hasNextPage = dataLength >= limit;

      return hasNextPage ? currentPage + 1 : undefined;
    },
  });
}

export function useUserBookmarkedPosts(
  userId: string,
  filters?: Record<string, any>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.userBookmarked(userId, filters || {}),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_USER_BOOKMARKED(userId), {
        params: {
          ...filters,
          page: pageParam,
        },
      }),
    enabled: !!userId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const currentPage = lastPage.meta?.page || allPages.length;
      const limit = lastPage.meta?.limit || 20;
      const dataLength = lastPage.data?.length || 0;

      const hasNextPage = dataLength >= limit;

      return hasNextPage ? currentPage + 1 : undefined;
    },
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: () => apiClient.get(API_ENDPOINTS.POSTS.GET_USER_STATS(userId)),
    enabled: !!userId,
  });
}

export function useUserPosts(userId: string, filters?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.posts.userPosts(userId, filters || {}),
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.POSTS.GET_USER_POSTS(userId), {
        params: filters,
      }),
    enabled: !!userId,
  });
}
