import React, { useState, useEffect, useMemo } from "react";
import {
  type GalleryImage,
  type GalleryCategory,
  type GallerySingleCreate,
  type GallerySingleUpdate,
} from "../../../api/types/GalleryTypes";
import { GalleryClient } from "../../../api/GalleryClient";
import styles from "./ImageManagerModal.module.css"; // Local styles
import Modal from "../../../components/common/modal"; // Assuming your modal component is named Modal

// --- Component Props ---
interface ImageManagerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentCategory: GalleryCategory; // The category we are currently managing
  imagesInFolder: GalleryImage[]; // All images in this category (for selection/preview)
  allFolders: GalleryCategory[]; // All folders (for moving images during UPDATE)
}

// --- Component View Modes ---
type AdminView = "ADD" | "UPDATE" | "DELETE";

const initialImageState = {
  isFeatured: false,
  isMature: false,
  altText: "",
  targetCategoryId: 0,
};

// --- Image Manager Component ---
const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  onClose,
  onSuccess,
  currentCategory,
  imagesInFolder,
  allFolders,
}) => {
  // --- 1. View State ---
  const [selectedView, setSelectedView] = useState<AdminView>("ADD");

  // --- 2. Form State ---
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // --- 3. Image Metadata State ---
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialImageState.isFeatured
  );
  const [isMature, setIsMature] = useState<boolean>(initialImageState.isMature);
  const [altText, setAltText] = useState<string>(initialImageState.altText);
  // Default target category is always the current category ID
  const [targetCategoryId, setTargetCategoryId] = useState<number>(
    currentCategory.galleryImageCategoryId
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Derived State: The image currently being updated/deleted ---
  const imageToEdit = useMemo(() => {
    return (
      imagesInFolder.find((img) => img.galleryImageId === selectedImageId) ||
      null
    );
  }, [selectedImageId, imagesInFolder]);

  // Available to all render functions and the final return.
  const isUpdateOrDelete =
    selectedView === "UPDATE" || selectedView === "DELETE";

  // --- Effect: Reset state when the modal opens/closes or category changes ---
  useEffect(() => {
    // Full reset on close
    setSelectedView("ADD");
    setSelectedImageId(null);
    setFileToUpload(null);
    setLoading(false);
    setError(null);
    setAltText(initialImageState.altText);
    setIsFeatured(initialImageState.isFeatured);
    setIsMature(initialImageState.isMature);
    setTargetCategoryId(currentCategory.galleryImageCategoryId);
  }, [currentCategory.galleryImageCategoryId, currentCategory.isMatureContent]);

  // --- Effect: Update form fields when a new image is selected for UPDATE ---
  useEffect(() => {
    const data = imageToEdit || initialImageState;

    if (selectedView === "UPDATE" && imageToEdit) {
      setAltText(data.altText);
      setIsFeatured(data.isFeatured);
      setIsMature(imageToEdit?.isMatureContent ?? initialImageState.isMature);
      setTargetCategoryId(currentCategory.galleryImageCategoryId);
    } else if (selectedView === "ADD") {
      // Reset to defaults for ADD view
      setAltText(initialImageState.altText);
      setIsFeatured(initialImageState.isFeatured);
      setIsMature(initialImageState.isMature);
      setTargetCategoryId(currentCategory.galleryImageCategoryId);
    }
  }, [imageToEdit, selectedView, currentCategory.galleryImageCategoryId]);

  // --- Event Handlers ---

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  // --- 1. POST (Add Single Image) ---
  const handleAddImage = async () => {
    if (!fileToUpload || !targetCategoryId) {
      setError("Please select a file and a target category.");
      return;
    }
    setLoading(true);
    setError(null);

    // Mocking ImageUrl for now as file storage is simulated on backend
    const imageUrl = `/images/upload/${fileToUpload.name}`;

    const metadata: GallerySingleCreate = {
      categoryId: targetCategoryId,
      imageUrl: imageUrl,
      altText: altText || fileToUpload.name, // Use file name if alt text is empty
      isFeatured: isFeatured,
      isMatureContent: isMature,
    };

    try {
      await new GalleryClient().createSingleImage(metadata, fileToUpload);
      handleSuccess();
    } catch (err) {
      setError(
        `Failed to add image: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- 2. PUT (Update Single Image) ---
  const handleUpdateImage = async () => {
    if (!selectedImageId || !imageToEdit || targetCategoryId === 0) {
      setError("Please select an image and a valid target category.");
      return;
    }
    setLoading(true);
    setError(null);

    // NOTE: For simplicity, the PUT DTO only accepts category move and maturity flag.
    // AltText update would require modifying the backend DTO and endpoint.
    const updateData: GallerySingleUpdate = {
      newGalleryImageCategoryId: targetCategoryId,
      isMatureContent: isMature,
    };

    try {
      await new GalleryClient().updateSingleImage(selectedImageId, updateData);
      handleSuccess();
    } catch (err) {
      setError(
        `Failed to update image: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- 3. DELETE (Delete Single Image) ---
  const handleDeleteImage = async () => {
    if (!selectedImageId || !imageToEdit) {
      setError("Please select an image to delete.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete the image: ${imageToEdit.altText}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new GalleryClient().deleteImage(selectedImageId);
      handleSuccess();
    } catch (err) {
      setError(
        `Failed to delete image: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic: Determine the form content based on selectedView ---
  const renderFormContent = () => {
    // const isUpdateOrDelete =
    //   selectedView === "UPDATE" || selectedView === "DELETE";
    const isAdd = selectedView === "ADD";

    // Dropdown options for target category (for ADD and UPDATE/MOVE)
    const categoryOptions = allFolders.map((f) => (
      <option key={f.galleryImageCategoryId} value={f.galleryImageCategoryId}>
        {f.name}
      </option>
    ));

    return (
      <div className={styles.formContainer}>
        {/* --- 1. Image Selection (for UPDATE/DELETE) --- */}
        {isUpdateOrDelete && (
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
        )}

        {/* --- 2. Action Specific Content --- */}
        {selectedView === "ADD" && (
          <>
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
          </>
        )}

        {selectedView !== "DELETE" && (
          <>
            {/* --- 3. Target Category (for ADD/MOVE) --- */}
            <div className={styles.formGroup}>
              <label htmlFor="target-category">
                {isAdd ? "Target Category" : "Move to Category"}
              </label>
              <select
                id="target-category"
                className={styles.textInput}
                value={targetCategoryId}
                onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                disabled={loading}
              >
                {categoryOptions}
              </select>
            </div>

            {/* --- 4. Metadata Inputs --- */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  disabled={loading}
                />
                Mark as **Featured** (Will un-feature current image in target
                category)
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
                Mark as **Mature Content**
              </label>
            </div>

            {isAdd && ( // Only show Alt Text input on ADD view
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
            )}
          </>
        )}

        {/* --- 5. Preview for Delete --- */}
        {selectedView === "DELETE" && imageToEdit && (
          <div className={styles.deletePreview}>
            <p>
              You are about to delete Image ID: **{imageToEdit.galleryImageId}**
            </p>
            <img
              src={imageToEdit.imageUrl}
              alt={imageToEdit.altText}
              className={styles.previewImage}
            />
            <p>Category: **{imageToEdit.categoryName}**</p>
          </div>
        )}
      </div>
    );
  };

  // --- Main Render ---
  return (
    <Modal
      onClose={onClose}
      title={`Manage Images in: ${currentCategory.name}`}
    >
      <div className={styles.managerContainer}>
        {/* View Toggle Buttons */}
        <div className={styles.viewToggleGroup}>
          <button
            className={
              selectedView === "ADD"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setSelectedView("ADD")}
            disabled={loading}
          >
            ➕ Add Single Image
          </button>
          <button
            className={
              selectedView === "UPDATE"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setSelectedView("UPDATE")}
            disabled={loading}
          >
            ✍️ Update/Move Image
          </button>
          <button
            className={
              selectedView === "DELETE"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setSelectedView("DELETE")}
            disabled={loading}
          >
            🗑️ Delete Image
          </button>
        </div>

        {/* Error Display */}
        {error && <div className={styles.errorMessage}>Error: {error}</div>}

        {/* Form Content */}
        <div className={styles.viewContent}>{renderFormContent()}</div>

        {/* Action Button */}
        <div className={styles.actionGroup}>
          <button
            className={styles.submitButton}
            onClick={
              selectedView === "ADD"
                ? handleAddImage
                : selectedView === "UPDATE"
                ? handleUpdateImage
                : handleDeleteImage
            }
            disabled={loading || (isUpdateOrDelete && selectedImageId === null)}
          >
            {loading
              ? "Processing..."
              : selectedView === "ADD"
              ? "Submit Image"
              : selectedView === "UPDATE"
              ? "Update & Move Image"
              : "CONFIRM DELETE"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageManagerModal;
