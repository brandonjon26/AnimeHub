import {
  type GalleryCategory,
  type GalleryImage,
  type GalleryBatchCreateMetadata,
  type GalleryFolderUpdate,
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
