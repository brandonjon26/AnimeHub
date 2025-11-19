import React, { useState } from "react";
import { GalleryClient } from "../../../api/GalleryClient";
import {
  type GalleryCategory,
  type GalleryBatchCreateMetadata,
  type ImageMetadata,
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
          {currentView === "update" && (
            <div>
              <h3>Update/Delete Existing Album</h3>
              <p>
                Content for album selection and update/delete form will go here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GalleryAdminModal;
