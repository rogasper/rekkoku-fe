"use client";

import React from "react";
import { Modal, ModalContent, ModalBody, Avatar, Button } from "@heroui/react";
import { X, Camera, Download } from "lucide-react";

interface AvatarPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  avatarSrc: string;
  userName: string;
  onChangePhoto?: () => void;
  onDownload?: () => void;
}

const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({
  isOpen,
  onOpenChange,
  avatarSrc,
  userName,
  onChangePhoto,
  onDownload,
}) => {
  const handleDownload = () => {
    if (avatarSrc && onDownload) {
      onDownload();
    } else if (avatarSrc) {
      // Default download behavior
      const link = document.createElement("a");
      link.href = avatarSrc;
      link.download = `${userName}-avatar.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "bg-transparent shadow-none backdrop-blur-sm",
        body: "p-0",
        backdrop: "bg-black/60",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody
              className="flex flex-col items-center justify-center min-h-[500px] relative cursor-pointer"
              onClick={onClose}
            >
              {/* Close Button */}
              <Button
                isIconOnly
                variant="light"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
                onPress={onClose}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Avatar Container */}
              <div
                className="flex flex-col items-center justify-center flex-1 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Large Avatar */}
                <div className="relative animate-in fade-in zoom-in duration-300">
                  <Avatar
                    src={avatarSrc}
                    alt={`${userName}'s avatar`}
                    className="w-72 h-72 md:w-72 md:h-72 ring-4 ring-white/20 transition-all duration-300 hover:scale-105"
                    isBordered={false}
                    showFallback
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-6xl md:text-8xl font-bold text-gray-500">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    }
                  />

                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EA7B26] via-pink-500 to-purple-600 p-1 -z-10 animate-pulse">
                    <div className="w-full h-full rounded-full bg-black" />
                  </div>
                </div>

                {/* User Name */}
                <div className="text-center animate-in slide-in-from-bottom duration-500 delay-150">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userName}
                  </h2>
                  <p className="text-gray-300 text-sm">Profile Picture</p>
                </div>

                {/* Action Buttons */}
                {/* PENDING: Add back in */}
                {/* <div className="flex gap-3 mt-8 animate-in slide-in-from-bottom duration-500 delay-300">
                  {onChangePhoto && (
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Camera className="w-4 h-4" />}
                      onPress={() => {
                        onChangePhoto();
                        onClose();
                      }}
                      className="bg-[#EA7B26] text-white hover:bg-[#EA7B26]/90"
                    >
                      Change Photo
                    </Button>
                  )}

                  {avatarSrc && (
                    <Button
                      variant="flat"
                      color="default"
                      startContent={<Download className="w-4 h-4" />}
                      onPress={handleDownload}
                      className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                    >
                      Download
                    </Button>
                  )}
                </div> */}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AvatarPreviewModal;
