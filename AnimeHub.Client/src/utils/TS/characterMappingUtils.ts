import {
  type CharacterProfileDto,
  type CharacterProfileUpdateInput,
} from "../../api/types/CharacterTypes";

/**
 * Maps a full Character Profile DTO to the specific input structure required for updates.
 */
export const mapProfileToUpdateInput = (
  profile: CharacterProfileDto
): CharacterProfileUpdateInput => {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    japaneseFirstName: profile.japaneseFirstName,
    japaneseLastName: profile.japaneseLastName,
    age: profile.age,
    origin: profile.origin || "",
    vibe: profile.vibe,
    height: profile.height,
    bodyType: profile.bodyType,
    hair: profile.hair,
    eyes: profile.eyes,
    skin: profile.skin,
    primaryEquipment: profile.primaryEquipment,
    uniquePower: profile.uniquePower,
    greatestFeatLoreId: profile.greatestFeat
      ? profile.greatestFeat.loreEntryId
      : 0,
    magicAptitude: profile.magicAptitude,
    romanticTensionDescription: profile.romanticTensionDescription,
    bio: profile.bio,
  };
};
