import React from "react";
import { type GalleryImage } from "../../../../../../api/types/GalleryTypes";
import styles from "./ImageSelector.module.css";

interface ImageSelectorProps {
  imagesInFolder: GalleryImage[];
  selectedImageId: number | null;
  setSelectedImageId: (id: number) => void;
  selectedView: string;
  loading: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  imagesInFolder,
  selectedImageId,
  setSelectedImageId,
  selectedView,
  loading,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="select-image">Select Image:</label>
      <select
        id="select-image"
        className={styles.textInput}
        value={selectedImageId ?? ""}
        onChange={(e) => setSelectedImageId(Number(e.target.value))}
        disabled={loading}
      >
        <option value="" disabled>
          Choose image to {selectedView.toLowerCase()}
        </option>
        {imagesInFolder.map((img) => (
          <option key={img.galleryImageId} value={img.galleryImageId}>
            {img.galleryImageId} - {img.altText}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ImageSelector;
