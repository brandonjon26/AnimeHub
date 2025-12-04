using AnimeHub.Api.Entities.Ayami;

namespace AnimeHub.Api.Repositories
{
    public interface IAyamiRepository : IBaseRepository<CharacterProfile>
    {
        // Retrieves the single Ayami Profile entry (ID is likely always 1).
        Task<CharacterProfile?> GetProfileWithDetailsAsync();

        // Method to fetch a single Attire entity for deletion
        Task<CharacterAttire?> GetAttireByIdAsync(int attireId);
    }
}
