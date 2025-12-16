import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { GalleryClient } from "../../api/GalleryClient";
import {
  type GalleryCategory,
  type GalleryImage,
  type GalleryBatchCreateMetadata,
  type ImageMetadata,
  type GalleryFolderUpdate,
} from "../../api/types/GalleryTypes";

const galleryClient = new GalleryClient();

interface UseGalleryAdminProps {
  folders: GalleryCategory[];
  onClose: () => void;
  onGalleryRefresh: () => void;
}

export const useGalleryAdmin = ({
  folders,
  onClose,
  onGalleryRefresh,
}: UseGalleryAdminProps) => {
  const [currentView, setCurrentView] = useState<"create" | "update">("create");

  // --- Create State ---
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isMatureContent, setIsMatureContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number | null>(null);

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

  // Sync update state when a folder is selected
  useEffect(() => {
    if (selectedFolder) {
      setUpdateIsMatureContent(selectedFolder.isMatureContent);
      setFolderImages([]);
      setUpdateFeaturedImageId(null);

      const fetchImages = async () => {
        setIsLoadingImages(true);
        try {
          const images = await galleryClient.getImagesByCategoryName(
            selectedFolder.name
          );
          setFolderImages(images);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      if (filesArray.length > 0 && featuredIndex === null) {
        setFeaturedIndex(0);
      }
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || featuredIndex === null) {
      alert("Please select images and designate a featured image.");
      return;
    }
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      const imagesMetadata: ImageMetadata[] = selectedFiles.map((_, index) => ({
        isFeatured: index === featuredIndex,
      }));

      const metadata: GalleryBatchCreateMetadata = {
        categoryName: newCategoryName.trim(),
        isMatureContent: isMatureContent,
        images: imagesMetadata,
      };

      await galleryClient.batchCreateImages(metadata, selectedFiles);
      alert(`Album "${newCategoryName}" created successfully!`);
      onGalleryRefresh();

      // Reset
      setNewCategoryName("");
      setIsMatureContent(false);
      setSelectedFiles([]);
      setFeaturedIndex(null);
      onClose();
    } catch (error) {
      console.error("Batch upload failed:", error);
      alert(
        `Failed to create album. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  const handleUpdateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolder || updateFeaturedImageId === null) {
      alert("Please select a folder and a featured image.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to update metadata for "${selectedFolder.name}"?`
      )
    )
      return;

    try {
      const updateData: GalleryFolderUpdate = {
        isMatureContent: updateIsMatureContent,
        featuredImageId: updateFeaturedImageId,
      };
      await galleryClient.updateFolderMetadata(
        selectedFolder.galleryImageCategoryId,
        updateData
      );
      alert(`Album "${selectedFolder.name}" updated successfully!`);
      onGalleryRefresh();
      onClose();
    } catch (error) {
      console.error("Folder update failed:", error);
      alert(
        `Failed to update folder. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    if (
      !window.confirm(
        `⚠️ CRITICAL: Delete entire album "${selectedFolder.name}" and all images?`
      )
    )
      return;

    try {
      await galleryClient.deleteFolder(selectedFolder.galleryImageCategoryId);
      alert(`Album "${selectedFolder.name}" deleted.`);
      onGalleryRefresh();
      onClose();
    } catch (error) {
      console.error("Folder deletion failed:", error);
      alert(
        `Failed to delete folder. (Error: ${
          error instanceof AxiosError ? error.response?.status : "Unknown"
        })`
      );
    }
  };

  return {
    // View State
    currentView,
    setCurrentView,
    // Create Form State/Handlers
    newCategoryName,
    setNewCategoryName,
    isMatureContent,
    setIsMatureContent,
    selectedFiles,
    featuredIndex,
    setFeaturedIndex,
    handleFileChange,
    handleBatchSubmit,
    // Update Form State/Handlers
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
  };
};
