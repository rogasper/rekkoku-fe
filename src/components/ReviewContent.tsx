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
} from "@heroui/react";
import ListCardItem from "@/components/ListCardItem";
import {
  ArrowLeft,
  Clock,
  Eye,
  CheckCircle,
  Loader2,
  Globe,
  Edit3,
} from "lucide-react";
import DetailContentSkeleton from "./DetailContentSkeleton";
import {
  usePostBySlug,
  useProgressPost,
  useUpdatePostStatus,
} from "@/hooks/useApi";
import { useRouter } from "nextjs-toploader/app";
import type { Post } from "@/types/api";
import { capitalizeWords } from "@/utils/strings";
import { formatRelativeTime } from "@/utils/dates";
import {
  calculateProgress,
  getAnimationDelay,
  getDefaultPostImage,
  getAnimatedItemClasses,
  isProcessingCompleted,
} from "@/utils/ui";
import { POST_STATUS, ANIMATION_DELAYS } from "@/utils/constants";
import { editPostAction } from "@/actions/action";

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
  const { data, isLoading, refetch } = usePostBySlug(slug);
  const [animatedPlaces, setAnimatedPlaces] = useState<Set<number>>(new Set());
  const postResponse = data?.data as Post;
  const postId = postResponse?.id;

  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [hasRefetchedAfterComplete, setHasRefetchedAfterComplete] =
    useState(false);

  // Watch progress for the post
  const { data: progressData, isLoading: isLoadingProgress } = useProgressPost(
    postId,
    !isProcessingComplete // Stop polling when processing is complete
  );

  const { mutate: updatePostStatus } = useUpdatePostStatus(postId);

  const progress = progressData?.data as ProgressData;

  // Update processing complete state to control polling
  useEffect(() => {
    if (
      progress?.processingStatus === "COMPLETED" ||
      progress?.processingStatus === "FAILED"
    ) {
      setIsProcessingComplete(true);
    } else if (progress?.processingStatus === "PROCESSING") {
      // Reset flags when new processing starts
      setIsProcessingComplete(false);
      setHasRefetchedAfterComplete(false);
    }
  }, [progress?.processingStatus]);

  // Refetch data when processing completes (only once)
  useEffect(() => {
    if (
      isProcessingComplete &&
      !hasRefetchedAfterComplete &&
      (progress?.processingStatus === "COMPLETED" ||
        progress?.processingStatus === "FAILED")
    ) {
      setHasRefetchedAfterComplete(true);

      // Check if there might be new places to fetch
      const currentPlaceCount = postResponse?.postPlaces?.length || 0;
      const totalExpected = progress?.summary?.total || 0;

      // Only refetch if we expect more places than currently shown
      if (
        totalExpected > currentPlaceCount ||
        progress?.processingStatus === "COMPLETED"
      ) {
        // Small delay to ensure backend has finished processing
        setTimeout(() => {
          console.log(
            `🔄 Refetching after processing complete. Current: ${currentPlaceCount}, Expected: ${totalExpected}`
          );
          refetch();
        }, 1000);
      }
    }
  }, [
    isProcessingComplete,
    hasRefetchedAfterComplete,
    progress?.processingStatus,
    progress?.summary?.total,
    postResponse?.postPlaces?.length,
    refetch,
  ]);

  // Animate places as they become available
  useEffect(() => {
    if (postResponse?.postPlaces && progress) {
      const completedPlaces = postResponse.postPlaces.length;

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

  const handleEdit = async () => {
    // Store post data in localStorage untuk edit page
    await editPostAction(slug);
  };

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
                {/* PENDING: add back later */}
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={handleEdit}
                  size="sm"
                  startContent={<Edit3 className="w-4 h-4" />}
                >
                  Edit Post
                </Button>
                <Button
                  color="primary"
                  className="bg-[#EA7B26] text-white"
                  onPress={handlePublish}
                  startContent={<Globe className="w-4 h-4" />}
                  size="sm"
                >
                  Publish Post
                </Button>
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
        {postResponse.postPlaces
          .sort((a, b) => a.order - b.order)
          .map((postPlace, index) => (
            <div
              key={postPlace.id}
              className={`${getAnimatedItemClasses(animatedPlaces.has(index))}`}
              style={{
                transitionDelay: getAnimationDelay(index),
              }}
            >
              <ListCardItem
                key={postPlace.id}
                place={postPlace.place}
                postId={postResponse.id}
              />
            </div>
          ))}
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
