"use client";

import { useAuth } from "./useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";

export const useAuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthModal();

  /**
   * Menjalankan callback hanya jika user sudah authenticated
   * Jika belum, akan menampilkan login modal
   */
  const withAuth = (callback: () => void) => {
    requireAuth(callback);
  };

  /**
   * Menjalankan callback asynchronous hanya jika user sudah authenticated
   * Jika belum, akan menampilkan login modal
   */
  const withAuthAsync = (callback: () => Promise<void>) => {
    requireAuth(callback);
  };

  /**
   * Mengembalikan true jika user sudah authenticated
   * Jika belum, akan menampilkan login modal dan mengembalikan false
   */
  const checkAuth = (): boolean => {
    if (!isAuthenticated) {
      requireAuth(() => {});
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    withAuth,
    withAuthAsync,
    checkAuth,
    requireAuth,
  };
};
