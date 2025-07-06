"use client";
import { useEffect } from "react";
import useUser from "@/store/useUser";
import { AuthSession } from "@/lib/auth";

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
  const { setAuth } = useUser();

  useEffect(() => {
    // Set initial auth state dari server
    if (initialSession && initialToken) {
      setAuth(initialSession, initialToken);
    }
  }, [initialSession, initialToken, setAuth]);

  return <>{children}</>;
}
