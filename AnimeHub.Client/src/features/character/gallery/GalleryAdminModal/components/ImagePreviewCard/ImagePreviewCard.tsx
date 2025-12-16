import React from "react";
import styles from "./ImagePreviewCard.module.css";

interface ImagePreviewCardProps {
  src: string;
  alt: string;
  label: string;
  isFeatured: boolean;
  featuredTagText: string;
  onClick: () => void;
}

const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  src,
  alt,
  label,
  isFeatured,
  featuredTagText,
  onClick,
}) => {
  return (
    <div
      className={`${styles.previewCard} ${isFeatured ? styles.featured : ""}`}
      onClick={onClick}
    >
      <img src={src} alt={alt} className={styles.previewImage} />
      <p className={styles.fileName}>{label}</p>
      {isFeatured && (
        <span className={styles.featuredTag}>⭐ {featuredTagText}</span>
      )}
    </div>
  );
};

export default ImagePreviewCard;
