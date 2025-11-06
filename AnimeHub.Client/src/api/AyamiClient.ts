import apiClient from "./apiClient";
import {
  type AyamiProfileDto,
  type AyamiProfileUpdateInput,
  type AyamiAttireInput,
} from "./types/AyamiTypes";
import axios, { AxiosError, isAxiosError } from "axios";

const AYAMI_BASE_URL = "/ayami-profile";

/**
 * Client for all Ayami Profile and Attire CRUD operations.
 */
export const AyamiClient = {
  // READ: GET /ayami-profile
  getProfile: async (): Promise<AyamiProfileDto> => {
    const response = await apiClient.get<AyamiProfileDto>(AYAMI_BASE_URL);
    return response.data;
  },

  // UPDATE: PUT /ayami-profile
  updateProfile: async (
    profileId: number,
    data: AyamiProfileUpdateInput
  ): Promise<void> => {
    // Returns 204 No Content on success
    await apiClient.put(`${AYAMI_BASE_URL}/${profileId}`, data);
  },

  // CREATE: POST /ayami-profile/attire
  addAttire: async (
    profileId: number,
    data: AyamiAttireInput
  ): Promise<number> => {
    const response = await apiClient.post<number>(
      `${AYAMI_BASE_URL}/${profileId}/attire`,
      data
    );
    // Backend returns the ID of the newly created attire
    return response.data;
  },

  // DELETE: DELETE /ayami-profile/attire/{attireId}
  deleteAttire: async (attireId: number): Promise<void> => {
    // Returns 204 No Content on success
    await apiClient.delete(`${AYAMI_BASE_URL}/attire/${attireId}`);
  },
};
