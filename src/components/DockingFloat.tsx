import { Button, Card, CardBody } from "@heroui/react";
import { Bookmark, Heart, Share } from "lucide-react";
import React from "react";

const DockingFloat = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="shadow-lg">
        <CardBody className="p-2">
          <div className="flex items-center gap-2">
            <Button
              variant={"light"}
              size="sm"
              className="flex items-center gap-2"
            >
              {/* <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} /> */}
              <Heart className={`w-4 h-4 fill-current`} />
              <span className="text-sm">10</span>
            </Button>

            <Button
              variant={"light"}
              size="sm"
              className="flex items-center gap-2"
            >
              {/* <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} /> */}
              <Bookmark className={`w-4 h-4 fill-current`} />
              <span className="text-sm">10</span>
            </Button>

            <Button variant="light" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DockingFloat;
