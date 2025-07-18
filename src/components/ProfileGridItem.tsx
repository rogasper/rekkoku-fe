"use client";
import { Card } from "@heroui/react";
import { BookmarkIcon, HeartIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { formatNumber } from "@/utils";

type ContentType = "post" | "like" | "bookmark" | "draft";

interface ProfileGridItemProps {
  title?: string;
  image?: string;
  likes?: number;
  bookmarks?: number;
  places?: number;
  type?: ContentType;
  location?: string;
  slug?: string;
}

const ProfileGridItem: React.FC<ProfileGridItemProps> = ({
  title = "Warung Sate Enak di Nologaten",
  image = "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
  likes = 100,
  bookmarks = 100,
  places = 7,
  type = "post",
  location = "Yogyakarta",
  slug,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (slug) {
      if (type === "draft") {
        router.push(`/review/${slug}`);
      } else {
        router.push(`/detail/${slug}`);
      }
    }
  };

  const getTypeIndicator = () => {
    switch (type) {
      case "like":
        return (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500/80 p-1 sm:p-1.5 rounded-full z-20 flex justify-center items-center">
            <HeartIcon
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
              fill="white"
            />
          </div>
        );
      case "bookmark":
        return (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-blue-500/80 p-1 sm:p-1.5 rounded-full z-20 flex justify-center items-center">
            <BookmarkIcon
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
              fill="white"
            />
          </div>
        );
      case "post":
        return (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 border flex items-center justify-center border-white/50 bg-[#EA7B26]/80 p-0.5 px-2 sm:p-1 sm:px-4 rounded-full z-20">
            <span className="text-[8px] sm:text-[10px] font-medium text-white">
              {places} places
            </span>
          </div>
        );
      case "draft":
        return (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-orange-500/90 px-1.5 py-0.5 sm:px-4 sm:py-1 rounded-full z-20 flex justify-center items-center">
            <span className="text-[8px] sm:text-[10px] font-medium text-white">
              DRAFT
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      isPressable={!!slug}
      className="border-none w-full aspect-square group cursor-pointer"
      radius="sm"
      onPress={handleClick}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            alt={title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            src={image}
            placeholder="empty"
            fill
          />
        </div>
        {getTypeIndicator()}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 z-10">
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
            <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <MapPinIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                <span className="text-white text-[10px] sm:text-xs truncate max-w-[50px] sm:max-w-none">
                  {location}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <HeartIcon
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                    fill="white"
                  />
                  <span className="text-white text-[10px] sm:text-xs">
                    {formatNumber(likes)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <BookmarkIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  <span className="text-white text-[10px] sm:text-xs">
                    {formatNumber(bookmarks)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileGridItem;
