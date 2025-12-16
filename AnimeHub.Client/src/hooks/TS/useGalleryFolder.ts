import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GalleryClient } from "../../api/GalleryClient";
import { useAuth } from "./useAuth";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";

const galleryClient = new GalleryClient();

export const useGalleryFolder = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;
  const isAdult = user?.isAdult ?? false;

  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [allFolders, setAllFolders] = useState<GalleryCategory[]>([]);
  const [currentFolder, setCurrentFolder] = useState<GalleryCategory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const fetchImagesWithAccessCheck = useCallback(async () => {
    if (!categoryName) return;

    setIsLoading(true);
    setError(null);
    try {
      const folders: GalleryCategory[] = await galleryClient.getFolders();
      setAllFolders(folders);

      const decodedCategory = decodeURIComponent(categoryName);
      const targetFolder = folders.find(
        (folder) => folder.name === decodedCategory
      );

      if (!targetFolder) {
        setError(`Album '${decodedCategory}' not found.`);
        return;
      }

      setCurrentFolder(targetFolder);

      if (targetFolder.isMatureContent && !isAdult) {
        setError(
          "Access Denied. This album contains mature content. Please log in as an adult user to view."
        );
        return;
      }

      const fetchedImages = await galleryClient.getImagesByCategoryName(
        categoryName
      );
      setImages(fetchedImages);

      if (fetchedImages.length === 0 && !isAdmin) {
        setError(`Album '${decodedCategory}' is empty.`);
      }
    } catch (err) {
      setError("Failed to load album images.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryName, isAdult, isAdmin]);

  useEffect(() => {
    fetchImagesWithAccessCheck();
  }, [fetchImagesWithAccessCheck]);

  const handleGoBack = () => navigate("/ayami");

  return {
    categoryName: decodeURIComponent(categoryName || "Unknown Album"),
    images,
    allFolders,
    currentFolder,
    isLoading,
    error,
    viewerIndex,
    setViewerIndex,
    isManagerOpen,
    setIsManagerOpen,
    isAdmin,
    handleGoBack,
    refreshImages: fetchImagesWithAccessCheck,
  };
};
