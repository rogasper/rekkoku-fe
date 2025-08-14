"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import {
  HomeIcon,
  BellIcon,
  MessageCircleIcon,
  BookmarkIcon,
  HeartIcon,
} from "lucide-react";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type NotificationType =
  | "LIKE_POST"
  | "BOOKMARK_POST"
  | "REVIEW_POST"
  | "REVIEW_PLACE";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  actor?: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
}

interface NotificationsResponse {
  data: Notification[];
}

const NotificationsContent = () => {
  const { data: notifications, isLoading, error } = useNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const markAsRead = useMarkNotificationAsRead();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleMarkAllAsRead = async () => {
    let previousData: NotificationsResponse | undefined;

    try {
      // Optimistic update
      previousData = queryClient.getQueryData<NotificationsResponse>(
        queryKeys.notifications.all
      );

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(
          queryKeys.notifications.all,
          {
            ...previousData,
            data: previousData.data.map((notification) => ({
              ...notification,
              read: true,
            })),
          }
        );
      }

      await markAllAsRead.mutateAsync();
    } catch (error) {
      // Revert optimistic update on error
      if (previousData) {
        queryClient.setQueryData(queryKeys.notifications.all, previousData);
      }
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleMarkAsRead = async (id: string, postSlug: string) => {
    let previousData: NotificationsResponse | undefined;

    try {
      // Optimistic update
      previousData = queryClient.getQueryData<NotificationsResponse>(
        queryKeys.notifications.all
      );

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(
          queryKeys.notifications.all,
          {
            ...previousData,
            data: previousData.data.map((notification) =>
              notification.id === id
                ? { ...notification, read: true }
                : notification
            ),
          }
        );
      }

      await markAsRead.mutateAsync(id);
      router.push(`/detail/${postSlug}`);
    } catch (error) {
      // Revert optimistic update on error
      if (previousData) {
        queryClient.setQueryData(queryKeys.notifications.all, previousData);
      }
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-8"
      >
        <BellIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Error Loading Notifications
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Something went wrong while loading your notifications.
        </p>
        <Button
          className="mt-4 bg-[#EA7B26] text-white shadow-lg hover:bg-[#d66a1f]"
          radius="full"
          size="lg"
          onPress={() => window.location.reload()}
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (!notifications?.data?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-8"
      >
        <BellIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          No Notifications
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          You don't have any notifications yet.
        </p>
        <Link href="/" className="mt-4">
          <Button
            className="bg-[#EA7B26] text-white shadow-lg hover:bg-[#d66a1f]"
            radius="full"
            size="lg"
            startContent={<HomeIcon size={18} />}
          >
            Back to Home
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          Notifications
        </motion.h1>
        <Button
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#EA7B26] transition-colors"
          variant="light"
          onPress={handleMarkAllAsRead}
          isLoading={markAllAsRead.isPending}
          isDisabled={notifications?.data?.every((n: Notification) => n.read)}
        >
          Mark all as read
        </Button>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {notifications?.data?.map(
            (notification: Notification, index: number) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900 border-[#EA7B26]"
                }`}
                onClick={() =>
                  !notification.read &&
                  handleMarkAsRead(notification.id, notification.post.slug)
                }
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {notification.actor?.avatar && (
                      <Image
                        src={notification.actor.avatar}
                        alt={notification.actor.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-[#EA7B26]/20"
                      />
                    )}
                    {!notification.read && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#EA7B26] ring-2 ring-white dark:ring-gray-900"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        notification.read
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-gray-900 dark:text-gray-100 font-medium"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {/* notification type icon */}
                  {notification.type === "REVIEW_POST" && (
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon
                        className={`w-4 h-4 ${
                          notification.read
                            ? "fill-gray-500 stroke-gray-500"
                            : "fill-[#EA7B26] stroke-[#EA7B26]"
                        }`}
                      />
                    </div>
                  )}
                  {notification.type === "REVIEW_PLACE" && (
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon
                        className={`w-4 h-4 ${
                          notification.read
                            ? "fill-gray-500 stroke-gray-500"
                            : "fill-[#EA7B26] stroke-[#EA7B26]"
                        }`}
                      />
                    </div>
                  )}
                  {notification.type === "BOOKMARK_POST" && (
                    <div className="flex items-center gap-2">
                      <BookmarkIcon
                        className={`w-4 h-4 ${
                          notification.read
                            ? "fill-gray-500 stroke-gray-500"
                            : "fill-[#EA7B26] stroke-[#EA7B26]"
                        }`}
                      />
                    </div>
                  )}
                  {notification.type === "LIKE_POST" && (
                    <div className="flex items-center gap-2">
                      <HeartIcon
                        className={`w-4 h-4 ${
                          notification.read
                            ? "fill-gray-500 stroke-gray-500"
                            : "fill-[#EA7B26] stroke-[#EA7B26]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          )}
        </div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <Link href="/">
          <Button
            className="bg-[#EA7B26] text-white shadow-lg hover:bg-[#d66a1f] font-medium transition-colors"
            radius="full"
            size="lg"
            startContent={<HomeIcon size={18} />}
          >
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotificationsContent;
