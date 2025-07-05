"use client";
import { Button, Card, CardFooter, Image, User } from "@heroui/react";
import { BookmarkIcon, HeartIcon, MapPinIcon } from "lucide-react";
import React from "react";

interface CardItemProps {
  title?: string;
  image?: string;
  places?: number;
  author?: {
    name: string;
    avatar: string;
  };
  location?: string;
  spots?: string[];
  likes?: number;
  bookmarks?: number;
}

const CardItem: React.FC<CardItemProps> = ({
  title = "Warung Sate Enak di Nologaten",
  image = "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
  places = 7,
  author = {
    name: "makanyuk",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  location = "Yogyakarta",
  spots = ["Sate Madura", "Sate Madura Pak Slamet"],
  likes = 100,
  bookmarks = 100,
}) => {
  return (
    <Card
      isPressable
      isFooterBlurred
      className="border-none w-[calc(100vw-2rem)] sm:w-[400px] mx-auto h-[476px] sm:h-[560px] group"
      radius="lg"
    >
      <div className="relative w-full h-full">
        <Image
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          height={600}
          width={400}
          src={image}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent z-10">
          <h3 className="text-white text-2xl font-bold z-10 pt-12 px-4">
            {title}
          </h3>
        </div>
        <div className="absolute top-0 right-0 z-10 p-4">
          <div className="text-tiny text-white before:bg-[#EA7B26]/80 border-[#EA7B26]/20 border-1 shadow-small py-1 px-4 rounded-2xl">
            {places} Places
          </div>
        </div>
      </div>
      <CardFooter className=" before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex flex-col">
        <div className="flex justify-between w-full py-2">
          <div className="text-tiny text-white bg-[#EA7B26]/80 flex items-center gap-2 py-2 px-4 rounded-2xl">
            <Image
              alt={author.name}
              className="w-[20px] h-[20px]"
              height={20}
              src={author.avatar}
              width={20}
            />
            <span className="text-white text-sm font-bold">{author.name}</span>
          </div>
          <div className="text-sm text-white bg-[#EA7B26]/80 py-2 px-4 rounded-2xl">
            {location}
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <MapPinIcon className="w-3 h-3 text-white" />
              <span className="text-tiny text-white">{spots[0]}</span>
            </div>
            {spots[1] && (
              <div className="flex gap-1 items-center">
                <MapPinIcon className="w-3 h-3 text-white" />
                <span className="text-tiny text-white">{spots[1]}</span>
              </div>
            )}
            {spots.length > 2 && (
              <div className="flex gap-1 items-center ml-4">
                <span className="text-tiny text-white">
                  + {spots.length - 2} More
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-col items-end">
            <div className="flex gap-1 items-center">
              <HeartIcon className="w-4 h-4 text-[#EA7B26]" fill="#EA7B26" />
              <span className="text-sm text-white">{likes}</span>
            </div>
            <div className="flex gap-1 items-center">
              <BookmarkIcon className="w-4 h-4 text-white" />
              <span className="text-sm text-white">{bookmarks}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
