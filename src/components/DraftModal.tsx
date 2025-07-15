"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { FileText } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMyDraftPosts } from "@/hooks/useApi";
import ProfileGridItem from "./ProfileGridItem";

interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DraftModal = ({ isOpen, onClose }: DraftModalProps) => {
  const router = useRouter();
  const { data: draftsData, isLoading } = useMyDraftPosts();

  const drafts = draftsData?.data || [];

  const handleDraftClick = (slug: string) => {
    router.push(`/review/${slug}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        base: "sm:max-w-4xl sm:max-h-[85vh] sm:mx-auto sm:my-8 sm:rounded-lg",
        body: "p-4 sm:p-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-lg sm:text-xl font-semibold">
              Your Drafts ({drafts.length})
            </span>
          </div>
        </ModalHeader>
        <ModalBody className="px-4 sm:px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 px-4">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm sm:text-base">
                No drafts yet
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Create a post to save it as draft
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {drafts.map((draft: any) => (
                <div
                  key={draft.id}
                  onClick={() => handleDraftClick(draft.slug)}
                  className="w-full"
                >
                  <ProfileGridItem
                    title={draft.title}
                    image={
                      draft.postPlaces?.[0]?.place?.image ||
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
                    }
                    likes={0}
                    bookmarks={0}
                    places={draft._count?.postPlaces || 0}
                    location={draft.city?.name || "Unknown"}
                    type="draft"
                    slug={draft.slug}
                  />
                </div>
              ))}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DraftModal;
