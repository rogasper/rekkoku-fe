"use client";
import { useTopPosts } from "@/hooks/useApi";
import { Avatar, Card, CardBody, Chip, Skeleton, Tooltip } from "@heroui/react";
import {
  TrendingUp,
  Heart,
  Bookmark,
  MapPin,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { capitalizeWords } from "@/utils";

interface TopPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string | null;
  totalLikes: number;
  totalBookmarks: number;
  totalEngagement: number;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
  city: {
    id: string;
    name: string;
  } | null;
  rank: number;
}

interface TopPostsSectionProps {
  limit?: number;
}

export default function TopPostsSection({ limit = 5 }: TopPostsSectionProps) {
  const { data: topPosts, isLoading, error } = useTopPosts(limit);

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
            <TrendingUp className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Posts This Month</h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="rounded-lg w-20 h-20 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
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
            <TrendingUp className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Posts This Month</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load top posts</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#EA7B26]" />
          <h2 className="text-xl font-bold">Top Posts This Month</h2>
        </div>

        <div className="space-y-4">
          {topPosts?.data?.map((post: TopPost) => (
            <Link
              key={post.id}
              href={`/detail/${post.slug}`}
              className="block hover:scale-[1.02] transition-transform"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 flex-shrink-0">
                  {getRankIcon(post.rank)}
                </div>

                {/* Thumbnail */}
                <div className="relative w-24 h-24 sm:w-50 sm:h-50 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin className="w-5 h-5 sm:w-10 sm:h-10" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Tooltip content={post.title} placement="top">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-lg">
                        {post.title}
                      </h3>
                    </Tooltip>
                    {post.rank <= 3 && (
                      <Chip
                        size="sm"
                        color={getRankColor(post.rank)}
                        variant="flat"
                        className="flex-shrink-0 hidden sm:flex "
                      >
                        #{post.rank}
                      </Chip>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar
                      src={post.author.avatar || undefined}
                      name={post.author.name}
                      size="sm"
                      className="w-5 h-5 sm:w-8 sm:h-8"
                    />
                    <span className="text-xs sm:text-medium text-gray-600 truncate">
                      {post.author.username}
                    </span>
                  </div>

                  {/* Location */}
                  {post.city && (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-tiny sm:text-sm text-gray-500">
                        {capitalizeWords(post.city.name)}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{post.totalLikes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-500">
                      <Bookmark className="w-4 h-4" />
                      <span className="font-medium">{post.totalBookmarks}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">
                        {post.totalEngagement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!topPosts?.data || topPosts.data.length === 0) && (
          <div className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trending posts yet this month</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
