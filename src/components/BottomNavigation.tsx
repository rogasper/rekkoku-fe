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
import { useRouter, usePathname } from "next/navigation";
import { AuthSession } from "@/lib/auth";
import { useState } from "react";
import LoginModal from "./LoginModal";

interface BottomNavigationProps {
  user: AuthSession | null;
}

export default function BottomNavigation({ user }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleNavigation = (
    path: string,
    requiresAuth: boolean = false,
    isCreate: boolean = false
  ) => {
    if (requiresAuth && !user) {
      setIsLoginModalOpen(true);
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
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add bottom padding to main content when bottom nav is visible */}
      <div className="lg:hidden h-20" />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Create Modal - Simple placeholder for now */}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        backdrop="blur"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Post</ModalHeader>
              <ModalBody>
                <p>Create post functionality will be implemented here.</p>
                <p className="text-sm text-gray-500">
                  For now, use the desktop floating button to create posts.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
