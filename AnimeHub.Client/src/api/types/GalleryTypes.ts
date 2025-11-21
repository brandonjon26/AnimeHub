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

// --- Interfaces for Single Image CRUD Input ---

/**
 * Data required for adding a single image to an existing category (POST /api/gallery/images/single).
 * Maps to the non-file fields of the backend's GalleryImageCreateSingleDto.
 * NOTE: The ImageUrl field is typically generated on the backend, but we'll include it here
 * if the file upload is simulated (using a dummy URL).
 */
export interface GallerySingleCreate {
  categoryId: number; // The existing category ID to add the image to.
  // In a real file upload scenario, these would be derived from the file/context:
  imageUrl: string; // Placeholder or generated URL
  altText: string;
  isFeatured: boolean;
  isMatureContent: boolean;
}

/**
 * Data required for updating a single image's metadata (PUT /api/gallery/images/{imageId}).
 * Maps directly to the backend's GalleryImageUpdateSingleDto.
 */
export interface GallerySingleUpdate {
  newGalleryImageCategoryId: number; // The category ID the image should be moved to.
  isMatureContent: boolean; // The new mature flag for the image.
  // NOTE: AltText updates are excluded for simplicity, relying only on category move and maturity flag.
}

// --- Interfaces for Batch CRUD ---

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
