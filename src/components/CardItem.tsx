"use client";
import { useBookmarkPost, useLikePost } from "@/hooks/useApi";
import { Post } from "@/types/api";
import { capitalizeWords } from "@/utils/strings";
import { Card, CardFooter, Image } from "@heroui/react";
import { BookmarkIcon, HeartIcon, MapPinIcon, Share2Icon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface CardItemProps {
  post: Post;
}

const CardItem: React.FC<CardItemProps> = ({ post }) => {
  const router = useRouter();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: bookmarkPost } = useBookmarkPost();
  const { withAuth } = useAuthGuard();

  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    withAuth(() => {
      // Instagram-style like animation
      setIsLikeAnimating(true);

      // Show floating heart effect
      if (!post.isLiked) {
        setShowFloatingHeart(true);
        setTimeout(() => setShowFloatingHeart(false), 1000);
      }

      setTimeout(() => setIsLikeAnimating(false), 400);

      likePost(post.id);
    });
  };

  const handleBookmarkPost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    withAuth(() => {
      // Simple bookmark animation
      setIsBookmarkAnimating(true);
      setTimeout(() => setIsBookmarkAnimating(false), 300);

      bookmarkPost(post.id);
    });
  };

  const handleSharePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `/detail/${post.slug}`;
    navigator.share({
      title: post.title,
      text: post.user.username,
      url: url,
    });
  };

  return (
    <Card
      isFooterBlurred
      className="border-none w-[calc(100vw-2rem)] sm:w-[400px] mx-auto h-[450px] sm:h-[560px]  group"
      radius="lg"
    >
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => router.push(`/detail/${post.slug}`)}
      >
        <Image
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          height={600}
          width={400}
          src={
            post.postPlaces[0]?.place?.image ||
            "https://i.pravatar.cc/150?u=a042581f4e29026704d"
          }
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent z-10">
          <h3 className="text-white text-left text-2xl font-bold z-10 pt-12 px-4">
            {post.title}
          </h3>
        </div>
        <div className="absolute top-0 right-0 z-10 p-4 flex justify-between gap-2 w-full">
          <div className="text-tiny text-white bg-[#EA7B26]/80  border-white/20 border-1 shadow-small py-1 px-4 rounded-2xl">
            {capitalizeWords(post.city.name)}
          </div>
          <div className="flex gap-2">
            <div className="text-tiny text-white bg-[#EA7B26]/80  border-white/20 border-1 shadow-small py-1 px-4 rounded-2xl">
              {post._count?.postPlaces} Places
            </div>
            {post.distanceKm && (
              <div className="text-tiny text-white bg-[#EA7B26]/80  border-white/20 border-1 shadow-small py-1 px-4 rounded-2xl">
                {post.distanceKm} km
              </div>
            )}
          </div>
        </div>
      </div>
      <CardFooter className=" border-white/20 border-1  p-4 absolute  rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center flex-col ">
        <div className="flex pb-2 gap-2 w-full justify-between">
          <div
            className="text-tiny text-white bg-[#EA7B26]/80 border-white/30 border-1 backdrop-blur-sm shadow-small flex items-center gap-2 py-1 p-2 rounded-2xl cursor-pointer w-fit"
            onClick={() => {
              withAuth(() => {
                router.push(`/u/${post.user.username}`);
              });
            }}
          >
            <Image
              alt={post.user.username}
              className="w-[20px] h-[20px]"
              height={20}
              src={post.user.avatar}
              width={20}
            />
            <span className="text-white text-sm">{post.user.username}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 items-center relative">
              {/* Floating heart animation */}
              {showFloatingHeart && (
                <HeartIcon
                  className="absolute w-6 h-6 text-[#EA7B26] fill-[#EA7B26] pointer-events-none animate-[float_1s_ease-out_forwards] -top-2 left-0"
                  style={{
                    animation: "float 1s ease-out forwards",
                  }}
                />
              )}

              <HeartIcon
                className={`w-5 h-5 cursor-pointer transition-all duration-200 ease-out hover:scale-110 ${
                  post.isLiked
                    ? "text-[#EA7B26] fill-[#EA7B26]"
                    : "text-white fill-none hover:text-[#EA7B26]"
                } ${isLikeAnimating ? "animate-[heartPop_0.4s_ease-out]" : ""}`}
                onClick={handleLikePost}
              />
              <span
                className={`text-sm text-white transition-all duration-200 ${
                  isLikeAnimating ? "animate-pulse" : ""
                }`}
              >
                {post.likeCount}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <BookmarkIcon
                className={`w-5 h-5 cursor-pointer transition-all duration-200 ease-out hover:scale-110 ${
                  post.isBookmarked
                    ? "text-white fill-white"
                    : "text-white fill-none hover:text-gray-200"
                } ${
                  isBookmarkAnimating
                    ? "animate-[bookmarkPop_0.3s_ease-out]"
                    : ""
                }`}
                onClick={handleBookmarkPost}
              />
              <span
                className={`text-sm text-white transition-all duration-200 ${
                  isBookmarkAnimating ? "animate-pulse" : ""
                }`}
              >
                {post.bookmarksCount}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Share2Icon
                className={`w-5 h-5 cursor-pointer transition-all duration-200 ease-out hover:scale-110 text-white fill-white`}
                onClick={handleSharePost}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <MapPinIcon className="w-3 h-3 text-white" />
              <span className="text-tiny text-white">
                {post.postPlaces[0]?.place?.title?.split("·")[0] ||
                  post.postPlaces[0]?.place?.title}
              </span>
            </div>
            {post.postPlaces[1] && (
              <div className="flex gap-1 items-center">
                <MapPinIcon className="w-3 h-3 text-white" />
                <span className="text-tiny text-white">
                  {post.postPlaces[1]?.place?.title?.split("·")[0] ||
                    post.postPlaces[1]?.place?.title}
                </span>
              </div>
            )}
            {post._count?.postPlaces && post._count?.postPlaces > 2 && (
              <div className="flex gap-1 items-center ml-4">
                <span className="text-tiny text-white">
                  + {post._count?.postPlaces - 2} More
                </span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
