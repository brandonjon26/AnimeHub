import React from "react";
import { type GalleryImage } from "../../../../api/types/GalleryTypes";
import { useImageViewer } from "../../../../hooks/TS/useImageViewer";
import styles from "./Gallery.module.css";

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
  const { currentIndex, currentImage, navigateImage } = useImageViewer(
    images,
    initialIndex,
    onClose
  );

  if (!currentImage) return null;

  return (
    <div className={styles.viewerOverlay}>
      {/* Close Button */}
      <button onClick={onClose} className={styles.viewerCloseButton}>
        ✕ Close
      </button>

      {/* Image Container with navigation buttons */}
      <div className={styles.viewerContainer}>
        <img
          src={currentImage.imageUrl}
          alt={currentImage.altText}
          className={styles.viewerImage}
        />

        {/* Previous Button */}
        <button
          onClick={() => navigateImage("prev")}
          className={`${styles.viewerNavButton} ${styles.viewerPrev}`}
          aria-label="Previous image"
        >
          &lt;
        </button>

        {/* Next Button */}
        <button
          onClick={() => navigateImage("next")}
          className={`${styles.viewerNavButton} ${styles.viewerNext}`}
          aria-label="Next image"
        >
          &gt;
        </button>
      </div>

      {/* Caption */}
      <div className={styles.viewerCaption}>
        <p>
          {currentImage.altText} ({currentIndex + 1} of {images.length})
        </p>
      </div>
    </div>
  );
};

export default ImageViewer;
