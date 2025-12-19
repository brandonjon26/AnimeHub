import React from "react";
import { type GalleryCategory } from "../../../../../../api/types/GalleryTypes";
import styles from "./ImageAddForm.module.css";

interface ImageAddFormProps {
  allFolders: GalleryCategory[];
  targetCategoryId: number;
  setTargetCategoryId: (id: number) => void;
  setFileToUpload: (file: File | null) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  isMature: boolean;
  setIsMature: (val: boolean) => void;
  altText: string;
  setAltText: (val: string) => void;
  loading: boolean;
}

const ImageAddForm: React.FC<ImageAddFormProps> = ({
  allFolders,
  targetCategoryId,
  setTargetCategoryId,
  setFileToUpload,
  isFeatured,
  setIsFeatured,
  isMature,
  setIsMature,
  altText,
  setAltText,
  loading,
}) => {
  return (
    <div className={styles.formContainer}>
      {/* File Upload */}
      <div className={styles.formGroup}>
        <label htmlFor="file-upload">Image File:</label>
        <input
          id="file-upload"
          type="file"
          className={styles.fileInput}
          onChange={(e) =>
            setFileToUpload(e.target.files ? e.target.files[0] : null)
          }
          disabled={loading}
          accept="image/*"
        />
      </div>

      {/* Target Category Selector */}
      <div className={styles.formGroup}>
        <label htmlFor="target-category">Target Category</label>
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

      {/* Featured Checkbox */}
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            disabled={loading}
          />
          Mark as <strong>Featured</strong> (Will un-feature current image in
          target category)
        </label>
      </div>

      {/* Mature Checkbox */}
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

      {/* Alt Text Input */}
      <div className={styles.formGroup}>
        <label htmlFor="alt-text">Alt Text (Optional):</label>
        <input
          id="alt-text"
          type="text"
          className={styles.textInput}
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          disabled={loading}
          placeholder="Descriptive text for the image"
        />
      </div>
    </div>
  );
};

export default ImageAddForm;
