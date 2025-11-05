using AnimeHub.Api.DTOs.Ayami;

namespace AnimeHub.Api.Services
{
    public interface AyamiInterface
    {
        // Retrieves the profile and maps it to the DTO for the frontend.
        Task<AyamiProfileDto?> GetAyamiProfileAsync();
    }
}
