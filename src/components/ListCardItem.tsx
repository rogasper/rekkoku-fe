import { Button, Card, CardBody } from "@heroui/react";
import { ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Place } from "@/types/api";

interface ListCardItemProps {
  place: Place;
  postId: string;
}

const ListCardItem = ({ place, postId }: ListCardItemProps) => {
  return (
    <Card
      key={postId}
      className="w-full max-w-[100vw] sm:max-w-none overflow-hidden"
    >
      <CardBody className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Left column - Image */}
          <div className="w-full sm:w-1/3 sm:h-auto">
            <Image
              src={place.image}
              alt={place.title}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
            />
          </div>

          {/* Right column - Content */}
          <div className="w-full sm:w-2/3 p-4 sm:p-10">
            <div className="h-full flex flex-col justify-between gap-4">
              <div>
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {place.title.split("·")[0]}
                </h3>

                {/* Address */}
                <div className="flex items-start text-gray-600 mb-2 sm:mb-4">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {place.title.split("·")[1]}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-3">
                  {place.description}
                </p>
              </div>

              {/* Google Maps Link */}
              <div className="mt-auto">
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() => window.open(place.gmapsLink, "_blank")}
                  className="w-full text-xs sm:text-sm md:w-1/2"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ListCardItem;
