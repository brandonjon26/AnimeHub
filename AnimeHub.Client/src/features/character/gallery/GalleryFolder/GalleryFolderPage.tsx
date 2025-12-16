import React from "react";
import ImageViewer from "./ImageViewer";
import { ImageManagerModal } from "../ImageManagerModal";
import { useGalleryFolder } from "../../../../hooks/TS/useGalleryFolder";
import styles from "./Gallery.module.css";
import pageStyles from "../../AboutCharacterPage.module.css";

const GalleryFolderPage: React.FC = () => {
  const {
    categoryName,
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
    refreshImages,
  } = useGalleryFolder();

  if (isLoading) {
    return (
      <div className={pageStyles.pageContainer}>
        Loading {categoryName} album...
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageStyles.pageContainer}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Exit Album
        </button>
        <h1 className={styles.errorTitle}>Access Error</h1>
        <p className={pageStyles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={pageStyles.pageContainer}>
      <div className={styles.buttonHeaderContainer}>
        <button onClick={handleGoBack} className={styles.backButton}>
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

      <h1>{categoryName}</h1>

      {images.length === 0 ? (
        <p>This album is currently empty or does not exist.</p>
      ) : (
        <div className={styles.galleryGrid}>
          {images.map((img, index) => (
            <img
              key={img.galleryImageId}
              src={img.imageUrl}
              alt={img.altText}
              className={styles.galleryGridImage}
              onClick={() => setViewerIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Full-Screen Viewer */}
      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Image Manager Modal */}
      {isManagerOpen && currentFolder && (
        <ImageManagerModal
          onClose={() => setIsManagerOpen(false)}
          onSuccess={refreshImages}
          currentCategory={currentFolder}
          imagesInFolder={images}
          allFolders={allFolders}
        />
      )}
    </div>
  );
};

export default GalleryFolderPage;
