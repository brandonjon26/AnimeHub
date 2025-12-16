import React from "react";
import styles from "./GalleryBatchCreateForm.module.css";
import { ImagePreviewCard } from "../ImagePreviewCard";

interface GalleryBatchCreateFormProps {
  onSubmit: (e: React.FormEvent) => void;
  newCategoryName: string;
  setNewCategoryName: (val: string) => void;
  isMatureContent: boolean;
  setIsMatureContent: (val: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  featuredIndex: number | null;
  setFeaturedIndex: (index: number) => void;
}

const GalleryBatchCreateForm: React.FC<GalleryBatchCreateFormProps> = ({
  onSubmit,
  newCategoryName,
  setNewCategoryName,
  isMatureContent,
  setIsMatureContent,
  handleFileChange,
  selectedFiles,
  featuredIndex,
  setFeaturedIndex,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.batchForm}>
      <h3>Create New Album (Batch Upload)</h3>

      <div className={styles.formGroup}>
        <label htmlFor="categoryName">Album / Category Name:</label>
        <input
          id="categoryName"
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
          className={styles.textInput}
          placeholder="e.g., Summer Beach Attire"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isMatureContent}
            onChange={(e) => setIsMatureContent(e.target.checked)}
          />
          <strong>Mark as Mature Content</strong> (Will be hidden from non-adult
          users)
        </label>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageFiles">Select Images (.png, .jpg, .gif):</label>
        <input
          id="imageFiles"
          type="file"
          multiple
          accept=".png, .jpg, .jpeg, .gif"
          onChange={handleFileChange}
          required={selectedFiles.length === 0}
          className={styles.fileInput}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className={styles.previewContainer}>
          <h4>{selectedFiles.length} Images Selected (Select 1 Featured)</h4>
          <div className={styles.filePreviews}>
            {selectedFiles.map((file, index) => (
              <ImagePreviewCard
                key={`${file.name}-${index}`}
                src={URL.createObjectURL(file)}
                alt={file.name}
                label={file.name}
                isFeatured={index === featuredIndex}
                featuredTagText="Featured Cover"
                onClick={() => setFeaturedIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={selectedFiles.length === 0}
      >
        Create Album & Upload Images
      </button>
    </form>
  );
};

export default GalleryBatchCreateForm;
