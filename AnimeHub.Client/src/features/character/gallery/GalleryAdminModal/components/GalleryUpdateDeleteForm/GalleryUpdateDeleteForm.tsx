import React, { useMemo } from "react";
import {
  type GalleryCategory,
  type GalleryImage,
} from "../../../../../../api/types/GalleryTypes";
import { ImagePreviewCard } from "../ImagePreviewCard";
import styles from "./GalleryUpdateDeleteForm.module.css";

interface GalleryUpdateDeleteFormProps {
  folders: GalleryCategory[];
  selectedFolder: GalleryCategory | null;
  setSelectedFolder: (folder: GalleryCategory | null) => void;
  folderImages: GalleryImage[];
  updateFeaturedImageId: number | null;
  setUpdateFeaturedImageId: (id: number) => void;
  updateIsMatureContent: boolean;
  setUpdateIsMatureContent: (isMature: boolean) => void;
  isLoadingImages: boolean;
  handleUpdateFolder: (e: React.FormEvent) => Promise<void>;
  handleDeleteFolder: () => Promise<void>;
}

const GalleryUpdateDeleteForm: React.FC<GalleryUpdateDeleteFormProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  folderImages,
  updateFeaturedImageId,
  setUpdateFeaturedImageId,
  updateIsMatureContent,
  setUpdateIsMatureContent,
  isLoadingImages,
  handleUpdateFolder,
  handleDeleteFolder,
}) => {
  // Determine the image source path dynamically for existing images (original helper logic)
  const getImageSource = (image: GalleryImage): string => {
    return image.imageUrl;
  };

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => a.name.localeCompare(b.name));
  }, [folders]);

  return (
    <form onSubmit={handleUpdateFolder} className={styles.updateForm}>
      <h3>Update/Delete Existing Album</h3>

      {/* Folder Selection Dropdown */}
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
          {sortedFolders.map((folder) => (
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

          {/* Input: Is Mature Content */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={updateIsMatureContent}
                onChange={(e) => setUpdateIsMatureContent(e.target.checked)}
              />
              **Mark as Mature Content** (Will be hidden from non-adult users)
            </label>
          </div>

          {/* Existing Image Previews & Featured Selector */}
          {isLoadingImages ? (
            <p>Loading images...</p>
          ) : folderImages.length > 0 ? (
            <div className={styles.previewContainer}>
              <h4>
                Select New Featured Cover (Current:{" "}
                {folderImages.find(
                  (img) => img.galleryImageId === updateFeaturedImageId
                )?.altText || "None"}
                )
              </h4>
              <div className={styles.filePreviews}>
                {folderImages.map((image) => (
                  <ImagePreviewCard
                    key={image.galleryImageId}
                    imageUrl={getImageSource(image)}
                    altText={image.altText || "Gallery Image"}
                    label={`ID: ${image.galleryImageId}`}
                    isFeatured={image.galleryImageId === updateFeaturedImageId}
                    onClick={() =>
                      setUpdateFeaturedImageId(image.galleryImageId)
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No images found in this folder or failed to load.</p>
          )}

          {/* Action Buttons */}
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
              onClick={handleDeleteFolder}
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
