"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  User,
  Image,
  Progress,
  Card,
  CardBody,
  Input,
} from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import ListCardItem from "@/components/ListCardItem";
import {
  ArrowLeft,
  Clock,
  Eye,
  CheckCircle,
  Loader2,
  Globe,
  Edit3,
  Save,
  X,
} from "lucide-react";
import DetailContentSkeleton from "./DetailContentSkeleton";
import {
  usePostBySlug,
  useProgressPost,
  useUpdatePostStatus,
  useUpdatePost,
  useCities,
} from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/navigation";
import type { Post, City } from "@/types/api";
import { capitalizeWords } from "@/utils/strings";
import { formatRelativeTime } from "@/utils/dates";
import {
  calculateProgress,
  getAnimationDelay,
  getDefaultPostImage,
  getAnimatedItemClasses,
  isProcessingCompleted,
} from "@/utils/ui";
import {
  POST_STATUS,
  ANIMATION_DELAYS,
  UI_CONSTANTS,
  DEFAULTS,
} from "@/utils/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Helper function to validate Google Maps links
const isValidGmapsLink = (url: string): boolean => {
  const gmapsPattern =
    /(https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\/[^\s]+)/;
  return gmapsPattern.test(url);
};

const MAX_GMAPS_LINKS = UI_CONSTANTS.MAX_GMAPS_LINKS;

// Edit post schema
const editPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  cityId: z.string().min(1, "City ID is required"),
  gmapsLinks: z
    .array(
      z
        .string()
        .url("Invalid URL format")
        .refine(isValidGmapsLink, "Must be a valid Google Maps URL")
    )
    .max(
      MAX_GMAPS_LINKS,
      `Maximum ${MAX_GMAPS_LINKS} Google Maps links allowed`
    )
    .optional()
    .default([]),
});

interface ProgressData {
  postId: string;
  processingStatus: string;
  pendingLinks: {
    order: number;
    gmapsLink: string;
  }[];
  summary?: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    percentage: number;
  };
  progress?: {
    totalLinks: number;
    processedLinks: number;
    failedLinks: number;
    percentage: number;
    startTime: number;
    endTime?: number;
  };
}

interface ReviewContentProps {
  slug: string;
}

const ReviewContent = ({ slug }: ReviewContentProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = usePostBySlug(slug);
  const [animatedPlaces, setAnimatedPlaces] = useState<Set<number>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const postResponse = data?.data as Post;
  const postId = postResponse?.id;

  const [isProcessingComplete, setIsProcessingComplete] = useState(false);

  // Watch progress for the post
  const { data: progressData, isLoading: isLoadingProgress } = useProgressPost(
    postId,
    !isProcessingComplete // Stop polling when processing is complete
  );

  const { mutate: updatePostStatus } = useUpdatePostStatus(postId);
  const { mutate: updatePost } = useUpdatePost(postId);

  // Cities data for autocomplete
  const { data: cities, isLoading: isLoadingCities } = useCities({
    limit: UI_CONSTANTS.DEFAULT_PAGE_SIZE,
    page: 1,
    q: debouncedSearch || DEFAULTS.CITY_SEARCH,
  });

  const citiesData = cities?.data as City[];

  // Form for editing
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: "",
      cityId: "",
      gmapsLinks: [],
    },
  });

  const progress = progressData?.data as ProgressData;

  // State for managing gmaps links with order
  const [gmapsUrls, setGmapsUrls] = useState<string[]>([]);
  const [existingPlaces, setExistingPlaces] = useState<any[]>([]);

  // Update processing complete state to control polling
  useEffect(() => {
    if (
      progress?.processingStatus === "COMPLETED" ||
      progress?.processingStatus === "FAILED"
    ) {
      setIsProcessingComplete(true);
    }
  }, [progress?.processingStatus]);

  // Initialize form when post data is available
  useEffect(() => {
    if (postResponse && !isEditMode) {
      reset({
        title: postResponse.title,
        cityId: postResponse.cityId,
        gmapsLinks: [],
      });
      setSearch(postResponse.city?.name || "");

      // Initialize existing places for management
      const places =
        postResponse.postPlaces?.sort((a, b) => a.order - b.order) || [];
      setExistingPlaces(places);

      // Get current gmaps links from existing places and pending links
      const existingLinks = places.map((p) => p.place.gmapsLink);
      const pendingLinks =
        progress?.pendingLinks
          ?.sort((a, b) => a.order - b.order)
          ?.map((link) => link.gmapsLink) || [];
      const allLinks = [...existingLinks, ...pendingLinks];
      setGmapsUrls(allLinks);
      setValue("gmapsLinks", allLinks);

      // Reset animation state when data changes to prevent DOM conflicts
      setAnimatedPlaces(new Set());
    }
  }, [postResponse, progress?.pendingLinks, reset, setValue, isEditMode]);

  // Animate places as they become available
  useEffect(() => {
    if (postResponse?.postPlaces && progress) {
      const completedPlaces = postResponse.postPlaces.length;
      const totalLinks = progress.pendingLinks.length + completedPlaces;

      if (completedPlaces > 0) {
        // Animate places one by one with delay
        postResponse.postPlaces.forEach((_, index) => {
          setTimeout(() => {
            setAnimatedPlaces((prev) => new Set([...prev, index]));
          }, index * ANIMATION_DELAYS.PLACE_APPEAR);
        });
      }
    }
  }, [postResponse?.postPlaces, progress]);

  if (isLoading) return <DetailContentSkeleton />;

  if (!postResponse) {
    return <div className="text-center py-8">Post not found</div>;
  }

  const handleBack = () => {
    router.push("/");
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form
      reset({
        title: postResponse.title,
        cityId: postResponse.cityId,
        gmapsLinks: [],
      });
      setSearch(postResponse.city?.name || "");
      const currentLinks =
        progress?.pendingLinks
          ?.sort((a, b) => a.order - b.order)
          ?.map((link) => link.gmapsLink) || [];
      setGmapsUrls(currentLinks);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveEdit = async (data: any) => {
    try {
      // Get reordered gmaps links from existing places + new additions
      const existingLinks = existingPlaces.map((p) => p.place.gmapsLink);
      const newLinks = gmapsUrls
        .slice(existingPlaces.length)
        .filter((url) => url.trim() !== "");
      const allLinks = [...existingLinks, ...newLinks];

      const submitData = {
        title: data.title,
        cityId: data.cityId,
        gmapsLinks: allLinks,
      };

      await updatePost(submitData, {
        onSuccess: () => {
          setIsEditMode(false);
          // Invalidate and refetch the post data by slug
          queryClient.invalidateQueries({
            queryKey: queryKeys.posts.bySlug(slug),
          });
          // Also invalidate progress data to get updated processing status
          if (postId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.posts.progress(postId),
            });
          }
        },
      });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const addGmapsUrl = () => {
    if (gmapsUrls.length < MAX_GMAPS_LINKS) {
      setGmapsUrls([...gmapsUrls, ""]);
    }
  };

  const moveExistingPlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...existingPlaces];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newPlaces.length) {
      [newPlaces[index], newPlaces[targetIndex]] = [
        newPlaces[targetIndex],
        newPlaces[index],
      ];
      setExistingPlaces(newPlaces);

      // Update gmapsUrls to reflect new order
      const newUrls = newPlaces.map((p) => p.place.gmapsLink);
      setGmapsUrls([...newUrls, ...gmapsUrls.slice(newPlaces.length)]);
    }
  };

  const removeExistingPlace = (index: number) => {
    const newPlaces = existingPlaces.filter((_, i) => i !== index);
    setExistingPlaces(newPlaces);

    // Update gmapsUrls
    const newUrls = newPlaces.map((p) => p.place.gmapsLink);
    setGmapsUrls([...newUrls, ...gmapsUrls.slice(existingPlaces.length)]);
  };

  const selectedCityId = watch("cityId");

  const handlePublish = () => {
    if (postId) {
      updatePostStatus(
        {
          status: POST_STATUS.PUBLISHED,
        },
        {
          onSuccess: () => {
            router.push(`/detail/${postResponse.slug}`);
          },
        }
      );
    }
  };

  // Calculate progress using backend data or fallback to manual calculation
  const isCompleted = isProcessingCompleted(progress?.processingStatus || "");

  // Use backend summary if available, otherwise calculate manually
  const totalLinks =
    progress?.summary?.total ||
    (progress?.pendingLinks?.length || 0) +
      (postResponse?.postPlaces?.length || 0);
  const completedLinks =
    progress?.summary?.completed || postResponse?.postPlaces?.length || 0;
  const failedLinks = progress?.summary?.failed || 0;
  const progressPercentage =
    progress?.summary?.percentage ||
    calculateProgress(completedLinks, totalLinks);

  return (
    <>
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg mb-6 overflow-hidden">
        <Image
          src={
            postResponse.postPlaces[0]?.place?.image || getDefaultPostImage()
          }
          alt={postResponse.title}
          width={1000}
          height={667}
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <Button
          variant="light"
          size="sm"
          className="hover:bg-orange-50 absolute top-4 left-4 z-20 text-white text-lg"
          onPress={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>

        <div className="absolute inset-0 bg-black/30 z-10 w-full h-full" />
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2 md:line-clamp-none">
            {postResponse.title}
          </h1>
          <div className="before:bg-white/10 border-white/30 border-1 backdrop-blur-sm text-white shadow-small px-4 py-2 rounded-full md:w-1/4 justify-center items-center flex w-full">
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ready to publish
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing places...
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Processing Progress</h3>
            <span className="text-sm text-gray-500">
              {completedLinks}/{totalLinks} places processed
              {failedLinks > 0 && ` (${failedLinks} failed)`}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            color={failedLinks > 0 ? "danger" : "warning"}
            className="mb-4"
            size="md"
          />

          {/* Edit Form Section */}
          {isEditMode && (
            <div className="mb-4 p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
              <h4 className="font-semibold text-orange-800 mb-3">
                Edit Post Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-600"
                  >
                    Title
                  </label>
                  <Input
                    placeholder="Enter post title"
                    variant="bordered"
                    {...register("title")}
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title}
                    size="sm"
                  />
                </div>

                {/* City Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-600"
                  >
                    City
                  </label>
                  <Autocomplete
                    placeholder="Search and select a city"
                    variant="bordered"
                    selectedKey={selectedCityId || null}
                    onSelectionChange={(key: string | number | null) => {
                      setValue("cityId", key as string);
                      const selectedCity = citiesData?.find(
                        (city) => city.id === key
                      );
                      if (selectedCity) {
                        setSearch(selectedCity.name);
                      }
                    }}
                    onInputChange={(value: string) => {
                      setSearch(value);
                    }}
                    errorMessage={errors.cityId?.message}
                    isInvalid={!!errors.cityId}
                    items={citiesData || []}
                    isLoading={isLoadingCities}
                    inputValue={search}
                    allowsCustomValue={false}
                    menuTrigger="input"
                    size="sm"
                  >
                    {(city: City) => (
                      <AutocompleteItem key={city.id}>
                        {city.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {isCompleted
                ? failedLinks > 0
                  ? `Completed with ${failedLinks} failed place${
                      failedLinks > 1 ? "s" : ""
                    }`
                  : "All places processed successfully!"
                : `Processing ${totalLinks - completedLinks} remaining place${
                    totalLinks - completedLinks > 1 ? "s" : ""
                  }...`}
            </span>
            {isCompleted && (
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={handleEditToggle}
                      size="sm"
                      startContent={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="success"
                      onPress={() => handleSubmit(handleSaveEdit)()}
                      isLoading={isSubmitting}
                      size="sm"
                      startContent={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    {/* <Button
                      color="primary"
                      variant="bordered"
                      onPress={handleEditToggle}
                      size="sm"
                      startContent={<Edit3 className="w-4 h-4" />}
                    >
                      Edit
                    </Button> */}
                    <Button
                      color="primary"
                      className="bg-[#EA7B26] text-white"
                      onPress={handlePublish}
                      startContent={<Globe className="w-4 h-4" />}
                      size="sm"
                    >
                      Publish Post
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Real-time Progress Info (if job is actively running) */}
          {progress?.progress && !isCompleted && (
            <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div className="flex justify-between items-center">
                <span>Background processing:</span>
                <div className="flex items-center gap-2">
                  <span>
                    {progress.progress.processedLinks}/
                    {progress.progress.totalLinks}
                  </span>
                  {!isProcessingComplete && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              {progress.progress.failedLinks > 0 && (
                <div className="text-red-500 mt-1">
                  {progress.progress.failedLinks} failed during processing
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* User Info */}
      <div className="flex items-center space-x-3 justify-between mb-6 w-full md:px-0 px-6">
        <User
          name={postResponse.user.name}
          description={`@${postResponse.user.username}`}
          avatarProps={{
            src: postResponse.user.avatar,
          }}
          onClick={() => {
            router.push(`/u/${postResponse.user.username}`);
          }}
          className="cursor-pointer"
        />
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {formatRelativeTime(postResponse.createdAt)}
        </div>
      </div>

      <Divider className="my-6" />

      <h2 className="sm:text-2xl text-xl font-bold my-6 md:px-0 px-6">
        Locations in {capitalizeWords(postResponse.city.altName)}
      </h2>

      {/* Completed Places with Animation */}
      <div className="flex flex-col gap-4 md:px-0 px-6">
        {existingPlaces.map((postPlace, index) => (
          <div
            key={postPlace.id}
            className={`${getAnimatedItemClasses(animatedPlaces.has(index))} ${
              isEditMode
                ? "relative border-2 border-dashed border-orange-300 rounded-lg p-2"
                : ""
            }`}
            style={{
              transitionDelay: getAnimationDelay(index),
            }}
          >
            {/* Edit Controls */}
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white rounded-lg shadow-md p-1">
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  {index === 0 ? "Thumbnail" : `Place ${index + 1}`}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => moveExistingPlace(index, "up")}
                  isDisabled={index === 0}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ↑
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => moveExistingPlace(index, "down")}
                  isDisabled={index === existingPlaces.length - 1}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ↓
                </Button>
                {existingPlaces.length > 1 && (
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => removeExistingPlace(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            <ListCardItem place={postPlace.place} postId={postResponse.id} />
          </div>
        ))}

        {/* Add New Place Form */}
        {isEditMode && gmapsUrls.length < MAX_GMAPS_LINKS && (
          <Card className="border-2 border-dashed border-gray-300 hover:border-orange-300 transition-colors">
            <CardBody className="p-4">
              <h4 className="font-semibold text-gray-700 mb-3">
                Add New Place
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="https://maps.google.com/..."
                  variant="bordered"
                  value={gmapsUrls[existingPlaces.length] || ""}
                  onChange={(e) => {
                    const newUrls = [...gmapsUrls];
                    newUrls[existingPlaces.length] = e.target.value;
                    setGmapsUrls(newUrls);
                    setValue(
                      "gmapsLinks",
                      newUrls.filter((url) => url.trim() !== "")
                    );
                  }}
                  className="flex-1"
                  size="sm"
                />
                <Button
                  color="primary"
                  variant="light"
                  onPress={addGmapsUrl}
                  size="sm"
                  className="sm:w-auto w-full"
                >
                  + Add Place
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Pending Places */}
      {progress?.pendingLinks && progress.pendingLinks.length > 0 && (
        <div className="flex flex-col gap-4 md:px-0 px-6 mt-4">
          {progress.pendingLinks
            .sort((a, b) => a.order - b.order)
            .map((pendingLink, index) => (
              <Card
                key={`pending-${
                  pendingLink.order
                }-${pendingLink.gmapsLink.slice(-10)}`}
                className="opacity-50"
              >
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    <div>
                      <p className="font-medium">
                        Processing place {pendingLink.order + 1} of {totalLinks}
                        ...
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {pendingLink.gmapsLink}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      )}
    </>
  );
};

export default ReviewContent;
