"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Slider,
} from "@heroui/react";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onOpenChange,
  imageSrc,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation: number) => {
    setRotation(rotation);
  }, []);

  const onCropAreaChange = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
      throw new Error("Could not get cropped canvas context");
    }

    // Set canvas size to crop area
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImageBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Crop Profile Picture</h3>
              <p className="text-sm text-gray-500">
                Adjust your image to fit the circular profile picture
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative w-full h-[400px]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onRotationChange={onRotationChange}
                    onCropComplete={onCropAreaChange}
                    cropShape="round"
                    showGrid={false}
                    style={{
                      containerStyle: {
                        background: "#000",
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      },
                      cropAreaStyle: {
                        border: "2px solid #EA7B26",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 p-4">
                {/* Zoom Control */}
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                  <Slider
                    size="sm"
                    step={0.1}
                    maxValue={3}
                    minValue={1}
                    value={zoom}
                    onChange={(value) =>
                      setZoom(Array.isArray(value) ? value[0] : value)
                    }
                    className="flex-1"
                    classNames={{
                      track: "bg-gray-200",
                      filler: "bg-[#EA7B26]",
                      thumb: "bg-[#EA7B26] border-2 border-white shadow-lg",
                    }}
                  />
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </div>

                {/* Rotation Control */}
                <div className="flex items-center gap-3">
                  <RotateCw className="w-4 h-4 text-gray-600" />
                  <Slider
                    size="sm"
                    step={1}
                    maxValue={360}
                    minValue={0}
                    value={rotation}
                    onChange={(value) =>
                      setRotation(Array.isArray(value) ? value[0] : value)
                    }
                    className="flex-1"
                    classNames={{
                      track: "bg-gray-200",
                      filler: "bg-[#EA7B26]",
                      thumb: "bg-[#EA7B26] border-2 border-white shadow-lg",
                    }}
                  />
                  <span className="text-sm text-gray-600 w-8 text-center">
                    {rotation}°
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={handleCancel}
                isDisabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#EA7B26] text-white"
                onPress={handleCropConfirm}
                isLoading={isProcessing}
                isDisabled={!croppedAreaPixels}
              >
                Apply Crop
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageCropModal;
