"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  User,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Image from "next/image";
import { useEffect } from "react";
import useUser from "@/store/useUser";
import { AuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";
import {
  BellDotIcon,
  InfoIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface FloatingNavbarProps {
  user: AuthSession | null;
}

export default function FloatingNavbar({ user }: FloatingNavbarProps) {
  const setUser = useUser((state) => state.setUser);
  const queryClient = useQueryClient();
  const { openLoginModal } = useAuthModal();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  const router = useRouter();

  const handleMenuAction = (key: string) => {
    switch (key) {
      case "profile":
        router.push(`/u/${user?.username}`);
        break;
      case "settings":
        router.push("/settings");
        break;
      case "about":
        router.push("/about");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => {
          return query.queryKey.includes("slug");
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Navbar className="shadow-md" shouldHideOnScroll>
        <NavbarBrand
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            className="dark:invert w-[51px] h-[45px]"
            src="/logo.svg"
            alt="Next.js logo"
            width={200}
            height={200}
            priority
          />
          <span className="sr-only">Rekkoku</span>
          <div>
            <h1 className="font-bold">Rekkoku</h1>
            <p className="text-xs">Share your taste!</p>
          </div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <div className="hidden lg:block">
            <Button
              onPress={() => router.push("/search")}
              className="bg-transparent hover:bg-transparent hover:text-white text-white font-semibold"
              variant="flat"
              radius="full"
              isIconOnly
            >
              <SearchIcon className="w-5 h-5" color="#EA7B26" />
            </Button>
            {user && (
              <Button
                onPress={() => router.push("/notifications")}
                className="bg-transparent hover:bg-transparent hover:text-white text-white font-semibold"
                variant="flat"
                radius="full"
                isIconOnly
              >
                <BellDotIcon className="w-5 h-5" color="#EA7B26" />
              </Button>
            )}
          </div>
          {user ? (
            <NavbarItem>
              {/* Desktop: Avatar with Dropdown Menu */}
              <div className="hidden lg:block">
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      as="button"
                      className="transition-transform hover:scale-105"
                      classNames={{
                        base: "border-2 border-[#EA7B26]",
                      }}
                      name={user.name}
                      src={user.avatar}
                    />
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    onAction={(key) => handleMenuAction(key as string)}
                  >
                    <DropdownItem key="profile">
                      <div className="flex items-center gap-2">
                        <User2Icon className="w-4 h-4" />
                        <span>My Profile</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem key="settings">
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem key="about">
                      <div className="flex items-center gap-2">
                        <InfoIcon className="w-4 h-4" />
                        <span>About</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger">
                      <div className="flex items-center gap-2">
                        <LogOutIcon className="w-4 h-4" />
                        <span>Log Out</span>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* Mobile: Simple Avatar Button (no dropdown) */}
              {/* <div className="lg:hidden">
                <Avatar
                  as="button"
                  name={user.name}
                  size="sm"
                  src={user.avatar}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => router.push(`/u/${user?.username}`)}
                />
              </div> */}
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button
                onPress={openLoginModal}
                className="bg-[#EA7B26] hover:bg-[#EA7B26]/80 hover:text-white text-white font-semibold"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
}
