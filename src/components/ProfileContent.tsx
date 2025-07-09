"use client";
import React, { useState, useMemo } from "react";
import { Avatar, Button, Chip, Tab, Tabs } from "@heroui/react";
import { Bookmark, Heart, Send, FileText } from "lucide-react";
import ProfileGridItem from "./ProfileGridItem";
import DraftModal from "./DraftModal";
import {
  useUserByUsername,
  useUserStats,
  useMyPosts,
  useUserLikedPosts,
  useUserBookmarkedPosts,
  useMyDraftPosts,
  useUserPosts,
} from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

interface ProfileContentProps {
  username: string;
}

const ProfileContent = ({ username }: ProfileContentProps) => {
  const [selectedTab, setSelectedTab] = useState("posts");
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const { user: currentUser } = useAuth();

  // Get user profile by username
  const { data: userProfile, isLoading: isUserLoading } =
    useUserByUsername(username);

  const userId = userProfile?.data?.id;
  const isOwnProfile = currentUser?.userId === userId;

  // Get user stats
  const { data: userStats, isLoading: isStatsLoading } = useUserStats(
    userId || ""
  );

  // Get user posts - use different hooks based on profile ownership
  const { data: myPostsData, isLoading: isMyPostsLoading } = useMyPosts(
    isOwnProfile ? { status: "PUBLISHED" } : undefined
  );

  const { data: userPostsData, isLoading: isUserPostsLoading } = useUserPosts(
    userId || "",
    !isOwnProfile && !!userId ? { status: "PUBLISHED" } : undefined
  );

  // Get draft posts (only for own profile)
  const { data: draftPosts } = useMyDraftPosts(isOwnProfile ? {} : undefined);

  // Get user liked posts
  const {
    data: likedPosts,
    isLoading: isLikedLoading,
    fetchNextPage: fetchNextLiked,
    hasNextPage: hasNextLiked,
    isFetchingNextPage: isFetchingNextLiked,
  } = useUserLikedPosts(userId || "");

  // Get user bookmarked posts
  const {
    data: bookmarkedPosts,
    isLoading: isBookmarkedLoading,
    fetchNextPage: fetchNextBookmarked,
    hasNextPage: hasNextBookmarked,
    isFetchingNextPage: isFetchingNextBookmarked,
  } = useUserBookmarkedPosts(userId || "");

  // Transform data for rendering
  const allMyPosts = useMemo(() => {
    if (isOwnProfile) {
      return myPostsData?.data || [];
    } else {
      return userPostsData?.data || [];
    }
  }, [myPostsData, userPostsData, isOwnProfile]);

  const allLikedPosts = useMemo(() => {
    if (!likedPosts?.pages) return [];
    return likedPosts.pages.flatMap((page) => page.data || []);
  }, [likedPosts]);

  const allBookmarkedPosts = useMemo(() => {
    if (!bookmarkedPosts?.pages) return [];
    return bookmarkedPosts.pages.flatMap((page) => page.data || []);
  }, [bookmarkedPosts]);

  const draftsCount = draftPosts?.data?.length || 0;

  console.log("posts:", allMyPosts);

  const renderContent = () => {
    switch (selectedTab) {
      case "posts":
        const isPostsLoading = isOwnProfile
          ? isMyPostsLoading
          : isUserPostsLoading;

        if (isPostsLoading) {
          return (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          );
        }

        // Filter out drafts from published posts
        const publishedPosts = allMyPosts.filter(
          (post: any) => post.status === "PUBLISHED"
        );

        return (
          <>
            {/* Draft card at top-left for own profile */}
            {isOwnProfile && draftsCount > 0 && (
              <div
                className="relative aspect-square cursor-pointer group"
                onClick={() => setIsDraftModalOpen(true)}
              >
                {/* Stacked effect for multiple drafts - simplified for mobile */}
                {draftsCount > 1 && (
                  <>
                    <div className="absolute inset-0 bg-gray-300 rounded-lg transform rotate-1 sm:rotate-2 scale-95 sm:scale-95 z-0"></div>
                    <div className="absolute inset-0 bg-gray-200 rounded-lg transform rotate-0 sm:rotate-1 scale-98 sm:scale-97 z-1"></div>
                  </>
                )}

                {/* Main draft card */}
                <div className="relative w-full h-full rounded-lg overflow-hidden z-10 border-2 border-orange-300">
                  {/* Draft image or placeholder */}
                  <div className="absolute inset-0">
                    {draftPosts?.data?.[0]?.postPlaces?.[0]?.place?.image ? (
                      <img
                        src={draftPosts.data[0].postPlaces[0].place.image}
                        alt={draftPosts.data[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Overlay content */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="absolute top-2 right-2 bg-orange-500/90 px-4 py-1 rounded-full z-20 flex justify-center items-center">
                      <span className="text-[10px] font-medium text-white">
                        DRAFT
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                      <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-1 mb-1">
                        {draftPosts?.data?.[0]?.title || "Untitled Draft"}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          <span className="text-white text-[10px] sm:text-xs">
                            {draftsCount} Draft{draftsCount > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="text-white text-[10px] sm:text-xs truncate max-w-[60px] sm:max-w-none">
                          {draftPosts?.data?.[0]?.city?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Published posts */}
            {publishedPosts.length === 0 &&
            (!isOwnProfile || draftsCount === 0) ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No posts yet</p>
              </div>
            ) : (
              publishedPosts.map((post: any) => (
                <ProfileGridItem
                  key={post.id}
                  title={post.title}
                  image={
                    post.postPlaces?.[0]?.place?.image || "/placeholder.jpg"
                  }
                  likes={post.likeCount || 0}
                  bookmarks={post.bookmarksCount || 0}
                  places={post._count?.postPlaces || 0}
                  location={post.city?.name || "Unknown"}
                  type="post"
                  slug={post.slug}
                />
              ))
            )}
          </>
        );

      case "tastes":
        if (isLikedLoading) {
          return (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          );
        }

        if (allLikedPosts.length === 0) {
          return (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No liked posts yet</p>
            </div>
          );
        }

        return allLikedPosts.map((post: any) => (
          <ProfileGridItem
            key={post.id}
            title={post.title}
            image={post.postPlaces?.[0]?.place?.image || "/placeholder.jpg"}
            likes={post.likeCount || 0}
            bookmarks={post.bookmarksCount || 0}
            places={post._count?.postPlaces || 0}
            location={post.city?.name || "Unknown"}
            type="like"
            slug={post.slug}
          />
        ));

      case "bookmarks":
        if (isBookmarkedLoading) {
          return (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          );
        }

        if (allBookmarkedPosts.length === 0) {
          return (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No bookmarked posts yet</p>
            </div>
          );
        }

        return allBookmarkedPosts.map((post: any) => (
          <ProfileGridItem
            key={post.id}
            title={post.title}
            image={post.postPlaces?.[0]?.place?.image || "/placeholder.jpg"}
            likes={post.likeCount || 0}
            bookmarks={post.bookmarksCount || 0}
            places={post._count?.postPlaces || 0}
            location={post.city?.name || "Unknown"}
            type="bookmark"
            slug={post.slug}
          />
        ));

      default:
        return null;
    }
  };

  if (isUserLoading) {
    return (
      <main className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
        <div className="flex flex-col gap-4 pb-10">
          <div className="flex flex-col items-center gap-2 p-10 pb-4">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!userProfile?.data) {
    return (
      <main className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-gray-800">User not found</h1>
          <p className="text-gray-500 mt-2">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </main>
    );
  }

  const user = userProfile.data;
  const stats = userStats?.data || {};

  return (
    <>
      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 min-h-screen">
        <div className="flex flex-col gap-4 pb-10">
          {/* User Info */}
          <div className="flex flex-col items-center gap-2 p-6 sm:p-10 pb-4">
            <Avatar
              src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-center">
              {user.name || "Unknown User"}
            </h1>
            <Chip className="bg-gray-100 text-gray-500 text-sm">
              @{user.username}
            </Chip>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
              {/* You can add bio from user details later */}
              Welcome to my profile!
            </p>
          </div>

          {/* User Stats */}
          <div className="flex justify-evenly gap-4 sm:gap-10 px-4">
            <div className="flex flex-col gap-1 sm:gap-2 items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <Send className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base font-medium">
                  {isStatsLoading ? "-" : stats.postsCount || 0}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Posts</span>
            </div>
            <div className="flex flex-col gap-1 sm:gap-2 items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base font-medium">
                  {isStatsLoading ? "-" : stats.likedPostsCount || 0}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Tastes</span>
            </div>
            <div className="flex flex-col gap-1 sm:gap-2 items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <Bookmark className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base font-medium">
                  {isStatsLoading ? "-" : stats.bookmarkedPostsCount || 0}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Saved</span>
            </div>
          </div>

          {/* Button edit profile and share profile */}
          <div className="flex gap-2 justify-center px-4">
            {isOwnProfile ? (
              <Button
                variant="bordered"
                className="bg-gray-100 text-sm flex-1 max-w-[120px]"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="bordered"
                className="bg-gray-100 text-sm flex-1 max-w-[120px]"
              >
                Follow
              </Button>
            )}
            <Button
              variant="bordered"
              className="bg-gray-100 text-sm flex-1 max-w-[120px]"
            >
              Share Profile
            </Button>
          </div>

          {/* Tabs */}
          <div className="pt-4 px-2 sm:px-0">
            <Tabs
              aria-label="Options"
              variant="bordered"
              fullWidth
              size="md"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key.toString())}
              classNames={{
                tabContent: "text-gray-500 text-sm sm:text-base",
                tab: "text-gray-500 py-2 sm:py-3",
                tabList: "bg-gray-100",
              }}
            >
              <Tab key="posts" title="Posts" />
              <Tab key="tastes" title="Tastes" />
              <Tab key="bookmarks" title="Bookmarks" />
            </Tabs>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-0">
            {renderContent()}
          </div>

          {/* Load More Buttons */}
          {((selectedTab === "tastes" && hasNextLiked) ||
            (selectedTab === "bookmarks" && hasNextBookmarked)) && (
            <div className="flex justify-center pt-4">
              <Button
                variant="bordered"
                onClick={() => {
                  if (selectedTab === "tastes") fetchNextLiked();
                  else if (selectedTab === "bookmarks") fetchNextBookmarked();
                }}
                disabled={isFetchingNextLiked || isFetchingNextBookmarked}
              >
                {isFetchingNextLiked || isFetchingNextBookmarked
                  ? "Loading..."
                  : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Draft Modal */}
      <DraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
      />
    </>
  );
};

export default ProfileContent;
