using AnimeHub.Api.Entities.Ayami;

namespace AnimeHub.Api.Repositories
{
    public interface IAyamiRepository : IBaseRepository<AyamiProfile>
    {
        // Retrieves the single Ayami Profile entry (ID is likely always 1).
        Task<AyamiProfile?> GetProfileWithDetailsAsync();

        // Method to fetch a single Attire entity for deletion
        Task<AyamiAttire?> GetAttireByIdAsync(int attireId);
    }
}
