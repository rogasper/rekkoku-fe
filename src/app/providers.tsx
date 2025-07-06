"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./get-query-client";
import { ToastProvider } from "@heroui/react";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import { AuthSession } from "@/lib/auth";
import { useEffect } from "react";
import {
  monitorPreloadedResources,
  optimizeFontDisplay,
} from "@/utils/resource-monitor";

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
    // Monitor preloaded resources in development
    if (process.env.NODE_ENV === "development") {
      monitorPreloadedResources();
    }
    // Optimize font display
    optimizeFontDisplay();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider skipFramerMotionAnimations={true} locale="en-US">
        <ClientAuthProvider
          initialSession={initialSession}
          initialToken={initialToken}
        >
          <ToastProvider />
          {children}
          <ReactQueryDevtools />
        </ClientAuthProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
