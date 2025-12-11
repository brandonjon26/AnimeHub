// --- READ DTOs (Data from GET /characters/{characterName}) ---

/**
 * Interface for the Character Accessory DTO.
 * Used within CharacterAttireDto.
 */
export interface CharacterAccessoryDto {
  characterAccessoryId: number;
  description: string;
  isWeapon: boolean;
  uniqueEffect: string | null;
}

/**
 * Interface for the Character Attire DTO.
 * Used within CharacterProfileDto.
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
 * Interface for the Character Lore Link DTO.
 * Represents a specific character's involvement (role) in a Lore Entry.
 */
export interface CharacterLoreLinkDto {
  characterRole: string | null;
  loreEntry: LoreEntryDto;
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
 * Interface for a lightweight Lore Entry Summary DTO.
 * Used for nested fields (like GreatestFeat) and for populating dropdown lists.
 */
export interface LoreEntrySummaryDto {
  // 🔑 NEW DTO DEFINITION
  loreEntryId: number;
  title: string;
}

/**
 * Interface for the full Character Profile DTO.
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
  greatestFeat: LoreEntrySummaryDto | null; // Nested relationship
  magicAptitude: string;
  romanticTensionDescription: string;
  bio: string;

  // Nested Relationships
  bestFriend: CharacterProfileSummaryDto | null;
  attires: CharacterAttireDto[];
  loreLinks: CharacterLoreLinkDto[];
}

/**
 * Interface for the Lore Type DTO.
 * Used for lookup tables (e.g., Quest, Origin, Event).
 */
export interface LoreTypeDto {
  loreTypeId: number;
  name: string;
}

/**
 * Interface for a full Lore Entry DTO.
 * Includes the title, narrative, type, and involved characters.
 */
export interface LoreEntryDto {
  loreEntryId: number;
  title: string;
  loreType: string;
  narrative: string;
  charactersInvolved: CharacterProfileSummaryDto[]; // Uses the summary DTO defined earlier
}

// --- INPUT DTOs (Data for PUT /characters/{name}/profile and POST /characters/{name}/attire) ---

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
 * Input DTO for creating a new Character Attire.
 */
export interface CharacterAttireInput {
  name: string;
  attireType: string;
  description: string;
  hairstyleDescription: string;
  accessories: CharacterAccessoryInput[];
}

/**
 * Input DTO for updating the core Character Profile fields.
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

/**
 * Input DTO for creating a new Lore Entry.
 */
export interface LoreEntryInputDto {
  title: string;
  loreTypeId: number;
  narrative: string;
  characterIds: number[]; // Array of character IDs linked to this entry
}
