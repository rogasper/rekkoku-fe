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
} from "lucide-react";
import DetailContentSkeleton from "./DetailContentSkeleton";
import {
  usePostBySlug,
  useProgressPost,
  useUpdatePostStatus,
} from "@/hooks/useApi";
import { useRouter } from "next/navigation";
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

interface ReviewContentProps {
  slug: string;
}

interface ProgressData {
  postId: string;
  processingStatus: string;
  pendingLinks: {
    order: number;
    gmapsLink: string;
  }[];
}

const ReviewContent = ({ slug }: ReviewContentProps) => {
  const router = useRouter();
  const { data, isLoading } = usePostBySlug(slug);
  const [animatedPlaces, setAnimatedPlaces] = useState<Set<number>>(new Set());

  const postResponse = data?.data as Post;
  const postId = postResponse?.id;

  // Watch progress for the post
  const { data: progressData, isLoading: isLoadingProgress } =
    useProgressPost(postId);

  const { mutate: updatePostStatus } = useUpdatePostStatus(postId);

  const progress = progressData?.data as ProgressData;

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

  // Calculate progress using shared utility
  const isCompleted = isProcessingCompleted(progress?.processingStatus || "");
  const totalLinks =
    (progress?.pendingLinks?.length || 0) +
    (postResponse?.postPlaces?.length || 0);
  const completedLinks = postResponse?.postPlaces?.length || 0;
  const progressPercentage = calculateProgress(completedLinks, totalLinks);

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
          className="hover:bg-orange-50 absolute top-4 left-4 z-11 text-white text-lg"
          onPress={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>
        <div className="absolute inset-0 bg-black/30 z-10 w-full h-full" />
        <div className="absolute bottom-6 left-6 right-6 z-11 flex flex-col gap-2">
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
            </span>
          </div>
          <Progress
            value={progressPercentage}
            color="warning"
            className="mb-4"
            size="md"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {isCompleted
                ? "All places processed!"
                : "Scraping place details..."}
            </span>
            {isCompleted && (
              <Button
                color="primary"
                className="bg-[#EA7B26] text-white"
                onPress={handlePublish}
                startContent={<Globe className="w-4 h-4" />}
              >
                Publish Post
              </Button>
            )}
          </div>
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
              className={getAnimatedItemClasses(animatedPlaces.has(index))}
              style={{
                transitionDelay: getAnimationDelay(index),
              }}
            >
              <ListCardItem place={postPlace.place} postId={postResponse.id} />
            </div>
          ))}
      </div>

      {/* Pending Places */}
      {progress?.pendingLinks && progress.pendingLinks.length > 0 && (
        <div className="flex flex-col gap-4 md:px-0 px-6 mt-4">
          {progress.pendingLinks
            .sort((a, b) => a.order - b.order)
            .map((pendingLink, index) => (
              <Card key={`pending-${index}`} className="opacity-50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    <div>
                      <p className="font-medium">
                        Processing place {pendingLink.order}...
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
