// Utility to monitor preloaded resources and help debug preload warnings
export function monitorPreloadedResources() {
  if (typeof window === "undefined") return;

  // Monitor when resources are actually used
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (
        entry.name.includes("fonts.googleapis.com") ||
        entry.name.includes("font") ||
        entry.name.includes(".woff") ||
        entry.name.includes(".woff2")
      ) {
        console.log(
          "Font resource loaded:",
          entry.name,
          "Duration:",
          entry.duration
        );
      }
    });
  });

  observer.observe({ entryTypes: ["resource"] });

  // Check for unused preloaded resources
  setTimeout(() => {
    const preloadedLinks = document.querySelectorAll('link[rel="preload"]');
    preloadedLinks.forEach((link) => {
      const href = (link as HTMLLinkElement).href;
      const as = (link as HTMLLinkElement).as;
      console.log("Preloaded resource:", href, "as:", as);
    });
  }, 3000);
}

// Force font display to prevent preload warnings
export function optimizeFontDisplay() {
  if (typeof window === "undefined") return;

  // Add font-display: swap to all font faces
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}
