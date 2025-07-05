"use client";
import { Card } from "@heroui/react";
import { BookmarkIcon, HeartIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type ContentType = "post" | "like" | "bookmark";

interface ProfileGridItemProps {
  title?: string;
  image?: string;
  likes?: number;
  bookmarks?: number;
  places?: number;
  type?: ContentType;
  location?: string;
}

const ProfileGridItem: React.FC<ProfileGridItemProps> = ({
  title = "Warung Sate Enak di Nologaten",
  image = "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
  likes = 100,
  bookmarks = 100,
  places = 7,
  type = "post",
  location = "Yogyakarta",
}) => {
  const getTypeIndicator = () => {
    switch (type) {
      case "like":
        return (
          <div className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full z-20">
            <HeartIcon className="w-3 h-3 text-white" fill="white" />
          </div>
        );
      case "bookmark":
        return (
          <div className="absolute top-2 right-2 bg-blue-500/80 p-1.5 rounded-full z-20">
            <BookmarkIcon className="w-3 h-3 text-white" fill="white" />
          </div>
        );
      case "post":
        return (
          <div className="absolute top-2 right-2 bg-[#EA7B26]/80 p-2 rounded-full z-20">
            <span className="text-[10px] font-medium text-white">{places}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      isPressable
      className="border-none w-full aspect-square group"
      radius="sm"
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
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-3 h-3 text-white" />
                <span className="text-white text-xs">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <HeartIcon className="w-3 h-3 text-white" fill="white" />
                  <span className="text-white text-xs">{likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookmarkIcon className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{bookmarks}</span>
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
