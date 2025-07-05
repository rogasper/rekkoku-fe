"use client";
import CardItem from "@/components/CardItem";
import ProfileGridItem from "@/components/ProfileGridItem";
import { Avatar, Button, Chip, Tab, Tabs } from "@heroui/react";
import { Bookmark, Heart, Link, LinkIcon, Send } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  const [selectedTab, setSelectedTab] = useState("posts");

  // Sample data for demonstration
  const posts = [
    {
      title: "Warung Sate Enak di Nologaten",
      image:
        "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
      likes: 120,
      bookmarks: 45,
      places: 7,
      location: "Yogyakarta",
    },
    {
      title: "Gudeg Yu Djum yang Legendaris",
      image:
        "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
      likes: 89,
      bookmarks: 32,
      places: 5,
      location: "Yogyakarta",
    },
    {
      title: "Bakmi Jawa Pak Gareng",
      image:
        "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
      likes: 156,
      bookmarks: 67,
      places: 3,
      location: "Yogyakarta",
    },
  ];

  const likedPosts = [
    {
      title: "Angkringan Kopi Jos Mangkubumi",
      image:
        "https://asset.kompas.com/crops/qm1uN5-h26dzzb9_CflxoH9itK4=/0x0:1000x667/750x500/data/photo/2023/05/20/6468a98f5d3bc.jpg",
      likes: 234,
      bookmarks: 89,
      location: "Yogyakarta",
    },
    {
      title: "Mie Ayam Bu Tumini",
      image:
        "https://asset.kompas.com/crops/rJ-Qj9hzDYvxzK1uGJ0LlsFCR7E=/0x0:1000x667/750x500/data/photo/2023/03/18/6415b2c2af3d7.jpg",
      likes: 178,
      bookmarks: 56,
      location: "Yogyakarta",
    },
  ];

  const bookmarkedPosts = [
    {
      title: "Soto Ayam Pak Gareng",
      image:
        "https://asset.kompas.com/crops/rYxJ2-2ys-9e_lTT8hQBcnN4YaY=/0x0:1000x667/750x500/data/photo/2023/06/15/648ab2c61df67.jpg",
      likes: 145,
      bookmarks: 78,
      location: "Yogyakarta",
    },
    {
      title: "Nasi Goreng Sapi Pak Karmin",
      image:
        "https://asset.kompas.com/crops/0YePCBxVgqC_-3h2WuYu7_yfxCo=/0x0:1000x667/750x500/data/photo/2023/01/08/63ba8c0c8c3fb.jpg",
      likes: 198,
      bookmarks: 92,
      location: "Yogyakarta",
    },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "posts":
        return posts.map((post, index) => (
          <ProfileGridItem key={index} {...post} type="post" />
        ));
      case "tastes":
        return likedPosts.map((post, index) => (
          <ProfileGridItem key={index} {...post} type="like" />
        ));
      case "bookmarks":
        return bookmarkedPosts.map((post, index) => (
          <ProfileGridItem key={index} {...post} type="bookmark" />
        ));
      default:
        return null;
    }
  };

  return (
    <main className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <div className="flex flex-col gap-4 pb-10">
        {/* User Info */}
        <div className="flex flex-col items-center gap-2 p-10 pb-4">
          <Avatar
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            className="w-24 h-24"
          />
          <h1 className="text-2xl font-bold">John Doe</h1>
          <Chip className="bg-gray-100 text-gray-500">@john_doe</Chip>
          <p className="text-sm text-gray-500 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>

        {/* User Stats */}
        <div className="flex justify-evenly gap-10">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2">
              <Send className="w-6 h-6" />
              <span>100</span>
            </div>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <span>100</span>
            </div>
            <span className="text-sm text-gray-500">Tastes</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2">
              <Bookmark className="w-6 h-6" />
              <span>100</span>
            </div>
            <span className="text-sm text-gray-500">Saved</span>
          </div>
        </div>

        {/* button edit profile and share profile */}
        <div className="flex gap-2 justify-center">
          <Button variant="bordered" className="bg-gray-100">
            Edit Profile
          </Button>
          <Button variant="bordered" className="bg-gray-100">
            Share Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="pt-4 px-4 sm:px-0">
          <Tabs
            aria-label="Options"
            variant="bordered"
            fullWidth
            size="lg"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key.toString())}
            classNames={{
              tabContent: "text-gray-500",
              tab: "text-gray-500",
              tabList: "bg-gray-100",
            }}
          >
            <Tab key="posts" title="Posts" />
            <Tab key="tastes" title="Tastes" />
            <Tab key="bookmarks" title="Bookmarks" />
          </Tabs>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-1 sm:px-0">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default page;
