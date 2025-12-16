import { useState, useEffect, useCallback } from "react";
import { type GalleryImage } from "../../api/types/GalleryTypes";

export const useImageViewer = (
  images: GalleryImage[],
  initialIndex: number,
  onClose: () => void
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      setCurrentIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % images.length;
        } else {
          // Add images.length to handle negative results for wrap-around
          return (prevIndex - 1 + images.length) % images.length;
        }
      });
    },
    [images.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateImage("next");
      else if (e.key === "ArrowLeft") navigateImage("prev");
      else if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigateImage, onClose]);

  return {
    currentIndex,
    currentImage: images[currentIndex],
    navigateImage,
  };
};
