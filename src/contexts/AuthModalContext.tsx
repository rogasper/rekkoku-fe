"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider = ({ children }: AuthModalProviderProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      // User is authenticated, execute callback
      callback();
    } else {
      // User is not authenticated, show login modal
      openLoginModal();
    }
  };

  const value = {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    requireAuth,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

// Export hook for easy access
export { useAuthModal as useGlobalAuthModal };
