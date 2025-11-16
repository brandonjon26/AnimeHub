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
