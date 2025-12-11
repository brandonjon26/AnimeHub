using AnimeHub.Api.DTOs.Character;
using AnimeHub.Api.DTOs.Character.Lore;

namespace AnimeHub.Api.Services
{
    public interface CharacterInterface
    {
        // --- READ ---

        // Retrieves a specific character profile by name.
        Task<CharacterProfileDto?> GetCharacterProfileAsync(string characterName);

        // Retrieves a list of all Lore Types for the frontend dropdown.
        Task<ICollection<LoreTypeDto>> GetAllLoreTypesAsync();

        // Retrieves a specific Lore Entry by ID.
        Task<LoreEntryDto?> GetLoreEntryByIdAsync(int loreEntryId);

        Task<ICollection<LoreEntrySummaryDto>> GetAllLoreEntriesAsync();


        // --- UPDATE ---

        // Updates a specific character profile by ID.
        Task<bool> UpdateProfileAsync(int profileId, CharacterProfileUpdateDto updateDto);

        // Updates the Greatest Feat link for a character.
        Task<bool> UpdateCharacterGreatestFeatAsync(int profileId, int loreEntryId);


        // --- CREATE ---

        // Returns the ID of the new attire, or null on failure.
        Task<int?> AddAttireAsync(int profileId, CharacterAttireInputDto attireDto);

        // Creates a new Lore Entry and links it to characters.
        Task<int?> CreateLoreEntryAsync(LoreEntryInputDto loreEntryDto);


        // --- DELETE ---
        Task<bool> DeleteAttireAsync(int attireId);

        // Deletes a Lore Entry and updates all dependent Character Profiles to use the Sentinel ID (0).
        Task<bool> DeleteLoreEntryAsync(int loreEntryId);
    }
}
