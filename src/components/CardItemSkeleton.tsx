"use client";
import { Card, CardFooter, Skeleton } from "@heroui/react";
import React from "react";

const CardItemSkeleton: React.FC = () => {
  return (
    <Card
      className="border-none w-[calc(100vw-2rem)] sm:w-[400px] mx-auto h-[476px] sm:h-[560px]"
      radius="lg"
    >
      <div className="relative w-full h-full">
        {/* Main image skeleton */}
        <Skeleton className="w-full h-full rounded-lg">
          <div className="w-full h-full bg-default-200"></div>
        </Skeleton>

        {/* Title skeleton overlay */}
        <div className="absolute top-0 left-0 w-full z-10 pt-12 px-4">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-8 bg-default-300"></div>
          </Skeleton>
        </div>

        {/* Places badge skeleton */}
        <div className="absolute top-0 right-0 z-10 p-4">
          <Skeleton className="rounded-2xl">
            <div className="h-6 w-20 bg-default-300"></div>
          </Skeleton>
        </div>
      </div>

      <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex flex-col">
        {/* Author and location row skeleton */}
        <div className="flex justify-between w-full py-2">
          <div className="flex items-center gap-2">
            <Skeleton className="flex rounded-2xl">
              <div className="h-8 w-32 bg-default-300"></div>
            </Skeleton>
          </div>
          <Skeleton className="rounded-2xl">
            <div className="h-8 w-24 bg-default-300"></div>
          </Skeleton>
        </div>

        {/* Bottom section skeleton */}
        <div className="flex justify-between w-full">
          {/* Spots skeleton */}
          <div className="flex flex-col gap-1">
            <Skeleton className="rounded-lg">
              <div className="h-4 w-28 bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-4 w-32 bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg ml-4">
              <div className="h-4 w-20 bg-default-300"></div>
            </Skeleton>
          </div>

          {/* Likes and bookmarks skeleton */}
          <div className="flex gap-1 flex-col items-end">
            <Skeleton className="rounded-lg">
              <div className="h-5 w-12 bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-5 w-12 bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardItemSkeleton;
