import React, { useState, useEffect, useMemo } from "react";
import { GalleryClient } from "../../../api/GalleryClient";
import {
  type GalleryCategory,
  type GalleryImage,
  type GalleryBatchCreateMetadata,
  type ImageMetadata,
  type GalleryFolderUpdate,
} from "../../../api/types/GalleryTypes";
import Modal from "../../../components/common/modal";
import { AxiosError } from "axios";
import styles from "./GalleryAdminModal.module.css";

const galleryClient = new GalleryClient(); // Initialize client

interface GalleryAdminModalProps {
  folders: GalleryCategory[];
  onClose: () => void;
  onGalleryRefresh: () => void;
}

const GalleryAdminModal: React.FC<GalleryAdminModalProps> = ({
  folders,
  onClose,
  onGalleryRefresh,
}) => {
  const [currentView, setCurrentView] = useState<"create" | "update">("create");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isMatureContent, setIsMatureContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number | null>(null); // Index of the file to be featured

  // --- Update/Delete State ---
  const [selectedFolder, setSelectedFolder] = useState<GalleryCategory | null>(
    null
  );
  const [folderImages, setFolderImages] = useState<GalleryImage[]>([]);
  const [updateFeaturedImageId, setUpdateFeaturedImageId] = useState<
    number | null
  >(null);
  const [updateIsMatureContent, setUpdateIsMatureContent] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // 1. Logic to populate initial update state when folder is selected
  useEffect(() => {
    if (selectedFolder) {
      setUpdateIsMatureContent(selectedFolder.isMatureContent);

      // Reset image list and featured ID
      setFolderImages([]);
      setUpdateFeaturedImageId(null);

      // Fetch images for the selected folder
      const fetchImages = async () => {
        setIsLoadingImages(true);
        try {
          const images = await galleryClient.getImagesByCategoryName(
            selectedFolder.name
          );
          setFolderImages(images);

          // Find the current featured image and set it as the default for the update form
          const currentFeatured = images.find((img) => img.isFeatured);
          if (currentFeatured) {
            setUpdateFeaturedImageId(currentFeatured.galleryImageId);
          }
        } catch (error) {
          console.error("Failed to fetch folder images:", error);
          setFolderImages([]);
        } finally {
          setIsLoadingImages(false);
        }
      };
      fetchImages();
    }
  }, [selectedFolder]);

  // Handler for file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to Array
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      // Auto-select the first image as featured if none are selected
      if (filesArray.length > 0 && featuredIndex === null) {
        setFeaturedIndex(0);
      }
    }
  };

  // Placeholder for submission logic
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0 || featuredIndex === null) {
      alert("Please select images and designate a featured image.");
      return;
    }

    // Basic validation for category name
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      // Construct the list of image metadata from the selected files and the featured index state
      const imagesMetadata: ImageMetadata[] = selectedFiles.map((_, index) => ({
        // The index in the array matches the order of the files in the FormData
        isFeatured: index === featuredIndex,
      }));

      // Prepare the metadata DTO
      const metadata: GalleryBatchCreateMetadata = {
        categoryName: newCategoryName.trim(),
        isMatureContent: isMatureContent,
        images: imagesMetadata,
      };

      // 🚀 API Call
      await galleryClient.batchCreateImages(metadata, selectedFiles);

      // Success handling
      alert(`Album "${newCategoryName}" created successfully!`);

      // Trigger data refresh on the parent component
      onGalleryRefresh();

      // 🔄 Reset form and close modal
      setNewCategoryName("");
      setIsMatureContent(false);
      setSelectedFiles([]);
      setFeaturedIndex(null);
      onClose();
    } catch (error) {
      // General error handling
      console.error("Batch upload failed:", error);
      alert(
        `Failed to create album. Please check console for details. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  // 🔑 2. Handler for folder metadata update (PUT)
  const handleUpdateFolder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFolder || updateFeaturedImageId === null) {
      alert("Please select a folder and a featured image.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to update the metadata for "${selectedFolder.name}"?`
      )
    ) {
      return;
    }

    try {
      const updateData: GalleryFolderUpdate = {
        isMatureContent: updateIsMatureContent,
        featuredImageId: updateFeaturedImageId,
      };

      // 🚀 API Call
      await galleryClient.updateFolderMetadata(
        selectedFolder.galleryImageCategoryId,
        updateData
      );

      // Success handling
      alert(`Album "${selectedFolder.name}" metadata updated successfully!`);

      // Trigger data refresh on the parent component
      onGalleryRefresh();
      onClose(); // Close modal upon successful update
    } catch (error) {
      console.error("Folder update failed:", error);
      alert(
        `Failed to update folder. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  // 🔑 3. Handler for folder deletion (DELETE)
  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;

    // Use a strong confirmation dialog for a destructive action
    if (
      !window.confirm(
        `⚠️ CRITICAL WARNING: This action will permanently delete the entire album "${selectedFolder.name}" and all ${folderImages.length} images within it. Are you absolutely sure?`
      )
    ) {
      return;
    }

    try {
      // 🚀 API Call
      await galleryClient.deleteFolder(selectedFolder.galleryImageCategoryId);

      // Success handling
      alert(`Album "${selectedFolder.name}" and all images have been deleted.`);

      // Trigger data refresh on the parent component
      onGalleryRefresh();
      onClose(); // Close modal upon successful deletion
    } catch (error) {
      console.error("Folder deletion failed:", error);
      alert(
        `Failed to delete folder. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  // Helper component for the Update/Delete view logic
  const UpdateDeleteView: React.FC = () => {
    // Determine the image source path dynamically for existing images
    const getImageSource = (image: GalleryImage): string => {
      // Since images are stored relative to the client's public folder:
      // e.g., /images/ayami/standard/ayami_standard_01.png
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
              const folder = folders.find(
                (f) => f.galleryImageCategoryId === id
              );
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

            {/* Existing Image Previews & Featured Selector (Reused/Adapted Logic) */}
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
                    <div
                      key={image.galleryImageId}
                      className={`${styles.previewCard} ${
                        image.galleryImageId === updateFeaturedImageId
                          ? styles.featured
                          : ""
                      }`}
                      onClick={() =>
                        setUpdateFeaturedImageId(image.galleryImageId)
                      }
                    >
                      <img
                        src={getImageSource(image)}
                        alt={image.altText || "Gallery Image"}
                        className={styles.previewImage}
                      />
                      <p className={styles.fileName}>
                        ID: {image.galleryImageId}
                      </p>
                      {image.galleryImageId === updateFeaturedImageId && (
                        <span className={styles.featuredTag}>
                          ⭐ New Featured Cover
                        </span>
                      )}
                    </div>
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

  return (
    <Modal title="Gallery Management Tools" onClose={onClose}>
      <div className={styles.controlsWrapper}>
        {/* View Toggles */}
        <div className={styles.viewToggleGroup}>
          <button
            className={
              currentView === "create"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setCurrentView("create")}
          >
            Batch Upload / New Album
          </button>
          <button
            className={
              currentView === "update"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setCurrentView("update")}
          >
            Update Album Metadata / Delete
          </button>
        </div>

        {/* Batch Create View (POST /batch) */}
        <div className={styles.viewContent}>
          {currentView === "create" && (
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
                  **Mark as Mature Content** (Will be hidden from non-adult
                  users)
                </label>
              </div>

              {/* Input: File Selector */}
              <div className={styles.formGroup}>
                <label htmlFor="imageFiles">
                  Select Images (.png, .jpg, .gif):
                </label>
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
                  <h4>
                    {selectedFiles.length} Images Selected (Select 1 Featured)
                  </h4>
                  <div className={styles.filePreviews}>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`${styles.previewCard} ${
                          index === featuredIndex ? styles.featured : ""
                        }`}
                        onClick={() => setFeaturedIndex(index)}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className={styles.previewImage}
                          onLoad={() =>
                            URL.revokeObjectURL(URL.createObjectURL(file))
                          } // Clean up memory
                        />
                        <p className={styles.fileName}>{file.name}</p>
                        {index === featuredIndex && (
                          <span className={styles.featuredTag}>
                            ⭐ Featured Cover
                          </span>
                        )}
                      </div>
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
          )}

          {/* Batch Update/Delete View (PUT /folder/{id} & DELETE /folder/{id}) */}
          {currentView === "update" && <UpdateDeleteView />}
        </div>
      </div>
    </Modal>
  );
};

export default GalleryAdminModal;
