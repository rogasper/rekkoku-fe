import React from "react";
import { Skeleton, Divider } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

const DetailContentSkeleton = () => {
  return (
    <>
      {/* Header Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-6 overflow-hidden">
        <Skeleton className="w-full h-full absolute top-0 left-0" />
        {/* Back Button Skeleton */}
        <div className="absolute top-4 left-4 z-11">
          <Skeleton className="w-28 h-10 rounded-lg" />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 z-10 w-full h-full" />
        {/* Title and Badge Skeleton */}
        <div className="absolute bottom-6 left-6 right-6 z-11 flex flex-col gap-2">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* User Info Skeleton */}
      <div className="flex items-center space-x-3 justify-between mb-6 w-full md:px-0 px-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="h-4 w-16 rounded" />
      </div>

      <Divider className="my-6" />

      {/* Location Title Skeleton */}
      <div className="md:px-0 px-6">
        <Skeleton className="h-8 w-24 rounded-lg mb-6" />
      </div>

      {/* Location Items Skeleton */}
      <div className="flex flex-col gap-4 md:px-0 px-6">
        {/* ListCardItem Skeleton 1 */}
        <div className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        </div>

        {/* ListCardItem Skeleton 2 */}
        <div className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
        </div>
      </div>

      {/* DockingFloat Skeleton */}
      <div className="fixed bottom-6 right-6 z-50">
        <Skeleton className="w-14 h-14 rounded-full" />
      </div>
    </>
  );
};

export default DetailContentSkeleton;
