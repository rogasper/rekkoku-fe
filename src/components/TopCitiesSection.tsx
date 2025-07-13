"use client";
import { useTopCities } from "@/hooks/useApi";
import { Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { MapPin, FileText, Heart, Crown, Medal, Award } from "lucide-react";
import Link from "next/link";

interface TopCity {
  id: string;
  name: string;
  province: string;
  totalPosts: number;
  totalLikes: number;
  rank: number;
}

interface TopCitiesSectionProps {
  limit?: number;
}

export default function TopCitiesSection({ limit = 5 }: TopCitiesSectionProps) {
  const { data: topCities, isLoading, error } = useTopCities(limit);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 text-center font-bold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "warning";
      case 2:
        return "default";
      case 3:
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Cities</h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="rounded-full w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Cities</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load top cities</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-[#EA7B26]" />
          <h2 className="text-xl font-bold">Top Cities</h2>
        </div>

        <div className="space-y-4">
          {topCities?.data?.map((city: TopCity) => (
            <div
              key={city.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(city.rank)}
              </div>

              {/* City Icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EA7B26]/20 to-[#EA7B26]/40 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#EA7B26]" />
              </div>

              {/* City Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {city.name}
                  </h3>
                  {city.rank <= 3 && (
                    <Chip
                      size="sm"
                      color={getRankColor(city.rank)}
                      variant="flat"
                    >
                      #{city.rank}
                    </Chip>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{city.totalPosts}</span>
                  <span className="text-xs text-gray-400">posts</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">{city.totalLikes}</span>
                  <span className="text-xs text-gray-400">likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!topCities?.data || topCities.data.length === 0) && (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No cities with posts yet</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
