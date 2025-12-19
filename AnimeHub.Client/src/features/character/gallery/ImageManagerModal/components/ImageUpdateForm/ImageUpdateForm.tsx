import React from "react";
import { type GalleryCategory } from "../../../../../../api/types/GalleryTypes";
import { ImageActionPreview } from "../ImageActionPreview";
import styles from "./ImageUpdateForm.module.css";

interface ImageUpdateFormProps {
  allFolders: GalleryCategory[];
  targetCategoryId: number;
  setTargetCategoryId: (id: number) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  isMature: boolean;
  setIsMature: (val: boolean) => void;
  loading: boolean;
  currentImageUrl?: string;
  altText?: string;
}

const ImageUpdateForm: React.FC<ImageUpdateFormProps> = ({
  allFolders,
  targetCategoryId,
  setTargetCategoryId,
  isFeatured,
  setIsFeatured,
  isMature,
  setIsMature,
  loading,
  currentImageUrl,
  altText,
}) => {
  return (
    <>
      <ImageActionPreview
        imageUrl={currentImageUrl}
        altText={altText}
        label="Selected Image"
      />

      <div className={styles.formGroup}>
        <label htmlFor="target-category">Move to Category</label>
        <select
          id="target-category"
          className={styles.textInput}
          value={targetCategoryId}
          onChange={(e) => setTargetCategoryId(Number(e.target.value))}
          disabled={loading}
        >
          {allFolders.map((f) => (
            <option
              key={f.galleryImageCategoryId}
              value={f.galleryImageCategoryId}
            >
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            disabled={loading}
          />
          Mark as <strong>Featured</strong>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isMature}
            onChange={(e) => setIsMature(e.target.checked)}
            disabled={loading}
          />
          Mark as <strong>Mature Content</strong>
        </label>
      </div>
    </>
  );
};

export default ImageUpdateForm;
