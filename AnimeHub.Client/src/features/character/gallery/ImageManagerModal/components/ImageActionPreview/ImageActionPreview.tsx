import React from "react";
import { useImagePreview } from "../../../../../../hooks/JS/useImagePreview";
import styles from "./ImageActionPreview.module.css";

interface ImageActionPreviewProps {
  file?: File | null; // From Add View
  imageUrl?: string; // From Update View
  altText?: string;
  label?: string;
}

const ImageActionPreview: React.FC<ImageActionPreviewProps> = ({
  file,
  imageUrl,
  altText,
  label,
}) => {
  const previewUrl = useImagePreview(file ?? null, imageUrl);

  if (!previewUrl) return null;

  return (
    <div className={styles.previewContainer}>
      {label && <span className={styles.previewLabel}>{label}</span>}
      <div className={styles.imageWrapper}>
        <img
          src={previewUrl}
          alt={altText || "Preview"}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default ImageActionPreview;
