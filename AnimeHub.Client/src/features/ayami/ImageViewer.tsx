import React, { useState, useEffect } from "react";
import { type GalleryImage } from "../../api/types/GalleryTypes";
import styles from "./Gallery.module.css"; // 🔑 Import dedicated Gallery styles

interface ImageViewerProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentImage = images[currentIndex];

  // Logic for cycling images (wraps around array boundaries)
  const navigateImage = (direction: "next" | "prev") => {
    let newIndex = currentIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      // Add images.length before modulo to ensure positive result on wrap-around
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    setCurrentIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateImage("next");
      else if (e.key === "ArrowLeft") navigateImage("prev");
      else if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onClose]);

  if (!currentImage) return null;

  return (
    // 🔑 Replaced inline styles with module class
    <div className={styles.viewerOverlay}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className={styles.viewerCloseButton} // 🔑 Use module style
      >
        ✕ Close
      </button>

      {/* Image Container with navigation buttons */}
      <div className={styles.viewerContainer}>
        {" "}
        {/* 🔑 Use module style */}
        <img
          src={currentImage.imageUrl}
          alt={currentImage.altText}
          className={styles.viewerImage} // 🔑 Use module style
        />
        {/* Previous Button */}
        <button
          onClick={() => navigateImage("prev")}
          className={`${styles.viewerNavButton} ${styles.viewerPrev}`} // 🔑 Use module styles
        >
          &lt;
        </button>
        {/* Next Button */}
        <button
          onClick={() => navigateImage("next")}
          className={`${styles.viewerNavButton} ${styles.viewerNext}`} // 🔑 Use module styles
        >
          &gt;
        </button>
      </div>

      {/* Caption */}
      <div className={styles.viewerCaption}>
        {" "}
        {/* 🔑 Use module style */}
        <p>
          {currentImage.altText} ({currentIndex + 1} of {images.length})
        </p>
      </div>
    </div>
  );
};

export default ImageViewer;
