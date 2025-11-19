// Matches the backend's GalleryCategoryDto
export interface GalleryCategory {
  galleryImageCategoryId: number;
  name: string; // e.g., "Standard Anime/Isekai"
  coverUrl: string; // e.g., /images/ayami/standard/ayami_standard_01.png
  isMatureContent: boolean;
}

// Matches the backend's GalleryImageDto
export interface GalleryImage {
  galleryImageId: number;
  imageUrl: string;
  altText: string;
  isFeatured: boolean;
  categoryName: string; // e.g., "Standard Anime/Isekai"
  isMatureContent: boolean;
}

/**
 * Helper metadata for a single image within a batch upload.
 * Maps directly to the backend's ImageMetadataDto.
 * We omit ImageUrl and AltText as they are not needed on creation.
 */
export interface ImageMetadata {
  isFeatured: boolean;
  // We don't need ImageUrl or AltText here since we are sending files,
  // and the backend will generate the URL and use a default/empty AltText.
}

/**
 * Metadata required for creating a new gallery category and batch uploading images.
 * Maps to the non-file fields of the GalleryImageCreateBatchDto backend DTO.
 */
export interface GalleryBatchCreateMetadata {
  // 🔑 Renamed and added
  categoryName: string;
  isMatureContent: boolean;
  images: ImageMetadata[];
}

/**
 * Data required for updating a gallery category's metadata (PUT /api/gallery/folder/{categoryId}).
 * Maps directly to the backend's GalleryImageUpdateFolderDto.
 */
export interface GalleryFolderUpdate {
  isMatureContent: boolean;
  featuredImageId: number; // The ID of the image to be newly featured.
}
