import { Post } from "@/types/api";
import { Button, Card, CardBody } from "@heroui/react";
import { Bookmark, Heart, Share } from "lucide-react";
import React, { useState } from "react";
import { useBookmarkPost, useLikePost } from "@/hooks/useApi";

interface DockingFloatProps {
  post: Post;
}

const DockingFloat = ({ post }: DockingFloatProps) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);

  // Use the same mutation hooks as CardItem for consistency
  const { mutate: likePost } = useLikePost();
  const { mutate: bookmarkPost } = useBookmarkPost();

  console.log("post:", post);

  const handleLikePost = () => {
    // Instagram-style like animation
    setIsLikeAnimating(true);

    // Show floating heart effect
    if (!post.isLiked) {
      setShowFloatingHeart(true);
      setTimeout(() => setShowFloatingHeart(false), 1000);
    }

    setTimeout(() => setIsLikeAnimating(false), 400);

    // Use the same mutation as CardItem
    likePost(post.id);
  };

  const handleBookmarkPost = () => {
    // Simple bookmark animation
    setIsBookmarkAnimating(true);
    setTimeout(() => setIsBookmarkAnimating(false), 300);

    // Use the same mutation as CardItem
    bookmarkPost(post.id);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="shadow-lg backdrop-blur-sm bg-white/90 border-gray-200 border-1">
        <CardBody className="p-2">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              variant="light"
              size="sm"
              className="flex items-center gap-2 relative hover:bg-orange-50 transition-colors duration-200"
              onPress={handleLikePost}
            >
              {/* Floating heart animation */}
              {showFloatingHeart && (
                <Heart
                  className="absolute w-5 h-5 text-[#EA7B26] fill-[#EA7B26] pointer-events-none animate-[float_1s_ease-out_forwards] -top-1 left-1"
                  style={{
                    animation: "float 1s ease-out forwards",
                  }}
                />
              )}

              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  post.isLiked
                    ? "text-[#EA7B26] fill-[#EA7B26]"
                    : "text-gray-600 fill-none hover:text-[#EA7B26]"
                } ${isLikeAnimating ? "animate-[heartPop_0.4s_ease-out]" : ""}`}
              />
              <span
                className={`text-sm transition-all duration-200 ${
                  post.isLiked ? "text-[#EA7B26]" : "text-gray-600"
                } ${isLikeAnimating ? "animate-pulse" : ""}`}
              >
                {post.likeCount}
              </span>
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="light"
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 transition-colors duration-200"
              onPress={handleBookmarkPost}
            >
              <Bookmark
                className={`w-4 h-4 transition-all duration-200 ${
                  post.isBookmarked
                    ? "text-blue-600 fill-blue-600"
                    : "text-gray-600 fill-none hover:text-blue-600"
                } ${
                  isBookmarkAnimating
                    ? "animate-[bookmarkPop_0.3s_ease-out]"
                    : ""
                }`}
              />
              <span
                className={`text-sm transition-all duration-200 ${
                  post.isBookmarked ? "text-blue-600" : "text-gray-600"
                } ${isBookmarkAnimating ? "animate-pulse" : ""}`}
              >
                {post.bookmarksCount}
              </span>
            </Button>

            {/* Share Button */}
            <Button
              variant="light"
              size="sm"
              className="hover:bg-green-50 transition-colors duration-200"
              onPress={() => {
                navigator.share({
                  title: post.title,
                  text: post.title,
                  url: `${window.location.origin}/detail/${post.slug}`,
                });
              }}
            >
              <Share className="w-4 h-4 text-gray-600 hover:text-green-600 transition-colors duration-200" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DockingFloat;
