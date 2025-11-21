import {
  type GalleryCategory,
  type GalleryImage,
  type GalleryBatchCreateMetadata,
  type GalleryFolderUpdate,
  type GallerySingleCreate,
  type GallerySingleUpdate,
} from "./types/GalleryTypes";
import apiClient from "./apiClient";
import axios, { AxiosError, isAxiosError } from "axios";

// The base path for gallery endpoints relative to API_BASE_URL
const GALLERY_BASE_PATH = "/api/gallery";

/**
 * Client service to interact with the backend /api/gallery endpoints.
 */
export class GalleryClient {
  /**
   * Fetches the list of album folders (categories) and their metadata.
   * Maps to: GET /api/gallery/folders
   */
  public async getFolders(): Promise<GalleryCategory[]> {
    const response = await apiClient.get<GalleryCategory[]>(
      `${GALLERY_BASE_PATH}/folders`
    );
    // Axios wraps the response data in a 'data' property
    return response.data;
  }

  /**
   * Fetches the two designated featured images for the index page.
   * Maps to: GET /api/gallery/featured
   */
  public async getFeaturedImages(): Promise<GalleryImage[]> {
    const response = await apiClient.get<GalleryImage[]>(
      `${GALLERY_BASE_PATH}/featured`
    );
    return response.data;
  }

  /**
   * Fetches all images belonging to a specific album/category.
   * Maps to: GET /api/gallery/{categoryName}
   */
  public async getImagesByCategoryName(
    categoryName: string
  ): Promise<GalleryImage[]> {
    // Axios handles URL encoding automatically, but explicit encoding is safer
    const encodedName = encodeURIComponent(categoryName);

    try {
      const response = await apiClient.get<GalleryImage[]>(
        `${GALLERY_BASE_PATH}/${encodedName}`
      );
      return response.data;
    } catch (error) {
      // Check if the error is a 404 (Not Found) from the backend
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return []; // Return empty array on not found, as per our API contract
      }
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Creates a new album/category and uploads a batch of images to it.
   * Maps to: POST /api/gallery/batch
   * @param metadata - Category name, mature flag, and the index of the featured image.
   * @param files - Array of image File objects to be uploaded.
   */
  public async batchCreateImages(
    metadata: GalleryBatchCreateMetadata, // Updated type name
    files: File[]
  ): Promise<void> {
    // 1. Construct FormData object
    const formData = new FormData();

    // 2. Serialize the entire metadata object to a JSON string
    formData.append("Metadata", JSON.stringify(metadata));

    // 3. Append files
    files.forEach((file) => {
      // The key "Files" must match the property name in GalleryImageCreateBatchDto
      formData.append("Files", file);
    });

    // 4. Send the POST request
    await apiClient.post<void>(`${GALLERY_BASE_PATH}/batch`, formData, {
      headers: {
        // "Content-Type": "multipart/form-data",
      },
    });
  }

  // ----------------------------------------------------------------------
  // SINGLE IMAGE CRUD OPERATIONS
  // ----------------------------------------------------------------------

  /**
   * POST /api/gallery/images/single: Adds a single image file to an existing category.
   * @param metadata - Category ID, URL, Alt Text, Featured status, and Mature flag.
   * @param file - The image file to upload.
   * @returns The newly created GalleryImage object on success.
   */
  public async createSingleImage(
    metadata: GallerySingleCreate,
    file: File
  ): Promise<GalleryImage> {
    const formData = new FormData();
    formData.append("File", file); // Assuming the backend expects a single file key 'File'

    // Append all DTO metadata fields as strings for the form data
    formData.append("CategoryId", metadata.categoryId.toString());
    formData.append("ImageUrl", metadata.imageUrl);
    formData.append("AltText", metadata.altText);
    formData.append("IsFeatured", metadata.isFeatured.toString());
    formData.append("IsMatureContent", metadata.isMatureContent.toString()); // The new flag

    const response = await apiClient.post<GalleryImage>(
      `${GALLERY_BASE_PATH}/single`,
      formData,
      {
        headers: {
          // "Content-Type": "multipart/form-data", // Axios handles this
        },
      }
    );

    return response.data;
  }

  /**
   * PUT /api/gallery/images/{imageId}: Updates the category and maturity flag of a single image.
   * @param imageId - The ID of the image to update.
   * @param updateData - The new category ID and maturity flag.
   */
  public async updateSingleImage(
    imageId: number,
    updateData: GallerySingleUpdate
  ): Promise<void> {
    // Axios handles serializing the JSON body and setting Content-Type
    await apiClient.put<void>(
      `${GALLERY_BASE_PATH}/images/${imageId}`,
      {
        newGalleryImageCategoryId: updateData.newGalleryImageCategoryId,
        isMatureContent: updateData.isMatureContent,
      } // The request body matches the GalleryImageUpdateSingleDto fields
    );
    // Success returns 204 No Content, so we expect the promise to resolve without data.
  }

  /**
   * DELETE /api/gallery/images/{imageId}: Deletes a single image record.
   * @param imageId - The ID of the image to delete.
   */
  public async deleteImage(imageId: number): Promise<void> {
    await apiClient.delete<void>(`${GALLERY_BASE_PATH}/images/${imageId}`);
    // Success returns 204 No Content, so we expect the promise to resolve without data.
  }

  /**
   * Updates metadata for an entire gallery folder/category.
   * Maps to: PUT /api/gallery/folder/{categoryId:int}
   * @param categoryId - The ID of the category/folder to update.
   * @param updateData - The new mature flag and the ID of the new featured image.
   */
  public async updateFolderMetadata(
    categoryId: number,
    updateData: GalleryFolderUpdate
  ): Promise<void> {
    // Note: The backend expects the categoryId in the path, not the body.
    await apiClient.put<void>(
      `${GALLERY_BASE_PATH}/folder/${categoryId}`,
      updateData
    );
    // Success returns 204 No Content, so we expect the promise to resolve without data.
  }

  /**
   * Deletes an entire gallery folder/category and all its images.
   * Maps to: DELETE /api/gallery/folder/{categoryId:int}
   * @param categoryId - The ID of the category/folder to delete.
   */
  public async deleteFolder(categoryId: number): Promise<void> {
    await apiClient.delete<void>(`${GALLERY_BASE_PATH}/folder/${categoryId}`);
    // Success returns 204 No Content, so we expect the promise to resolve without data.
  }
}
