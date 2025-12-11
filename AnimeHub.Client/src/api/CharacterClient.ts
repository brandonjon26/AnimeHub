import apiClient from "./apiClient";
import {
  type CharacterProfileDto,
  type CharacterProfileUpdateInput,
  type CharacterAttireInput,
  type LoreTypeDto,
  type LoreEntryDto,
  type LoreEntryInputDto,
  type LoreEntrySummaryDto,
} from "./types/CharacterTypes";
import axios, { AxiosError, isAxiosError } from "axios";

const CHARACTER_BASE_URL = "/characters";
const LORE_BASE_URL = "/lore";

/**
 * Client for all Character Profile, Attire, and Lore CRUD operations.
 */
export const CharacterClient = {
  // --- CHARACTER PROFILE OPERATIONS ---

  /**
   * READ: GET /characters/{characterName}
   * Fetches the full profile for a specific character (e.g., 'Ayami', 'Chiara').
   */
  getProfile: async (characterName: string): Promise<CharacterProfileDto> => {
    const response = await apiClient.get<CharacterProfileDto>(
      `${CHARACTER_BASE_URL}/${characterName}`
    );
    return response.data;
  },

  /**
   * UPDATE: PUT /characters/{characterName}/profile/{profileId}
   * Updates the main profile fields.
   */
  updateProfile: async (
    characterName: string,
    profileId: number,
    data: CharacterProfileUpdateInput
  ): Promise<void> => {
    // Returns 204 No Content on success
    await apiClient.put(
      `${CHARACTER_BASE_URL}/${characterName}/profile/${profileId}`,
      data
    );
  },

  // --- ATTIRE OPERATIONS ---

  /**
   * CREATE: POST /characters/{characterName}/{profileId}/attire
   * Adds a new attire collection to the character profile.
   */
  addAttire: async (
    characterName: string,
    profileId: number,
    data: CharacterAttireInput
  ): Promise<number> => {
    const response = await apiClient.post<number>(
      `${CHARACTER_BASE_URL}/${characterName}/${profileId}/attire`,
      data
    );
    // Backend returns the ID of the newly created attire
    return response.data;
  },

  /**
   * DELETE: DELETE /characters/attire/{attireId}
   * Deletes a specific attire by its ID.
   */
  deleteAttire: async (
    characterName: string,
    attireId: number
  ): Promise<void> => {
    // Returns 204 No Content on success
    await apiClient.delete(
      `${CHARACTER_BASE_URL}/${characterName}/attire/${attireId}`
    );
  },

  // --- LORE SYSTEM OPERATIONS ---

  /**
   * READ: GET /lore
   * Fetches a summary list of all available Lore Entries (ID and Title) for dropdowns.
   */
  getAllLoreEntries: async (): Promise<LoreEntrySummaryDto[]> => {
    // 🔑 NEW METHOD DEFINITION
    const response = await apiClient.get<LoreEntrySummaryDto[]>(LORE_BASE_URL);
    return response.data;
  },

  /**
   * READ: GET /lore/types
   * Fetches all available Lore Types (e.g., Quest, Origin) for lookups.
   */
  getLoreTypes: async (): Promise<LoreTypeDto[]> => {
    const response = await apiClient.get<LoreTypeDto[]>(
      `${LORE_BASE_URL}/types`
    );
    return response.data;
  },

  /**
   * READ: GET /lore/{loreEntryId}
   * Retrieves a single Lore Entry by its ID.
   */
  getLoreEntryById: async (loreEntryId: number): Promise<LoreEntryDto> => {
    const response = await apiClient.get<LoreEntryDto>(
      `${LORE_BASE_URL}/${loreEntryId}`
    );
    return response.data;
  },

  /**
   * CREATE: POST /lore
   * Creates a new Lore Entry and links characters.
   */
  createLoreEntry: async (data: LoreEntryInputDto): Promise<LoreEntryDto> => {
    const response = await apiClient.post<LoreEntryDto>(LORE_BASE_URL, data);
    return response.data;
  },

  /**
   * DELETE: DELETE /lore/{loreEntryId}
   * Deletes a Lore Entry (handled transactionally on the backend).
   */
  deleteLoreEntry: async (loreEntryId: number): Promise<void> => {
    await apiClient.delete(`${LORE_BASE_URL}/${loreEntryId}`);
  },

  /**
   * UPDATE: PUT /characters/{characterName}/greatest-feat/{profileId}
   * Updates the GreatestFeatLoreId link for a specific character.
   */
  updateGreatestFeat: async (
    characterName: string,
    loreEntryId: number | null,
    profileId: number
  ): Promise<void> => {
    // Send the ID in the request body
    await apiClient.put(
      `${CHARACTER_BASE_URL}/${characterName}/greatest-feat/${profileId}`,
      { greatestFeatLoreId: loreEntryId }
    );
  },
};
