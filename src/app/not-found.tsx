"use client";
import { Button } from "@heroui/react";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
        {/* Logo */}
        <Image
          className="dark:invert opacity-50"
          src="/logo.svg"
          alt="Rekkoku logo"
          width={120}
          height={25}
          priority
        />

        {/* 404 Text */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-8xl sm:text-9xl font-bold text-[#EA7B26] opacity-80">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link href="/">
            <Button
              className="bg-[#EA7B26] text-white shadow-lg hover:bg-[#d66a1f] font-medium"
              radius="full"
              size="lg"
              startContent={<HomeIcon size={18} />}
            >
              Go Home
            </Button>
          </Link>

          <Button
            className="border-2 border-[#EA7B26] text-[#EA7B26] bg-transparent hover:bg-[#EA7B26] hover:text-white font-medium"
            radius="full"
            size="lg"
            startContent={<ArrowLeftIcon size={18} />}
            onPress={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Additional Links */}
        <div className="flex gap-6 items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <Link href="/" className="hover:text-[#EA7B26] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link
            href="/nearby"
            className="hover:text-[#EA7B26] transition-colors"
          >
            Nearby
          </Link>
          <span>•</span>
          <Link
            href="/top-places"
            className="hover:text-[#EA7B26] transition-colors"
          >
            Top Places
          </Link>
        </div>
      </main>
    </div>
  );
}
