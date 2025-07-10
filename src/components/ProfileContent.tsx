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
              {user.userDetail?.bio || "No bio yet"}
            </p>
            <div className="flex flex-wrap gap-2">
              {user.userDetail?.socialLinks?.map((link: any) => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
                  >
                    {link.platform === "instagram" && (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        {link.username || "Instagram"}
                      </>
                    )}
                    {link.platform === "tiktok" && (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.49v-3.88a4.85 4.85 0 01-1.2 0z" />
                        </svg>
                        {link.username || "TikTok"}
                      </>
                    )}
                    {link.platform === "website" && (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21.41 8.64v-.05a10 10 0 0 0-18.78 0v.05a9.86 9.86 0 0 0 0 6.72v.05a10 10 0 0 0 18.78 0v-.05a9.86 9.86 0 0 0 0-6.72ZM4.26 14a7.82 7.82 0 0 1 0-4h1.86a16.73 16.73 0 0 0 0 4Zm.82 2h1.4a12.15 12.15 0 0 0 1 2.57A8 8 0 0 1 5.08 16Zm1.4-8H5.08a8 8 0 0 1 2.32-2.57A12.15 12.15 0 0 0 6.48 8ZM11 19.7A6.34 6.34 0 0 1 8.57 16H11Zm0-5.7H8.14a14.36 14.36 0 0 1 0-4H11Zm0-6H8.57A6.34 6.34 0 0 1 11 4.3Zm7.92 0h-1.4a12.15 12.15 0 0 0-1-2.57A8 8 0 0 1 18.92 8ZM13 4.3A6.34 6.34 0 0 1 15.43 8H13Zm0 15.4V16h2.43A6.34 6.34 0 0 1 13 19.7Zm2.86-5.7H13v-4h2.86a14.36 14.36 0 0 1 0 4Zm.69 4.57a12.15 12.15 0 0 0 1-2.57h1.4a8 8 0 0 1-2.4 2.57Zm1.33-4.57a16.73 16.73 0 0 0 0-4h1.86a7.82 7.82 0 0 1 0 4Z" />
                        </svg>
                        Website
                      </>
                    )}
                  </a>
                </div>
              ))}
            </div>
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
