"use client";
import CardItem from "@/components/CardItem";
import { Button } from "@heroui/react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useRef, useState } from "react";

// Dummy data based on CardItem structure
const dummyData = [
  {
    id: 1,
    title: "Warung Sate Enak di Nologaten",
    image:
      "https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg",
    places: 7,
    author: {
      name: "makanyuk",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    location: "Yogyakarta",
    spots: [
      "Sate Madura",
      "Sate Madura Pak Slamet",
      "Sate Madura Bu Sri",
      "Sate Madura Pak Joko",
      "Sate Madura Bu Tini",
      "Sate Madura Pak Budi",
      "Sate Madura Bu Rani",
    ],
    likes: 100,
    bookmarks: 100,
  },
  {
    id: 2,
    title: "Gudeg Paling Enak di Jogja",
    image:
      "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/krjogja/news/2023/04/20/502403/update-harga-gudeg-jogja-untuk-wisatawan-lebaran-230420p.jpg",
    places: 5,
    author: {
      name: "foodhunter",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d2",
    },
    location: "Yogyakarta",
    spots: [
      "Gudeg Yu Djum",
      "Gudeg Permata Bu Narti",
      "Gudeg Wijilan",
      "Gudeg Mercon Bu Tinah",
      "Gudeg Pawon",
    ],
    likes: 250,
    bookmarks: 180,
  },
  {
    id: 3,
    title: "Angkringan Hits Jogja",
    image:
      "https://asset.kompas.com/crops/sH3j5mIjHkOkvWVKdGHYCUM6Sj4=/0x0:1000x667/1200x800/data/photo/2022/01/21/61eab5f30ff0f.jpg",
    places: 6,
    author: {
      name: "jojofoodie",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d3",
    },
    location: "Yogyakarta",
    spots: [
      "Angkringan Kopi Joss",
      "Angkringan Lik Man",
      "Angkringan Tugu",
      "Angkringan Wijilan",
      "Angkringan Mergangsan",
      "Angkringan UGM",
    ],
    likes: 180,
    bookmarks: 120,
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    if (currentIndex < dummyData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      containerRef.current?.children[currentIndex + 1]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      containerRef.current?.children[currentIndex - 1]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Main Content */}
      <div
        ref={containerRef}
        className="snap-y snap-mandatory overflow-y-auto max-h-[calc(100vh-8rem)] hide-scrollbar w-full"
      >
        {dummyData.map((item) => (
          <div
            key={item.id}
            className="snap-start min-h-[calc(100vh-10rem)] flex items-center justify-center"
          >
            <CardItem
              title={item.title}
              image={item.image}
              places={item.places}
              author={item.author}
              location={item.location}
              spots={item.spots}
              likes={item.likes}
              bookmarks={item.bookmarks}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only visible on desktop */}
      <div className="hidden lg:flex flex-col gap-4 absolute right-4">
        <Button
          isIconOnly
          className="bg-[#EA7B26]/80 text-white"
          radius="full"
          aria-label="Previous"
          onPress={scrollToPrevious}
          isDisabled={currentIndex === 0}
        >
          <ChevronUpIcon />
        </Button>
        <Button
          isIconOnly
          className="bg-[#EA7B26]/80 text-white"
          radius="full"
          aria-label="Next"
          onPress={scrollToNext}
          isDisabled={currentIndex === dummyData.length - 1}
        >
          <ChevronDownIcon />
        </Button>
      </div>
    </div>
  );
}
