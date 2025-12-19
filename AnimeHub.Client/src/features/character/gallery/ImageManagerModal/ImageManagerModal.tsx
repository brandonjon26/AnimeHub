import React from "react";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../../../api/types/GalleryTypes";
import { useImageManager } from "../../../../hooks/TS/useImageManager";
import { ImageAddForm } from "./components/ImageAddForm";
import { ImageSelector } from "./components/ImageSelector";
import styles from "./ImageManagerModal.module.css";
import Modal from "../../../../components/common/modal";

interface ImageManagerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentCategory: GalleryCategory;
  imagesInFolder: GalleryImage[];
  allFolders: GalleryCategory[];
}

const ImageManagerModal: React.FC<ImageManagerModalProps> = (props) => {
  const {
    selectedView,
    setSelectedView,
    selectedImageId,
    setSelectedImageId,
    setFileToUpload,
    isFeatured,
    setIsFeatured,
    isMature,
    setIsMature,
    altText,
    setAltText,
    targetCategoryId,
    setTargetCategoryId,
    loading,
    error,
    imageToEdit,
    isUpdateOrDelete,
    handleAddImage,
    handleUpdateImage,
    handleDeleteImage,
  } = useImageManager(props);

  const renderFormContent = () => {
    // 1. ADD View
    if (selectedView === "ADD") {
      return (
        <ImageAddForm
          allFolders={props.allFolders}
          targetCategoryId={targetCategoryId}
          setTargetCategoryId={setTargetCategoryId}
          setFileToUpload={setFileToUpload}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isMature={isMature}
          setIsMature={setIsMature}
          altText={altText}
          setAltText={setAltText}
          loading={loading}
        />
      );
    }

    // 2. UPDATE & DELETE Views (Shared logic)
    return (
      <div className={styles.formContainer}>
        {/* 🆕 Shared Selector */}
        <ImageSelector
          imagesInFolder={props.imagesInFolder}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          selectedView={selectedView}
          loading={loading}
        />

        {selectedView === "UPDATE" && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="target-category">Move to Category</label>
              <select
                id="target-category"
                className={styles.textInput}
                value={targetCategoryId}
                onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                disabled={loading}
              >
                {props.allFolders.map((f) => (
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
        )}

        {selectedView === "DELETE" && imageToEdit && (
          <div className={styles.deletePreview}>
            <p>
              You are about to delete Image ID:{" "}
              <strong>{imageToEdit.galleryImageId}</strong>
            </p>
            <img
              src={imageToEdit.imageUrl}
              alt={imageToEdit.altText}
              className={styles.previewImage}
            />
            <p>
              Category: <strong>{imageToEdit.categoryName}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      onClose={props.onClose}
      title={`Manage Images in: ${props.currentCategory.name}`}
    >
      <div className={styles.managerContainer}>
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

        {error && <div className={styles.errorMessage}>Error: {error}</div>}

        <div className={styles.viewContent}>{renderFormContent()}</div>

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
