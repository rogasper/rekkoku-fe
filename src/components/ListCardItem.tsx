import { Button, Card, CardBody } from "@heroui/react";
import { ExternalLink, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Place } from "@/types/api";
import ReviewBottomSheet from "@/components/ReviewBottomSheet";
import { useState } from "react";

interface ListCardItemProps {
  place: Place;
  postId: string;
}

const ListCardItem = ({ place, postId }: ListCardItemProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  return (
    <Card
      key={postId}
      className="w-full max-w-[100vw] sm:max-w-none overflow-hidden"
    >
      <CardBody className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="w-full sm:w-2/5 h-48 sm:h-auto">
            <Image
              src={place.image}
              alt={place.title}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
            />
          </div>

          {/* Content */}
          <div className="w-full sm:w-3/5 p-4 sm:p-6">
            <div className="h-full flex flex-col justify-between gap-3 sm:gap-4">
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                  {place.title.split("·")[0]}
                </h3>

                {/* Address */}
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    {place.title.split("·")[1]}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-3 flex gap-2">
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={() => window.open(place.gmapsLink, "_blank")}
                  className="w-full sm:w-auto text-sm"
                  startContent={<ExternalLink className="w-4 h-4" />}
                >
                  Open in Google Maps
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  className="w-full sm:w-auto text-sm"
                  startContent={<MessageCircle className="w-4 h-4" />}
                  onPress={() => setIsReviewOpen(true)}
                >
                  Reviews ({place.reviewCount ?? 0})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <ReviewBottomSheet
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        scope={{ placeId: place.id }}
        header={{ title: place.title.split("·")[0], image: place.image }}
      />
    </Card>
  );
};

export default ListCardItem;
