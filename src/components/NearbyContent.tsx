"use client";
import CardItem from "@/components/CardItem";
import CardItemSkeleton from "@/components/CardItemSkeleton";
import { useNearbyPosts, usePosts } from "@/hooks/useApi";
import { Button } from "@heroui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
// import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { useGeolocated } from "react-geolocated";

interface NearbyContentProps {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: Record<string, string>;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

const NearbyContent = ({
  initialPage = 1,
  initialLimit = 10,
  initialFilters = {},
  initialSearchParams = {},
}: NearbyContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track if component has hydrated on client
  const [isClient, setIsClient] = useState(false);

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    getPosition,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    },
    userDecisionTimeout: 10000,
    suppressLocationOnMount: false,
    watchPosition: false,
  });

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters] = useState(initialFilters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check if we have valid coordinates
  const hasValidCoords = coords?.latitude && coords?.longitude;

  // Track hydration to prevent SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log("COORDS:", coords);

  // Prepare query parameters for posts API (excluding page - handled by infinite query)
  const queryParams = {
    lat: coords?.latitude || 0,
    long: coords?.longitude || 0,
    limit,
    ...filters,
  };

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNearbyPosts(queryParams, {
    enabled: isClient && hasValidCoords != 0, // Only enable after client hydration
  });

  // Get flattened posts for navigation - backend returns { data: [...] }
  const allPosts = posts?.pages?.flatMap((page) => page.data) || [];

  // Update itemRefs array when allPosts length changes
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, allPosts.length);
  }, [allPosts.length]);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Intersection observer for tracking current visible item
  const updateCurrentIndex = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const index = itemRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      });
    },
    []
  );

  useEffect(() => {
    if (!isClient) return; // Don't run on server

    const observer = new IntersectionObserver(updateCurrentIndex, {
      root: containerRef.current,
      threshold: 0.5,
      rootMargin: "-20% 0px -20% 0px", // Only trigger when item is in the center area
    });

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [allPosts.length, updateCurrentIndex, isClient]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initialize data based on initial page (fetch multiple pages for deep links)
  useEffect(() => {
    if (
      initialPage > 1 &&
      posts &&
      posts.pages.length < initialPage &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      // Fetch the next page to get closer to the target page
      fetchNextPage();
    }
  }, [
    initialPage,
    posts,
    posts?.pages?.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // Update current page when new pages are fetched
  useEffect(() => {
    if (posts?.pages?.length) {
      const latestPage = posts.pages[posts.pages.length - 1] as any;
      const pageFromMeta = latestPage?.meta?.page || posts.pages.length;
      setCurrentPage(pageFromMeta);
    }
  }, [posts?.pages?.length, posts?.pages]);

  // Update URL when page changes
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    const params = new URLSearchParams();

    // Add current page if > 1
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    // Add limit if different from default
    if (limit !== 10) {
      params.set("limit", limit.toString());
    }

    // Add filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    const currentUrl = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";

    // Only update if URL actually changed
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [currentPage, limit, filters, router, searchParams, isClient]);

  const scrollToNext = (): void => {
    if (currentIndex < allPosts.length - 1) {
      const nextIndex = currentIndex + 1;
      itemRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const scrollToPrevious = (): void => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      itemRefs.current[prevIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleRetryLocation = async () => {
    setIsRetrying(true);
    try {
      await getPosition();
    } catch (error) {
      console.error("Failed to get location:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleViewAllPosts = () => {
    router.push("/"); // Navigate to main page which shows all posts
  };

  // Show loading during hydration to prevent SSR mismatch
  if (!isClient) {
    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <MapPin className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Loading Nearby Posts...
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we prepare your content
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show geolocation permission/error states
  if (!isGeolocationAvailable) {
    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Geolocation Not Supported
            </h3>
            <p className="text-gray-600">
              Your browser doesn't support geolocation. You can still browse all
              posts instead.
            </p>
          </div>
          <Button
            color="primary"
            className="bg-[#EA7B26] text-white"
            onPress={handleViewAllPosts}
          >
            View All Posts
          </Button>
        </div>
      </div>
    );
  }

  if (!isGeolocationEnabled || positionError) {
    const isPermissionDenied = positionError?.code === 1; // PERMISSION_DENIED
    const isPositionUnavailable = positionError?.code === 2; // POSITION_UNAVAILABLE
    const isTimeout = positionError?.code === 3; // TIMEOUT

    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-md">
          <div className="bg-orange-100 p-4 rounded-full">
            <MapPin className="w-12 h-12 text-orange-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {isPermissionDenied
                ? "Location Access Needed"
                : isTimeout
                ? "Location Request Timed Out"
                : "Unable to Get Location"}
            </h3>
            <p className="text-gray-600">
              {isPermissionDenied
                ? "Please allow location access to find nearby posts. You can enable it in your browser settings or by clicking the location icon in the address bar."
                : isTimeout
                ? "Location request took too long. Please check your GPS signal and try again."
                : "We couldn't determine your location. Please check your GPS settings and try again."}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button
              color="primary"
              className="bg-[#EA7B26] text-white"
              onPress={handleRetryLocation}
              isLoading={isRetrying}
              startContent={
                isRetrying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )
              }
            >
              {isRetrying ? "Getting Location..." : "Try Again"}
            </Button>
            <Button variant="bordered" onPress={handleViewAllPosts}>
              View All Posts Instead
            </Button>
          </div>
          {isPermissionDenied && (
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">How to enable location:</p>
              <ul className="text-left space-y-1">
                <li>• Click the 🔒 or 📍 icon in your address bar</li>
                <li>• Select "Allow" for location access</li>
                <li>• Refresh this page</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show loading state while getting location
  if (!hasValidCoords) {
    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <MapPin className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Getting Your Location...
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we determine your location
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show skeleton loading state while loading posts
  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div
          ref={containerRef}
          className="snap-y snap-mandatory overflow-y-auto max-h-[calc(100vh-8rem)] hide-scrollbar w-full"
        >
          <div className="snap-start min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <CardItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Main Content */}
      <div
        ref={containerRef}
        className="snap-y snap-mandatory overflow-y-auto max-h-[calc(100vh-8rem)] hide-scrollbar w-full"
      >
        {allPosts.length > 0 ? (
          <>
            {allPosts.map((item, index) => (
              <div key={item.id}>
                <div
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="snap-start min-h-[calc(100vh-20rem)] flex items-center justify-center "
                >
                  <CardItem post={item} />
                </div>
                {/* Trigger infinite scroll after 6th item */}
                {index === 5 && (
                  <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center"
                  >
                    {isFetchingNextPage && (
                      <div className="text-center py-4">
                        <CardItemSkeleton />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator when fetching */}
            {isFetchingNextPage && (
              <div className="snap-start min-h-[calc(100vh-10rem)] flex items-center justify-center">
                <CardItemSkeleton />
              </div>
            )}
          </>
        ) : (
          // Show illustration when no posts found nearby
          <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="bg-gray-100 p-6 rounded-full">
              <MapPin className="w-16 h-16 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                No Nearby Posts Found
              </h3>
              <p className="text-gray-500 max-w-sm">
                There are no posts near your current location. Try expanding
                your search or check out all posts instead.
              </p>
            </div>
            <Button
              color="primary"
              className="bg-[#EA7B26] text-white"
              onPress={handleViewAllPosts}
            >
              View All Posts
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Arrows - Only visible on desktop when there are posts */}
      {allPosts.length > 0 && (
        <div className="hidden lg:flex flex-col gap-4 absolute right-4">
          <Button
            isIconOnly
            className="bg-[#EA7B26]/80 text-white"
            radius="full"
            aria-label="Previous"
            onPress={scrollToPrevious}
            isDisabled={currentIndex === 0}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            isIconOnly
            className="bg-[#EA7B26]/80 text-white"
            radius="full"
            aria-label="Next"
            onPress={scrollToNext}
            isDisabled={currentIndex === allPosts.length - 1}
          >
            <ChevronDownIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NearbyContent;
