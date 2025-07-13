// Utility to monitor preloaded resources and help debug preload warnings
export function monitorPreloadedResources() {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  // Only monitor in development mode
  try {
    // Monitor when resources are actually used (debounced)
    const observer = new PerformanceObserver((list) => {
      const relevantEntries = list.getEntries().filter((entry) => {
        return (
          entry.name.includes("fonts.googleapis.com") ||
          entry.name.includes("font") ||
          entry.name.includes(".woff") ||
          entry.name.includes(".woff2")
        );
      });

      if (relevantEntries.length > 0) {
        console.group("🔤 Font Resources Loaded");
        relevantEntries.forEach((entry) => {
          console.log(
            `📄 ${entry.name.split("/").pop()}`,
            `⏱️ ${entry.duration.toFixed(2)}ms`
          );
        });
        console.groupEnd();
      }
    });

    observer.observe({ entryTypes: ["resource"] });

    // Check for unused preloaded resources (delayed to avoid interference)
    const checkTimer = setTimeout(() => {
      const preloadedLinks = document.querySelectorAll('link[rel="preload"]');
      if (preloadedLinks.length > 0) {
        console.group("🔗 Preloaded Resources");
        preloadedLinks.forEach((link) => {
          const href = (link as HTMLLinkElement).href;
          const as = (link as HTMLLinkElement).as;
          const fileName = href.split("/").pop() || href;
          console.log(`📦 ${fileName} (as: ${as})`);
        });
        console.groupEnd();
      }
    }, 2000); // Reduced delay

    // Cleanup function
    return () => {
      observer.disconnect();
      clearTimeout(checkTimer);
    };
  } catch (error) {
    console.warn("Resource monitor failed to initialize:", error);
  }
}

// Optimize font display to prevent preload warnings
export function optimizeFontDisplay() {
  if (typeof window === "undefined") return;

  // Only add font-display optimization if not already present
  const existingStyle = document.querySelector("#font-display-optimizer");
  if (existingStyle) return;

  try {
    const style = document.createElement("style");
    style.id = "font-display-optimizer";
    style.textContent = `
      /* Optimize font display for better performance */
      * {
        font-display: swap;
      }
      
      /* Prevent layout shift during font loading */
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to optimize font display:", error);
    }
  }
}

// Utility to preload critical resources when needed
export function preloadCriticalResources() {
  if (typeof window === "undefined") return;

  // Only preload resources that are immediately needed
  const criticalResources = [
    { href: "/logo.svg", as: "image" },
    // Add other critical resources here
  ];

  criticalResources.forEach(({ href, as }) => {
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  });
}
