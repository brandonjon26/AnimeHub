import React from "react";
import { type GalleryImage } from "../../../../../../api/types/GalleryTypes";
import styles from "./ImageDeleteForm.module.css";

interface ImageDeleteFormProps {
  imageToEdit: GalleryImage | null;
}

const ImageDeleteForm: React.FC<ImageDeleteFormProps> = ({ imageToEdit }) => {
  if (!imageToEdit) return null;

  return (
    <div className={styles.deletePreview}>
      <p>
        You are about to delete Image ID:{" "}
        <strong>{imageToEdit.galleryImageId}</strong>
      </p>
      <img
        src={imageToEdit.imageUrl}
        alt={imageToEdit.altText}
        className={styles.previewImage}
      />
      <p>
        Category: <strong>{imageToEdit.categoryName}</strong>
      </p>
    </div>
  );
};

export default ImageDeleteForm;
