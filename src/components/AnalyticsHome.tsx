"use client";
import TopUsersSection from "@/components/TopUsersSection";
import TopPostsSection from "@/components/TopPostsSection";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { Suspense } from "react";

interface AnalyticsHomeProps {
  className?: string;
}

const SectionSkeleton = () => (
  <Card className="w-full">
    <CardBody className="p-4 sm:p-6">
      <Skeleton className="rounded-lg mb-4">
        <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
      </Skeleton>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="flex rounded-full w-10 h-10" />
            <div className="w-full flex flex-col space-y-2">
              <Skeleton className="h-4 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-2/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

export default function AnalyticsHome({ className = "" }: AnalyticsHomeProps) {
  return (
    <div
      className={`min-h-screen w-full mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 ${className}`}
    >
      {/* Main Content */}
      <div className="max-w-[1024px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="animate-in fade-in duration-500">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 ">
              <div className="w-full">
                <Suspense fallback={<SectionSkeleton />}>
                  <TopUsersSection limit={5} />
                </Suspense>
              </div>
              <div className="w-full">
                <Suspense fallback={<SectionSkeleton />}>
                  <TopPostsSection limit={5} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
