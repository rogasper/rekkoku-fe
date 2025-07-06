"use client";

import React from "react";
import { Button, Divider, User, Image } from "@heroui/react";
import ListCardItem from "@/components/ListCardItem";
import { ArrowLeft, Clock } from "lucide-react";
import DockingFloat from "./DockingFloat";
import DetailContentSkeleton from "./DetailContentSkeleton";
import { useBookmarkPost, useLikePost, usePostBySlug } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import type { Post, PostDetailResponse } from "@/types/api";
import { capitalizeWords } from "@/utils/strings";
import { formatRelativeTime } from "@/utils/dates";
import { getDefaultPostImage } from "@/utils/ui";

interface DetailContentProps {
  slug: string;
}

const DetailContent = ({ slug }: DetailContentProps) => {
  const router = useRouter();
  const { data, isLoading } = usePostBySlug(slug);

  if (isLoading) return <DetailContentSkeleton />;

  const postResponse = data?.data as Post;

  if (!postResponse) {
    return <div className="text-center py-8">Post not found</div>;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <>
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
            {postResponse.postPlaces.length} amazing places
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
