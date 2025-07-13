"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./get-query-client";
import { ToastProvider } from "@heroui/react";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import GlobalAuthProvider from "@/components/GlobalAuthProvider";
import { AuthSession } from "@/lib/auth";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  initialSession?: AuthSession | null;
  initialToken?: string | null;
}

export function Providers({
  children,
  initialSession = null,
  initialToken = null,
}: ProvidersProps) {
  const queryClient = getQueryClient();

  useEffect(() => {
    // Dynamic import to prevent preload warnings
    const initializeResourceMonitoring = async () => {
      try {
        const { monitorPreloadedResources, optimizeFontDisplay } = await import(
          "@/utils/resource-monitor"
        );

        // Optimize font display immediately
        optimizeFontDisplay();

        // Monitor preloaded resources in development
        let cleanup: (() => void) | undefined;
        if (process.env.NODE_ENV === "development") {
          cleanup = monitorPreloadedResources();
        }

        // Return cleanup function
        return cleanup;
      } catch (error) {
        // Silently fail in production
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to load resource monitor:", error);
        }
      }
    };

    let cleanupRef: (() => void) | undefined;

    initializeResourceMonitoring().then((cleanup) => {
      cleanupRef = cleanup;
    });

    // Cleanup on unmount
    return () => {
      if (cleanupRef) {
        cleanupRef();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider skipFramerMotionAnimations={true} locale="en-US">
        <ClientAuthProvider
          initialSession={initialSession}
          initialToken={initialToken}
        >
          <GlobalAuthProvider>
            <ToastProvider />
            {children}
            <ReactQueryDevtools />
          </GlobalAuthProvider>
        </ClientAuthProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
