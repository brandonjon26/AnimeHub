using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Character;

namespace AnimeHub.Api.Repositories
{
    public interface ICharacterRepository : IBaseRepository<CharacterProfile>
    {
        // Retrieves a specific Character Profile by name and eagerly loads all details.
        Task<CharacterProfile?> GetProfileWithDetailsAsync(string characterName);

        // Method to fetch a single Attire entity for deletion
        Task<CharacterAttire?> GetAttireByIdAsync(int attireId);

        // Batch updates all CharacterProfiles that link to a specific LoreEntryId, setting their GreatestFeatLoreId to the sentinel value (0).
        Task<int> ClearGreatestFeatLinkAsync(int loreEntryIdToClear, int sentinelId);
    }
}
