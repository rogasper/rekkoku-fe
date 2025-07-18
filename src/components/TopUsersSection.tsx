"use client";
import { useTopUsers } from "@/hooks/useApi";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Avatar, Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { Trophy, Heart, FileText, Crown, Medal, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { formatNumber } from "@/utils";

interface TopUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  totalLikes: number;
  totalPosts: number;
  rank: number;
}

interface TopUsersSectionProps {
  limit?: number;
}

export default function TopUsersSection({ limit = 5 }: TopUsersSectionProps) {
  const { data: topUsers, isLoading, error } = useTopUsers(limit);
  const { withAuth } = useAuthGuard();
  const router = useRouter();
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
            <Trophy className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Users This Month</h2>
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
            <Trophy className="w-6 h-6 text-[#EA7B26]" />
            <h2 className="text-xl font-bold">Top Users This Month</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load top users</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const handleUserClick = (username: string) => {
    withAuth(() => {
      router.push(`/u/${username}`);
    });
  };

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-[#EA7B26]" />
          <h2 className="text-xl font-bold">Top Users This Month</h2>
        </div>

        <div className="space-y-4">
          {topUsers?.data?.map((user: TopUser) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.username)}
              className="block hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <Avatar
                  src={user.avatar || undefined}
                  name={user.name}
                  size="lg"
                  className="ring-2 ring-[#EA7B26]/20 sm:w-12 sm:h-12 w-10 h-10"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate sm:text-lg text-sm">
                      {user.name}
                    </h3>
                    {user.rank <= 3 && (
                      <Chip
                        size="sm"
                        color={getRankColor(user.rank)}
                        variant="flat"
                      >
                        #{user.rank}
                      </Chip>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-1 sm:text-base">
                    @{user.username}
                  </p>
                  <div className="flex flex-row sm:hidden gap-2 text-sm">
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">
                        {formatNumber(user.totalLikes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">
                        {formatNumber(user.totalPosts)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex sm:flex-row gap-2 text-sm">
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">
                      {formatNumber(user.totalLikes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">
                      {formatNumber(user.totalPosts)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!topUsers?.data || topUsers.data.length === 0) && (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No top users yet this month</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
