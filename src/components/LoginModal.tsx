"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
} from "@heroui/react";
import { API_ENDPOINTS } from "@/constants/endpoints";
import Image from "next/image";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + API_ENDPOINTS.AUTH.GOOGLE;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              className="dark:invert w-[32px] h-[28px]"
              src="/logo.svg"
              alt="Rekkoku logo"
              width={32}
              height={28}
              priority
            />
            <span className="font-bold text-xl">Rekkoku</span>
          </div>
          <h2 className="text-lg font-semibold">Welcome back!</h2>
          <p className="text-sm text-gray-500">Sign in to share your taste</p>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="flex flex-col gap-4">
            <Button
              onPress={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium"
              size="lg"
              startContent={
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                Don't have an account?{" "}
                <Link
                  href="#"
                  className="text-[#EA7B26] hover:text-[#EA7B26]/80 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div> */}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <div className="text-xs text-gray-400 text-center">
            {/* By continuing, you agree to our{" "}
            <Link href="#" className="text-[#EA7B26] hover:text-[#EA7B26]/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#EA7B26] hover:text-[#EA7B26]/80">
              Privacy Policy
            </Link> */}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
