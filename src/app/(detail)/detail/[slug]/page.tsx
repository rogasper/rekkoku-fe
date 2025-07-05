"use client";
import ListCardItem from "@/components/ListCardItem";
import DockingFloat from "@/components/DockingFloat";
import { Button, Divider, User, Image } from "@heroui/react";
import { ArrowLeft, Clock } from "lucide-react";
import React from "react";

const DetailPage = () => {
  return (
    <div className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <main className="mx-auto pb-24">
        {/* Header Image */}
        <div className="relative h-64 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg mb-6 overflow-hidden">
          <Image
            src="https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg"
            alt="Warung Sate Enak di Nologaten"
            width={1000}
            height={667}
            className="w-full h-full object-cover absolute top-0 left-0"
          />
          <Button
            variant="light"
            size="sm"
            className="hover:bg-orange-50 absolute top-4 left-4 z-11 text-white text-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
          <div className="absolute inset-0 bg-black/30 z-10 w-full h-full" />
          <div className="absolute bottom-6 left-6 right-6 z-11 flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2 md:line-clamp-none">
              Warung Sate Enak di Nologaten
            </h1>
            <div className="before:bg-white/10 border-white/30 border-1  backdrop-blur-sm text-white shadow-small px-4 py-2 rounded-full md:w-1/4 justify-center items-center flex w-full">
              5 amazing places
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 justify-between mb-6 w-full md:px-0 px-6">
          <User
            name="John Doe"
            description="@john_doe"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            }}
          />
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />2 hours ago
          </div>
        </div>

        <Divider className="my-6" />

        <h2 className="text-2xl font-bold my-6 md:px-0 px-6">Location</h2>
        <div className="flex flex-col gap-4 md:px-0 px-6">
          <ListCardItem />
          <ListCardItem />
        </div>
      </main>
      <DockingFloat />
    </div>
  );
};

export default DetailPage;
