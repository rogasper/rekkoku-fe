"use client";
import TopUsersSection from "@/components/TopUsersSection";
import TopPostsSection from "@/components/TopPostsSection";
import TopCitiesSection from "@/components/TopCitiesSection";
import ProfileGridItem from "@/components/ProfileGridItem";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Skeleton,
  Input,
  Button,
} from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { usePosts, useCities } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/use-debounce";
import type { Post, City } from "@/types/api";
import { UI_CONSTANTS, DEFAULTS } from "@/utils/constants";
import { searchAction } from "@/actions/action";

interface ExploreContentProps {
  className?: string;
  searchQuery?: string;
  cityId?: string;
}

const SectionSkeleton = () => (
  <Card className="w-full">
    <CardBody className="p-4 sm:p-6">
      <Skeleton className="rounded-lg mb-4">
        <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
      </Skeleton>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="flex rounded-full w-10 h-10" />
            <div className="w-full flex flex-col space-y-2">
              <Skeleton className="h-4 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-2/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const PostGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="aspect-square">
        <Skeleton className="rounded-lg w-full h-full" />
      </div>
    ))}
  </div>
);

export default function ExploreContent({
  className = "",
  searchQuery = "",
  cityId = "",
}: ExploreContentProps) {
  const router = useRouter();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localCityId, setLocalCityId] = useState(cityId);
  const [citySearch, setCitySearch] = useState("");

  const debouncedCitySearch = useDebounce(citySearch, 500);

  // Check if we have active search
  const hasActiveSearch = !!(searchQuery || cityId);

  // Cities data for autocomplete
  const { data: cities, isLoading: isLoadingCities } = useCities({
    limit: UI_CONSTANTS.DEFAULT_PAGE_SIZE,
    page: 1,
    q: debouncedCitySearch || DEFAULTS.CITY_SEARCH,
  });

  const citiesData = cities?.data as City[];

  // Posts data for search results (only fetch when searching)
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts(
    hasActiveSearch
      ? {
          q: searchQuery || undefined,
          cityId: cityId || undefined,
          limit: 20,
        }
      : undefined,
    { enabled: hasActiveSearch }
  );

  // Initialize local state from props
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setLocalCityId(cityId);

    // Set city search text if cityId exists
    if (cityId && citiesData) {
      const selectedCity = citiesData.find((city) => city.id === cityId);
      if (selectedCity) {
        setCitySearch(selectedCity.name);
      }
    }
  }, [searchQuery, cityId, citiesData]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (localSearchQuery.trim()) {
      params.set("q", localSearchQuery.trim());
    }

    if (localCityId) {
      params.set("cityId", localCityId);
    }

    const queryString = params.toString();
    searchAction(queryString);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    setLocalCityId("");
    setCitySearch("");
    router.push("/search");
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Flatten posts data for display
  const allPosts = postsData?.pages.flatMap((page) => page.data) || [];

  return (
    <div
      className={`max-w-[1024px] mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 ${className}`}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="animate-in fade-in duration-500">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                {hasActiveSearch ? "Search Results" : "Explore Destinations"}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
                {hasActiveSearch
                  ? "Find the perfect destinations based on your search criteria"
                  : "Discover the most popular cities and places to visit based on community posts."}
              </p>
            </div>

            {/* Search Section */}
            <Card className="w-full">
              <CardBody className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Search Posts
                      </label>
                      <Input
                        placeholder="Search for places, destinations..."
                        variant="bordered"
                        classNames={{
                          input: "focus:outline-none",
                        }}
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        startContent={
                          <Search className="w-4 h-4 text-gray-400" />
                        }
                      />
                    </div>

                    {/* City Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Filter by City
                      </label>
                      <Autocomplete
                        placeholder="Select a city"
                        variant="bordered"
                        selectedKey={localCityId || null}
                        onSelectionChange={(key: string | number | null) => {
                          setLocalCityId((key as string) || "");
                          const selectedCity = citiesData?.find(
                            (city) => city.id === key
                          );
                          if (selectedCity) {
                            setCitySearch(selectedCity.name);
                          }
                        }}
                        onInputChange={(value: string) => {
                          setCitySearch(value);
                        }}
                        items={citiesData || []}
                        isLoading={isLoadingCities}
                        inputValue={citySearch}
                        allowsCustomValue={false}
                        menuTrigger="input"
                      >
                        {(city: City) => (
                          <AutocompleteItem key={city.id}>
                            {city.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  </div>

                  {/* Search Actions */}
                  <div className="flex gap-2 justify-end">
                    {hasActiveSearch && (
                      <Button
                        variant="light"
                        onPress={handleClearSearch}
                        startContent={<X className="w-4 h-4" />}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      color="primary"
                      onPress={handleSearch}
                      startContent={<Search className="w-4 h-4" />}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Content */}
            {hasActiveSearch ? (
              // Search Results
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Search Results
                  </h2>
                  <span className="text-sm text-gray-500">
                    {allPosts.length} post{allPosts.length !== 1 ? "s" : ""}{" "}
                    found
                  </span>
                </div>

                {isLoadingPosts ? (
                  <PostGridSkeleton />
                ) : allPosts.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {allPosts.map((post: Post) => (
                        <ProfileGridItem
                          key={post.id}
                          title={post.title}
                          image={post.postPlaces[0]?.place?.image}
                          likes={post.likeCount}
                          bookmarks={post.bookmarksCount}
                          places={post.postPlaces?.length || 0}
                          type="post"
                          location={post.city?.name}
                          slug={post.slug}
                        />
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasNextPage && (
                      <div className="flex justify-center">
                        <Button
                          variant="bordered"
                          onPress={handleLoadMore}
                          isLoading={isFetchingNextPage}
                          isDisabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <Search className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Default Content
              <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1">
                <div className="xl:order-1">
                  <Suspense fallback={<SectionSkeleton />}>
                    <TopCitiesSection limit={10} />
                  </Suspense>
                </div>
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:order-2">
                  <Suspense fallback={<SectionSkeleton />}>
                    <TopPostsSection limit={5} />
                  </Suspense>
                  <Suspense fallback={<SectionSkeleton />}>
                    <TopUsersSection limit={3} />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
