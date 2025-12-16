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

// Initialize client (can be passed in via context/prop if preferred, but OK here for a large file cleanup)
const galleryClient = new GalleryClient();

interface UseGalleryAdminProps {
  folders: GalleryCategory[];
  onGalleryRefresh: () => void;
  onClose: () => void;
}

export const useGalleryAdmin = ({
  folders,
  onGalleryRefresh,
  onClose,
}: UseGalleryAdminProps) => {
  const [currentView, setCurrentView] = useState<"create" | "update">("create");

  // --- Create View State ---
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

  // Effect to fetch images and populate state when a folder is selected for update
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

  // Handler for file selection (Create View)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      if (filesArray.length > 0 && featuredIndex === null) {
        setFeaturedIndex(0);
      }
    }
  };

  // Handler for batch submission (Create View)
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
      onGalleryRefresh(); // Refresh parent data

      // Reset form and close modal
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

  // Handler for folder metadata update (Update View)
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

      await galleryClient.updateFolderMetadata(
        selectedFolder.galleryImageCategoryId,
        updateData
      );

      alert(`Album "${selectedFolder.name}" metadata updated successfully!`);
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

  // Handler for folder deletion (Update View)
  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;

    if (
      !window.confirm(
        `⚠️ CRITICAL WARNING: This action will permanently delete the entire album "${selectedFolder.name}". Are you absolutely sure?`
      )
    ) {
      return;
    }

    try {
      await galleryClient.deleteFolder(selectedFolder.galleryImageCategoryId);

      alert(`Album "${selectedFolder.name}" and all images have been deleted.`);
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
    // View Control
    currentView,
    setCurrentView,

    // Create View State & Handlers
    newCategoryName,
    setNewCategoryName,
    isMatureContent,
    setIsMatureContent,
    selectedFiles,
    setSelectedFiles,
    featuredIndex,
    setFeaturedIndex,
    handleFileChange,
    handleBatchSubmit,

    // Update View State & Handlers
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
