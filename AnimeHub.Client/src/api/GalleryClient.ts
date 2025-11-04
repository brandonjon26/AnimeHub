import { type GalleryCategory, type GalleryImage } from "./types/GalleryTypes";
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
}
