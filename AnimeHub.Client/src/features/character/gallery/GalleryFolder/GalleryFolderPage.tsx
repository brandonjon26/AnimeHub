import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GalleryClient } from "../../../../api/GalleryClient";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../../../api/types/GalleryTypes";
import ImageViewer from "./ImageViewer";
import { ImageManagerModal } from "../ImageManagerModal";
import { useAuth } from "../../../../hooks/useAuth";
import styles from "./Gallery.module.css";
import pageStyles from "../../AboutCharacterPage.module.css"; // Keep page container styles

const galleryClient = new GalleryClient();

const GalleryFolderPage: React.FC = () => {
  // Access User Auth State
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;
  const isAdult = user?.isAdult ?? false;

  // Get the dynamic part of the URL (the category name)
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate(); // Hook for the "Back" button

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [allFolders, setAllFolders] = useState<GalleryCategory[]>([]); // 🔑 New State: Store all folders
  const [currentFolder, setCurrentFolder] = useState<GalleryCategory | null>(
    null
  ); // 🔑 New State: Store the current folder object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null); // State for the full-screen viewer
  const [isManagerOpen, setIsManagerOpen] = useState(false); // 🔑 NEW STATE: Image Manager Modal Control

  // Function to fetch data, wrapped in useCallback to avoid infinite loop
  const fetchImagesWithAccessCheck = useCallback(async () => {
    if (!categoryName) return;

    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch ALL Categories to check the 'isMatureContent' flag and store the full list
      const folders: GalleryCategory[] = await galleryClient.getFolders();
      setAllFolders(folders); // Store full list for the modal
      const targetFolder = folders.find(
        (folder) => folder.name === decodeURIComponent(categoryName)
      );
      if (!targetFolder) {
        setError(`Album '${decodeURIComponent(categoryName)}' not found.`);
        return;
      }
      setCurrentFolder(targetFolder); // Store current folder object // 2. Perform Access Check (Frontend Restriction)
      if (targetFolder.isMatureContent && !isAdult) {
        setError(
          "Access Denied. This album contains mature content. Please log in as an adult user to view."
        );
        return;
      } // 3. Fetch Images (Only if access is granted)

      const fetchedImages = await galleryClient.getImagesByCategoryName(
        categoryName
      );
      setImages(fetchedImages);

      if (fetchedImages.length === 0 && !isAdmin) {
        // Admin might see empty folders
        setError(`Album '${decodeURIComponent(categoryName)}' is empty.`);
      }
    } catch (err) {
      setError("Failed to load album images.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryName, isAdult, isAdmin]);

  // Back Button Logic
  const handleGoBack = () => {
    navigate("/ayami"); // Navigates directly back to the index page
    // Alternatively, navigate(-1) goes back one history step, but /ayami is safer.
  };

  // Refetch data when dependencies change or when modal operation succeeds
  useEffect(() => {
    fetchImagesWithAccessCheck();
  }, [fetchImagesWithAccessCheck]);

  // Decode name for display
  const decodedName = decodeURIComponent(categoryName || "Unknown Album");

  if (isLoading)
    return (
      <div className={pageStyles.pageContainer}>
        Loading {decodedName} album...
      </div>
    );
  if (error)
    return (
      <div className={pageStyles.pageContainer} style={{ color: "red" }}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Exit Album
        </button>
        <h1 style={{ color: "red" }}>Access Error</h1>
        <p className={pageStyles.errorMessage}>{error}</p>
      </div>
    );

  return (
    // Use pageStyles.pageContainer for the main padding/width
    <div className={pageStyles.pageContainer}>
      <div className={styles.buttonHeaderContainer}>
        <button
          onClick={handleGoBack}
          className={styles.backButton} // 🔑 Use module style
        >
          ← Exit Album
        </button>

        {isAdmin && currentFolder && (
          <button
            onClick={() => setIsManagerOpen(true)}
            className={styles.adminButton}
          >
            Manage Images 🛠️
          </button>
        )}
      </div>

      <h1>{decodedName}</h1>

      {images.length === 0 && (
        <p>This album is currently empty or does not exist.</p>
      )}

      {/* Image Grid */}
      <div className={styles.galleryGrid}>
        {" "}
        {/* 🔑 Use module style */}
        {images.map((img, index) => (
          <img
            key={img.galleryImageId}
            src={img.imageUrl}
            alt={img.altText}
            className={styles.galleryGridImage} // 🔑 Use module style
            onClick={() => setViewerIndex(index)}
          />
        ))}
      </div>

      {/* Full-Screen Viewer */}
      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Image Manager Modal (Conditionally Rendered by Parent) */}
      {isManagerOpen && currentFolder && (
        <ImageManagerModal
          onClose={() => setIsManagerOpen(false)}
          onSuccess={fetchImagesWithAccessCheck} // Refreshes images and folders
          currentCategory={currentFolder}
          imagesInFolder={images}
          allFolders={allFolders}
        />
      )}
    </div>
  );
};

export default GalleryFolderPage;
