// --- READ DTOs (Data from GET /ayami-profile) ---

/**
 * Interface for the Ayami Accessory DTO.
 * Used within AyamiAttireDto.
 */
export interface AyamiAccessoryDto {
  ayamiAccessoryId: number;
  description: string;
  isWeapon: boolean;
}

/**
 * Interface for the Ayami Attire DTO.
 * Used within AyamiProfileDto.
 */
export interface AyamiAttireDto {
  ayamiAttireId: number;
  name: string;
  description: string;
  hairstyle: string;
  accessories: AyamiAccessoryDto[]; // The normalized collection
}

/**
 * Interface for the full Ayami Profile DTO.
 */
export interface AyamiProfileDto {
  // Core Profile Fields
  ayamiProfileId: number;
  firstName: string;
  lastName: string;
  japaneseFirstName: string;
  japaneseLastName: string;
  greetingAudioUrl: string;
  vibe: string;
  height: string;
  bodyType: string;
  hair: string;
  eyes: string;
  skin: string;
  primaryEquipment: string;
  bio: string;

  // Nested Attires
  attires: AyamiAttireDto[];
}

// --- INPUT DTOs (Data for PUT /ayami-profile and POST /ayami-profile/attire) ---

/**
 * Input DTO for creating or updating an accessory.
 * Note: No ID is included as we rely on the description for reuse/lookup on the backend.
 */
export interface AyamiAccessoryInput {
  description: string;
  isWeapon: boolean;
}

/**
 * Input DTO for creating a new Ayami Attire.
 */
export interface AyamiAttireInput {
  name: string;
  description: string;
  hairstyle: string;
  accessories: AyamiAccessoryInput[];
}

/**
 * Input DTO for updating the core Ayami Profile fields.
 */
export interface AyamiProfileUpdateInput {
  firstName: string;
  lastName: string;
  japaneseFirstName: string;
  japaneseLastName: string;
  vibe: string;
  height: string;
  bodyType: string;
  hair: string;
  eyes: string;
  skin: string;
  primaryEquipment: string;
  bio: string;
}
