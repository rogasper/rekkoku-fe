"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  HomeIcon,
  SearchIcon,
  HeartIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import CreatePostModal from "./CreatePostModal";
import useUser from "@/store/useUser";
import { useNotificationCount } from "@/hooks/useApi";

interface BottomNavigationProps {
  isAuthenticated: boolean;
}

export default function BottomNavigation({
  isAuthenticated,
}: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { openLoginModal } = useAuthModal();
  const user = useUser((state) => state.user);
  const { data: notificationCount, isLoading: isNotificationCountLoading } =
    useNotificationCount(user?.username !== undefined);
  const handleNavigation = (
    path: string,
    requiresAuth: boolean = false,
    isCreate: boolean = false
  ) => {
    if (requiresAuth && !isAuthenticated) {
      openLoginModal();
      return;
    }

    if (isCreate) {
      setIsCreateModalOpen(true);
      return;
    }

    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const menuItems = [
    {
      icon: HomeIcon,
      path: "/",
      requiresAuth: false,
      isCreate: false,
    },
    {
      icon: SearchIcon,
      path: "/search",
      requiresAuth: false,
      isCreate: false,
    },
    {
      icon: PlusIcon,
      path: "/create",
      requiresAuth: true,
      isCreate: true,
    },
    {
      icon: HeartIcon,
      path: "/notifications",
      requiresAuth: true,
      isCreate: false,
    },
    {
      icon: UserIcon,
      path: user ? `/u/${user.username}` : "/profile",
      requiresAuth: true,
      isCreate: false,
    },
  ];

  if (
    pathname.startsWith("/detail") ||
    pathname.startsWith("/edit") ||
    pathname.startsWith("/review")
  ) {
    return null;
  }

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-700" />

        {/* Navigation Content */}
        <div className="relative px-4 py-2">
          <div className="flex items-center justify-around">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  isIconOnly
                  variant="light"
                  className={`flex flex-col items-center justify-center h-12 w-12 ${
                    active
                      ? "text-[#EA7B26]"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  onPress={() =>
                    handleNavigation(
                      item.path,
                      item.requiresAuth,
                      item.isCreate
                    )
                  }
                >
                  <Icon size={20} />
                  {item.path === "/notifications" &&
                    !isNotificationCountLoading &&
                    notificationCount?.data?.unread > 0 && (
                      <span className="absolute top-2 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount?.data?.unread || 0}
                      </span>
                    )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add bottom padding to main content when bottom nav is visible */}
      <div className="lg:hidden h-20" />

      {/* Create Post Modal - now uses the full form */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
