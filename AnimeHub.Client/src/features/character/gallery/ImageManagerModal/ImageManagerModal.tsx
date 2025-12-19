import React from "react";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../../../api/types/GalleryTypes";
import { useImageManager } from "../../../../hooks/TS/useImageManager";
import { ImageAddForm } from "./components/ImageAddForm";
import { ImageSelector } from "./components/ImageSelector";
import { ImageUpdateForm } from "./components/ImageUpdateForm";
import { ImageDeleteForm } from "./components/ImageDeleteForm";
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
    fileToUpload,
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
          fileToUpload={fileToUpload}
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
        <ImageSelector
          imagesInFolder={props.imagesInFolder}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          selectedView={selectedView}
          loading={loading}
        />

        {selectedView === "UPDATE" && (
          <ImageUpdateForm
            allFolders={props.allFolders}
            targetCategoryId={targetCategoryId}
            setTargetCategoryId={setTargetCategoryId}
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
            isMature={isMature}
            setIsMature={setIsMature}
            loading={loading}
            currentImageUrl={imageToEdit?.imageUrl}
            altText={imageToEdit?.altText}
          />
        )}

        {selectedView === "DELETE" && (
          <ImageDeleteForm imageToEdit={imageToEdit} />
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
