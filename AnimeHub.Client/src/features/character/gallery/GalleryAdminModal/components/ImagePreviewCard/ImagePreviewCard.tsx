import React from "react";
import styles from "./ImagePreviewCard.module.css";

interface ImagePreviewCardProps {
  imageUrl: string;
  altText: string;
  label: string;
  isFeatured: boolean;
  onClick: () => void;
  // Optional: For cleaning up Object URLs in the "Create" view
  onLoad?: () => void;
}

const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  imageUrl,
  altText,
  label,
  isFeatured,
  onClick,
  onLoad,
}) => {
  return (
    <div
      className={`${styles.previewCard} ${isFeatured ? styles.featured : ""}`}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={altText}
        className={styles.previewImage}
        onLoad={onLoad}
      />
      <p className={styles.fileName}>{label}</p>
      {isFeatured && (
        <span className={styles.featuredTag}>
          ⭐ {label.includes("ID") ? "New Featured Cover" : "Featured Cover"}
        </span>
      )}
    </div>
  );
};

export default ImagePreviewCard;
