import React from "react";
import { ImagePreviewCard } from "../ImagePreviewCard";
import styles from "./GalleryBatchCreateForm.module.css";

interface GalleryBatchCreateFormProps {
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  isMatureContent: boolean;
  setIsMatureContent: (isMature: boolean) => void;
  selectedFiles: File[];
  featuredIndex: number | null;
  setFeaturedIndex: (index: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBatchSubmit: (e: React.FormEvent) => Promise<void>;
}

const GalleryBatchCreateForm: React.FC<GalleryBatchCreateFormProps> = ({
  newCategoryName,
  setNewCategoryName,
  isMatureContent,
  setIsMatureContent,
  selectedFiles,
  featuredIndex,
  setFeaturedIndex,
  handleFileChange,
  handleBatchSubmit,
}) => {
  return (
    <form onSubmit={handleBatchSubmit} className={styles.batchForm}>
      <h3>Create New Album (Batch Upload)</h3>

      {/* Input: Category Name */}
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

      {/* Input: Is Mature Content */}
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isMatureContent}
            onChange={(e) => setIsMatureContent(e.target.checked)}
          />
          **Mark as Mature Content** (Will be hidden from non-adult users)
        </label>
      </div>

      {/* Input: File Selector */}
      <div className={styles.formGroup}>
        <label htmlFor="imageFiles">Select Images (.png, .jpg, .gif):</label>
        <input
          id="imageFiles"
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          multiple
          onChange={handleFileChange}
          required={selectedFiles.length === 0}
          className={styles.fileInput}
        />
      </div>

      {/* Image Previews & Featured Selector */}
      {selectedFiles.length > 0 && (
        <div className={styles.previewContainer}>
          <h4>{selectedFiles.length} Images Selected (Select 1 Featured)</h4>
          <div className={styles.filePreviews}>
            {selectedFiles.map((file, index) => (
              <ImagePreviewCard
                key={index}
                imageUrl={URL.createObjectURL(file)}
                altText={file.name}
                label={file.name}
                isFeatured={index === featuredIndex}
                onClick={() => setFeaturedIndex(index)}
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
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
