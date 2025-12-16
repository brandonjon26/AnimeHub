import React from "react";
import styles from "./GalleryUpdateDeleteForm.module.css";
import {
  type GalleryCategory,
  type GalleryImage,
} from "../../../../../../api/types/GalleryTypes";
import { ImagePreviewCard } from "../ImagePreviewCard";

interface GalleryUpdateDeleteFormProps {
  folders: GalleryCategory[];
  selectedFolder: GalleryCategory | null;
  setSelectedFolder: (folder: GalleryCategory | null) => void;
  folderImages: GalleryImage[];
  isLoadingImages: boolean;
  updateIsMatureContent: boolean;
  setUpdateIsMatureContent: (val: boolean) => void;
  updateFeaturedImageId: number | null;
  setUpdateFeaturedImageId: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
}

const GalleryUpdateDeleteForm: React.FC<GalleryUpdateDeleteFormProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  folderImages,
  isLoadingImages,
  updateIsMatureContent,
  setUpdateIsMatureContent,
  updateFeaturedImageId,
  setUpdateFeaturedImageId,
  onSubmit,
  onDelete,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.updateForm}>
      <h3>Update/Delete Existing Album</h3>

      <div className={styles.formGroup}>
        <label htmlFor="selectFolder">Select Album to Edit:</label>
        <select
          id="selectFolder"
          value={selectedFolder?.galleryImageCategoryId || ""}
          onChange={(e) => {
            const id = parseInt(e.target.value);
            const folder = folders.find((f) => f.galleryImageCategoryId === id);
            setSelectedFolder(folder || null);
          }}
          required
          className={styles.textInput}
        >
          <option value="" disabled>
            -- Select an Album --
          </option>
          {folders.map((folder) => (
            <option
              key={folder.galleryImageCategoryId}
              value={folder.galleryImageCategoryId}
            >
              {folder.name} ({folder.isMatureContent ? "Mature" : "Standard"})
            </option>
          ))}
        </select>
      </div>

      {selectedFolder && (
        <fieldset disabled={isLoadingImages} className={styles.fieldset}>
          <legend>Edit Metadata for "{selectedFolder.name}"</legend>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={updateIsMatureContent}
                onChange={(e) => setUpdateIsMatureContent(e.target.checked)}
              />
              <strong>Mark as Mature Content</strong>
            </label>
          </div>

          {isLoadingImages ? (
            <p>Loading images...</p>
          ) : folderImages.length > 0 ? (
            <div className={styles.previewContainer}>
              <h4>Select New Featured Cover</h4>
              <div className={styles.filePreviews}>
                {folderImages.map((image) => (
                  <ImagePreviewCard
                    key={image.galleryImageId}
                    src={image.imageUrl}
                    alt={image.altText || "Gallery Image"}
                    label={`ID: ${image.galleryImageId}`}
                    isFeatured={image.galleryImageId === updateFeaturedImageId}
                    featuredTagText="New Featured Cover"
                    onClick={() =>
                      setUpdateFeaturedImageId(image.galleryImageId)
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No images found.</p>
          )}

          <div className={styles.actionGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoadingImages || updateFeaturedImageId === null}
            >
              Apply Metadata Update (PUT)
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={onDelete}
              disabled={isLoadingImages}
            >
              Permanently Delete Album (DELETE)
            </button>
          </div>
        </fieldset>
      )}
    </form>
  );
};

export default GalleryUpdateDeleteForm;
