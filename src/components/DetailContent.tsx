"use client";

import React from "react";
import { Button, Divider, User, Image } from "@heroui/react";
import ListCardItem from "@/components/ListCardItem";
import { ArrowLeft, Clock, Edit3, Lock, Pencil } from "lucide-react";
import DockingFloat from "./DockingFloat";
import DetailContentSkeleton from "./DetailContentSkeleton";
import { usePostBySlug } from "@/hooks/useApi";
import { useRouter } from "nextjs-toploader/app";
import type { Post } from "@/types/api";
import { capitalizeWords, formatCurrencyIDR } from "@/utils/strings";
import { formatRelativeTime } from "@/utils/dates";
import { getDefaultPostImage } from "@/utils/ui";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface DetailContentProps {
  slug: string;
  isOwner: boolean;
}

const DetailContent = ({ slug, isOwner }: DetailContentProps) => {
  const router = useRouter();
  const { data, isLoading } = usePostBySlug(slug);
  const { withAuth } = useAuthGuard();

  if (isLoading) return <DetailContentSkeleton />;

  const postResponse = data?.data as Post;

  if (!postResponse) {
    return <div className="text-center py-8">Post not found</div>;
  }

  // Access Control: Check if post is published or user is owner
  const isPublished = postResponse.status === "PUBLISHED";

  if (!isPublished && !isOwner) {
    return (
      <div className="text-center py-16 px-6">
        <div className="max-w-md mx-auto">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Content Not Available
          </h2>
          <p className="text-gray-500 mb-6">
            This post is not published yet and cannot be accessed.
          </p>
          <Button
            variant="bordered"
            onPress={() => router.push("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/");
  };

  const handleEdit = () => {
    router.push(`/review/${slug}?from=review`);
  };

  return (
    <>
      {/* Draft Indicator - Only for owner viewing their draft */}
      {!isPublished && isOwner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 mx-6 md:mx-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-amber-800 font-medium text-sm">
              Draft Post - Only visible to you
            </span>
          </div>
        </div>
      )}

      {/* Header Image */}
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
        <div className="absolute top-4 left-4 right-4 z-11 flex gap-2 justify-between">
          {isOwner && (
            <Button
              variant="bordered"
              size="sm"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-fit flex sm:hidden sm:w-auto order-1 sm:order-2 rounded-full"
              onPress={handleEdit}
              isIconOnly
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="light"
            size="sm"
            className="hover:bg-orange-50 text-white text-lg"
            onPress={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
        <div className="absolute inset-0 bg-black/30 z-10 w-full h-full" />
        <div className="absolute bottom-6 left-6 right-6 z-11 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2 md:line-clamp-none">
            {postResponse.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {isOwner && (
              <Button
                variant="bordered"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full hidden sm:flex sm:w-auto order-1 sm:order-2 rounded-full"
                onPress={handleEdit}
                isIconOnly
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            <div className="before:bg-white/10 border-white/30 border-1 backdrop-blur-sm text-white shadow-small px-4 py-2 rounded-full md:w-1/4 justify-center items-center flex w-full sm:order-1 order-2 sm:w-auto">
              {postResponse.postPlaces.length} amazing places
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3 justify-between mb-6 w-full md:px-0 px-6">
        <User
          name={postResponse.user.name}
          description={`@${postResponse.user.username}`}
          avatarProps={{
            src: postResponse.user.avatar,
          }}
          onClick={() => {
            withAuth(() => {
              router.push(`/u/${postResponse.user.username}`);
            });
          }}
          className="cursor-pointer"
        />
        <div className="flex items-center text-sm text-gray-500 gap-3">
          <Clock className="w-4 h-4 mr-1" />
          {formatRelativeTime(postResponse.createdAt)}
          {typeof postResponse.budget === "number" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {formatCurrencyIDR(postResponse.budget)}
            </span>
          )}
        </div>
      </div>

      <Divider className="my-6" />

      {/* Description */}
      {postResponse.description && (
        <div className="mb-6 md:px-0 px-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {postResponse.description}
          </p>
        </div>
      )}

      <h2 className="sm:text-2xl text-xl font-bold my-6 md:px-0 px-6">
        Locations in {capitalizeWords(postResponse.city.altName)}
      </h2>
      <div className="flex flex-col gap-4 md:px-0 px-6">
        {postResponse.postPlaces
          .sort((a, b) => a.order - b.order)
          .map((postPlace) => (
            <ListCardItem
              key={postPlace.id}
              place={postPlace.place}
              postId={postResponse.id}
            />
          ))}
      </div>
      <DockingFloat post={postResponse} />
    </>
  );
};

export default DetailContent;
