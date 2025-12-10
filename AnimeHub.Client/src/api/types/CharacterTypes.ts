// --- READ DTOs (Data from GET /ayami-profile) ---

/**
 * Interface for the Ayami Accessory DTO.
 * Used within AyamiAttireDto.
 */
export interface CharacterAccessoryDto {
  characterAccessoryId: number;
  description: string;
  isWeapon: boolean;
  uniqueEffect: string | null;
}

/**
 * Interface for the Ayami Attire DTO.
 * Used within AyamiProfileDto.
 */
export interface CharacterAttireDto {
  characterAttireId: number;
  name: string;
  attireType: string;
  description: string;
  hairstyleDescription: string;
  accessories: CharacterAccessoryDto[]; // The normalized collection
}

/**
 * Interface for a summarized Character Profile.
 * Used for nested relationships (like BestFriend) to prevent circular references.
 */
export interface CharacterProfileSummaryDto {
  characterProfileId: number;
  firstName: string;
  lastName: string;
  vibe: string;
  uniquePower: string;
}

/**
 * Interface for the full Ayami Profile DTO.
 */
export interface CharacterProfileDto {
  // Core Profile Fields
  characterProfileId: number;
  firstName: string;
  lastName: string;
  japaneseFirstName: string;
  japaneseLastName: string;
  age: number;
  origin: string | null;
  greetingAudioUrl: string;
  vibe: string;
  height: string;
  bodyType: string;
  hair: string;
  eyes: string;
  skin: string;
  primaryEquipment: string;
  uniquePower: string;
  greatestFeat: string;
  magicAptitude: string;
  romanticTensionDescription: string;
  bio: string;

  // Nested Relationships
  bestFriend: CharacterProfileSummaryDto | null;
  attires: CharacterAttireDto[];
}

// --- INPUT DTOs (Data for PUT /ayami-profile and POST /ayami-profile/attire) ---

/**
 * Input DTO for creating or updating an accessory.
 * Note: No ID is included as we rely on the description for reuse/lookup on the backend.
 */
export interface CharacterAccessoryInput {
  description: string;
  isWeapon: boolean;
  uniqueEffect?: string | null;
}

/**
 * Input DTO for creating a new Ayami Attire.
 */
export interface CharacterAttireInput {
  name: string;
  attireType: string;
  description: string;
  hairstyleDescription: string;
  accessories: CharacterAccessoryInput[];
}

/**
 * Input DTO for updating the core Ayami Profile fields.
 */
export interface CharacterProfileUpdateInput {
  firstName: string;
  lastName: string;
  japaneseFirstName: string;
  japaneseLastName: string;
  age: number;
  origin: string | null;
  vibe: string;
  height: string;
  bodyType: string;
  hair: string;
  eyes: string;
  skin: string;
  primaryEquipment: string;
  uniquePower: string;
  greatestFeatLoreId: number | 0;
  magicAptitude: string;
  romanticTensionDescription: string;
  bio: string;
}
