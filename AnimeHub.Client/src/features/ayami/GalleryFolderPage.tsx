import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GalleryClient } from "../../api/GalleryClient";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import ImageViewer from "./ImageViewer";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Gallery.module.css";
import pageStyles from "./AboutAyamiPage.module.css"; // Keep page container styles

const galleryClient = new GalleryClient();

const GalleryFolderPage: React.FC = () => {
  // Access User Auth State
  const { user } = useAuth();
  const isAdult = user?.isAdult ?? false;

  // Get the dynamic part of the URL (the category name)
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate(); // Hook for the "Back" button

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null); // State for the full-screen viewer

  // Back Button Logic
  const handleGoBack = () => {
    navigate("/ayami"); // Navigates directly back to the index page
    // Alternatively, navigate(-1) goes back one history step, but /ayami is safer.
  };

  useEffect(() => {
    if (!categoryName) return;

    const fetchImagesWithAccessCheck = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch ALL Categories to check the 'isMatureContent' flag
        const folders: GalleryCategory[] = await galleryClient.getFolders();
        const targetFolder = folders.find(
          (folder) => folder.name === decodeURIComponent(categoryName)
        );

        if (!targetFolder) {
          setError(`Album '${decodeURIComponent(categoryName)}' not found.`);
          return;
        }

        // 2. Perform Access Check (Frontend Restriction)
        if (targetFolder.isMatureContent && !isAdult) {
          setError(
            "Access Denied. This album contains mature content. Please log in as an adult user to view."
          );
          return; // Stop execution if restricted
        }

        // 3. Fetch Images (Only if access is granted)
        const fetchedImages = await galleryClient.getImagesByCategoryName(
          categoryName
        );
        setImages(fetchedImages);

        if (fetchedImages.length === 0) {
          setError(`Album '${decodeURIComponent(categoryName)}' is empty.`);
        }
      } catch (err) {
        setError("Failed to load album images.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagesWithAccessCheck();
  }, [categoryName, isAdult]);

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
      <button
        onClick={handleGoBack}
        className={styles.backButton} // 🔑 Use module style
      >
        ← Exit Album
      </button>

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
    </div>
  );
};

export default GalleryFolderPage;
