"use client";
import CardItem from "@/components/CardItem";
import CardItemSkeleton from "@/components/CardItemSkeleton";
import { usePosts } from "@/hooks/useApi";
import { Button } from "@heroui/react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter, useSearchParams } from "next/navigation";

interface HomeContentProps {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: Record<string, string>;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

export default function HomeContent({
  initialPage = 1,
  initialLimit = 10,
  initialFilters = {},
  initialSearchParams = {},
}: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters] = useState(initialFilters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Prepare query parameters for posts API (excluding page - handled by infinite query)
  const queryParams = {
    limit,
    ...filters,
  };

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts(queryParams);

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
    const observer = new IntersectionObserver(updateCurrentIndex, {
      root: containerRef.current,
      threshold: 0.5,
      rootMargin: "-20% 0px -20% 0px", // Only trigger when item is in the center area
    });

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [allPosts.length, updateCurrentIndex]);

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
  }, [currentPage, limit, filters, router, searchParams]);

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

  // Show skeleton loading state
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
                  className="snap-start min-h-[calc(100vh-20rem)] flex items-center justify-center"
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
          // Show illustration when no posts
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <Image
              src="/logo.svg"
              alt="No posts found"
              width={300}
              height={300}
            />
            <h3 className="text-xl font-semibold text-gray-700">
              No Posts Found
            </h3>
            <p className="text-gray-500">
              There are no posts available at the moment. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Navigation Arrows - Only visible on desktop */}
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
    </div>
  );
}
