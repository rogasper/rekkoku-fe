import { Button, Card, CardBody } from "@heroui/react";
import { ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

const ListCardItem = () => {
  const getGoogleMapsUrl = (location: any) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location.name + " " + location.address
    )}`;
  };
  return (
    <Card
      key={"1"}
      className="w-full max-w-[100vw] sm:max-w-none overflow-hidden"
    >
      <CardBody className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Left column - Image */}
          <div className="w-full sm:w-1/3 sm:h-auto">
            <Image
              src="https://asset.kompas.com/crops/BJdOTeUCdwHWS6ImI9qDnf3s8nI=/0x0:1000x667/1200x800/data/photo/2023/12/19/6580e31d4d33e.jpeg"
              alt="location"
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
                  Warung Sate Enak di Nologaten
                </h3>

                {/* Address */}
                <div className="flex items-start text-gray-600 mb-2 sm:mb-4">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Yogyakarta</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-3">
                  {`⭐ ${5}/5 rating`}
                  {` • ${"$".repeat(5)} price range`}
                  {` • ${"Sate Madura, Sate Madura Pak Slamet"}`}
                </p>
              </div>

              {/* Google Maps Link */}
              <div className="mt-auto">
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() =>
                    window.open(getGoogleMapsUrl(location), "_blank")
                  }
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
