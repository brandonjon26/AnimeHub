import { useState, useEffect, useMemo } from "react";
import {
  type GalleryImage,
  type GalleryCategory,
  type GallerySingleCreate,
  type GallerySingleUpdate,
} from "../../api/types/GalleryTypes";
import { GalleryClient } from "../../api/GalleryClient";

const galleryClient = new GalleryClient();

export type AdminView = "ADD" | "UPDATE" | "DELETE";

const initialImageState = {
  isFeatured: false,
  isMature: false,
  altText: "",
  targetCategoryId: 0,
};

interface UseImageManagerProps {
  onClose: () => void;
  onSuccess: () => void;
  currentCategory: GalleryCategory;
  imagesInFolder: GalleryImage[];
}

export const useImageManager = ({
  onClose,
  onSuccess,
  currentCategory,
  imagesInFolder,
}: UseImageManagerProps) => {
  const [selectedView, setSelectedView] = useState<AdminView>("ADD");
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialImageState.isFeatured
  );
  const [isMature, setIsMature] = useState<boolean>(initialImageState.isMature);
  const [altText, setAltText] = useState<string>(initialImageState.altText);
  const [targetCategoryId, setTargetCategoryId] = useState<number>(
    currentCategory.galleryImageCategoryId
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageToEdit = useMemo(() => {
    return (
      imagesInFolder.find((img) => img.galleryImageId === selectedImageId) ||
      null
    );
  }, [selectedImageId, imagesInFolder]);

  const isUpdateOrDelete =
    selectedView === "UPDATE" || selectedView === "DELETE";

  // Reset state when category changes
  useEffect(() => {
    setSelectedView("ADD");
    setSelectedImageId(null);
    setFileToUpload(null);
    setLoading(false);
    setError(null);
    setAltText(initialImageState.altText);
    setIsFeatured(initialImageState.isFeatured);
    setIsMature(initialImageState.isMature);
    setTargetCategoryId(currentCategory.galleryImageCategoryId);
  }, [currentCategory.galleryImageCategoryId]);

  // Sync form fields when an image is selected for update
  useEffect(() => {
    if (selectedView === "UPDATE" && imageToEdit) {
      setAltText(imageToEdit.altText);
      setIsFeatured(imageToEdit.isFeatured);
      setIsMature(imageToEdit?.isMatureContent ?? initialImageState.isMature);
      setTargetCategoryId(currentCategory.galleryImageCategoryId);
    } else if (selectedView === "ADD") {
      setAltText(initialImageState.altText);
      setIsFeatured(initialImageState.isFeatured);
      setIsMature(initialImageState.isMature);
      setTargetCategoryId(currentCategory.galleryImageCategoryId);
    }
  }, [imageToEdit, selectedView, currentCategory.galleryImageCategoryId]);

  const handleSuccessCleanup = () => {
    onSuccess();
    onClose();
  };

  const handleAddImage = async () => {
    if (!fileToUpload || !targetCategoryId) {
      setError("Please select a file and a target category.");
      return;
    }
    setLoading(true);
    setError(null);

    const metadata: GallerySingleCreate = {
      categoryId: targetCategoryId,
      imageUrl: `/images/upload/${fileToUpload.name}`,
      altText: altText || fileToUpload.name,
      isFeatured,
      isMatureContent: isMature,
    };

    try {
      await galleryClient.createSingleImage(metadata, fileToUpload);
      handleSuccessCleanup();
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

  const handleUpdateImage = async () => {
    if (!selectedImageId || !imageToEdit || targetCategoryId === 0) {
      setError("Please select an image and a valid target category.");
      return;
    }
    setLoading(true);
    setError(null);

    const updateData: GallerySingleUpdate = {
      newGalleryImageCategoryId: targetCategoryId,
      isMatureContent: isMature,
    };

    try {
      await galleryClient.updateSingleImage(selectedImageId, updateData);
      handleSuccessCleanup();
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

  const handleDeleteImage = async () => {
    if (!selectedImageId || !imageToEdit) {
      setError("Please select an image to delete.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete: ${imageToEdit.altText}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await galleryClient.deleteImage(selectedImageId);
      handleSuccessCleanup();
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

  return {
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
  };
};
