"use client";

import { ReactNode } from "react";
import { AuthModalProvider, useAuthModal } from "@/contexts/AuthModalContext";
import LoginModal from "./LoginModal";

interface GlobalAuthProviderProps {
  children: ReactNode;
}

// Internal component that renders the modal
const GlobalLoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuthModal();

  return <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />;
};

// Main provider component
export const GlobalAuthProvider = ({ children }: GlobalAuthProviderProps) => {
  return (
    <AuthModalProvider>
      {children}
      <GlobalLoginModal />
    </AuthModalProvider>
  );
};

export default GlobalAuthProvider;
