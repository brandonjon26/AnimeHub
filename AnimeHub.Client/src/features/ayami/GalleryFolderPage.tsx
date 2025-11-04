import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GalleryClient } from "../../api/GalleryClient";
import { type GalleryImage } from "../../api/types/GalleryTypes";
import ImageViewer from "./ImageViewer";
// 🔑 Use dedicated Gallery styles instead of AboutAyamiPage styles
import styles from "./Gallery.module.css";
import pageStyles from "./AboutAyamiPage.module.css"; // Keep page container styles

const galleryClient = new GalleryClient();

const GalleryFolderPage: React.FC = () => {
  // Get the dynamic part of the URL (the category name)
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate(); // 🔑 Hook for the "Back" button

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null); // State for the full-screen viewer

  // 🔑 Back Button Logic
  const handleGoBack = () => {
    navigate("/ayami"); // Navigates directly back to the index page
    // Alternatively, navigate(-1) goes back one history step, but /ayami is safer.
  };

  useEffect(() => {
    if (!categoryName) return;

    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // The client handles URL encoding and 404 response (returns [])
        const fetchedImages = await galleryClient.getImagesByCategoryName(
          categoryName
        );
        setImages(fetchedImages);
        if (fetchedImages.length === 0) {
          // Only set an error if it's a structural failure, otherwise empty state is fine
          // For now, let's keep it simple: if images is empty, the UI will show empty state.
        }
      } catch (err) {
        setError("Failed to load album images.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [categoryName]);

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
        Error: {error}
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
