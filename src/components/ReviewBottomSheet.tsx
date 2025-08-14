"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Avatar,
  addToast,
  Divider,
} from "@heroui/react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  useCreateReview,
  useReviews,
  useReviewStats,
  useProfile,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/useApi";
import { useAuthGuard } from "@/hooks/useAuthGuard";

type ReviewScope = { postId?: string; placeId?: string };

export default function ReviewBottomSheet({
  isOpen,
  onOpenChange,
  scope,
  header,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scope: ReviewScope;
  header?: { title: string; image?: string };
}) {
  const { data: profile } = useProfile();
  const { data: reviewsResp, isLoading } = useReviews(scope);
  const { data: statsResp } = useReviewStats(scope);
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();
  const { withAuth } = useAuthGuard();
  const myUserId = profile?.data?.id;
  const isLoggedIn = !!myUserId;
  const myReview = useMemo(() => {
    const list = (reviewsResp?.data as any[]) || [];
    return list.find((r) => r.userId === myUserId);
  }, [reviewsResp?.data, myUserId]);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(
    myReview?.id || ""
  );
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const reviews = reviewsResp?.data || [];
  const stats = statsResp?.data as
    | {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: Record<number, number>;
      }
    | undefined;

  const title = header?.title || "Reviews";
  const image = header?.image;

  const canSubmit = rating >= 1 && rating <= 5;

  const handleSubmit = () => {
    withAuth(() => {
      const payload = {
        ...scope,
        rating,
        comment: comment?.trim() || undefined,
      } as any;
      if (myReview?.id) {
        updateReview(payload, {
          onSuccess: () => {
            addToast({ title: "Review updated", color: "success" });
          },
          onError: (err: any) => {
            addToast({
              title: "Failed",
              description: err?.response?.data?.message || err.message,
              color: "danger",
            });
          },
        });
      } else {
        createReview(payload, {
          onSuccess: () => {
            addToast({ title: "Review submitted", color: "success" });
            setRating(0);
            setComment("");
          },
          onError: (err: any) => {
            addToast({
              title: "Failed",
              description: err?.response?.data?.message || err.message,
              color: "danger",
            });
          },
        });
      }
    });
  };

  const handleDelete = () => {
    if (!myReview?.id) return;
    withAuth(() => {
      deleteReview(
        { id: myReview.id, postId: scope.postId, placeId: scope.placeId },
        {
          onSuccess: () => {
            addToast({ title: "Review deleted", color: "success" });
            setRating(0);
            setComment("");
          },
          onError: (err: any) => {
            addToast({
              title: "Failed",
              description: err?.response?.data?.message || err.message,
              color: "danger",
            });
          },
        }
      );
    });
  };

  // Prefill when opening and user has a review
  React.useEffect(() => {
    if (isOpen && myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment || "");
    }
  }, [isOpen, myReview]);

  // Default edit mode: if user doesn't have a review, show input. If has, hide input until Edit clicked
  React.useEffect(() => {
    if (!isOpen) return;
    setIsEditing(isLoggedIn ? !myReview : false);
  }, [isOpen, myReview, isLoggedIn]);

  const headerSticky = (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-3 p-3">
        {image && (
          <Image
            src={image}
            alt={title}
            width={48}
            height={48}
            className="rounded object-cover w-12 h-12"
          />
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-base line-clamp-1">{title}</span>
          {stats && (
            <span className="text-xs text-gray-500">
              {stats.totalReviews} reviews •{" "}
              {stats.averageRating?.toFixed(1) || "-"} ★
            </span>
          )}
        </div>
      </div>
      <Divider />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => onOpenChange(open)}
      placement="bottom"
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-end",
        base: "sm:max-w-3xl sm:max-h-[85vh] sm:rounded-xl",
      }}
      shouldBlockScroll={false}
    >
      <ModalContent>
        {(onClose) => (
          <div className="flex flex-col h-full">
            <ModalHeader className="py-3">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto" />
            </ModalHeader>
            {headerSticky}
            <ModalBody className="pt-3 pb-24">
              <div className="flex flex-col gap-4">
                {/* Write review (hidden if user already reviewed and not editing) */}
                {isLoggedIn && (!myReview || isEditing) && (
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile?.data?.avatar} size="sm" />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 cursor-pointer ${
                              i <= rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(i)}
                          />
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Share your thoughts..."
                      variant="bordered"
                      className="mt-3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      minRows={2}
                    />
                    <div className="flex justify-end mt-2">
                      {myReview?.id && (
                        <Button
                          color="default"
                          variant="light"
                          onPress={() => setIsEditing(false)}
                          className="mr-2"
                        >
                          Cancel
                        </Button>
                      )}
                      {myReview?.id && (
                        <Button
                          color="danger"
                          variant="light"
                          onPress={handleDelete}
                          isLoading={isDeleting}
                          className="mr-2"
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        color="primary"
                        className="bg-[#EA7B26] text-white"
                        isDisabled={!canSubmit}
                        isLoading={myReview?.id ? isUpdating : isSubmitting}
                        onPress={handleSubmit}
                      >
                        {myReview?.id ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </div>
                )}

                {!isLoggedIn && (
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Sign in to write a review
                    </div>
                    <Button
                      color="primary"
                      className="bg-[#EA7B26] text-white"
                      onPress={() => {
                        // Trigger login flow without noisy console error
                        withAuth(() => undefined);
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}

                {/* Reviews list */}
                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">
                      Loading reviews...
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-sm text-gray-500">No reviews yet</div>
                  ) : (
                    reviews.map((r: any) => (
                      <div key={r.id} className="flex gap-3">
                        <Avatar src={r.user?.avatar} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                @{r.user?.username || "user"}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i <= r.rating
                                        ? "text-amber-500 fill-amber-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {r.userId === myUserId && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="light"
                                  onPress={() => setIsEditing(true)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onPress={handleDelete}
                                  isLoading={isDeleting}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                          {r.comment && (
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                              {r.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
