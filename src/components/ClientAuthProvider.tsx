"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/store/useUser";
import { AuthSession } from "@/lib/auth";
import apiClient from "@/utils/api";
import { queryKeys } from "@/lib/queryKeys";
import { API_ENDPOINTS } from "@/constants/endpoints";

/**
 * ClientAuthProvider - Mengelola auth state di client side
 *
 * Flow:
 * 1. Set initial auth state dari server sebagai fallback
 * 2. Fetch profile terbaru dari server jika ada token
 * 3. Update store dengan data profil terbaru (termasuk username)
 * 4. Clear auth jika ada error dan tidak ada initial session
 *
 * Ini memastikan username dan data profil lainnya selalu up-to-date
 * tanpa bergantung pada data lama di token.
 */

interface ClientAuthProviderProps {
  children: React.ReactNode;
  initialSession: AuthSession | null;
  initialToken: string | null;
}

export default function ClientAuthProvider({
  children,
  initialSession,
  initialToken,
}: ClientAuthProviderProps) {
  const { setAuth, setUser } = useUser();

  // Hanya fetch profile jika ada token
  const {
    data: profileData,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => apiClient.get(API_ENDPOINTS.AUTH.PROFILE),
    enabled: !!initialToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    // Set initial auth state dari server sebagai fallback
    if (initialSession && initialToken) {
      setAuth(initialSession, initialToken);
    } else {
      setAuth(null, null);
    }
  }, [initialSession, initialToken, setAuth]);

  useEffect(() => {
    // Update dengan data profil terbaru dari server jika ada token
    if (initialToken && isSuccess && profileData?.data) {
      const freshProfileData: AuthSession = {
        userId: profileData.data.id,
        name: profileData.data.name,
        email: profileData.data.email,
        username: profileData.data.username,
        role: profileData.data.role,
        avatar: profileData.data.avatar,
      };

      // Update hanya user data, keep token yang sama
      setUser(freshProfileData);
    }
  }, [profileData, isSuccess, initialToken, setUser]);

  useEffect(() => {
    // Clear auth jika profile fetch error dan tidak ada initial session
    if (isError && !initialSession) {
      setAuth(null, null);
    }
  }, [isError, initialSession, setAuth]);

  return <>{children}</>;
}
