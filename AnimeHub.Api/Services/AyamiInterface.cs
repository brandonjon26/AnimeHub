using AnimeHub.Api.DTOs.Ayami;

namespace AnimeHub.Api.Services
{
    public interface AyamiInterface
    {
        // Retrieves the profile and maps it to the DTO for the frontend.
        Task<AyamiProfileDto?> GetAyamiProfileAsync();

        // UPDATE 
        Task<bool> UpdateProfileAsync(int profileId, AyamiProfileUpdateDto updateDto);

        // CREATE
        // Returns the ID of the new attire, or null on failure.
        Task<int?> AddAttireAsync(int profileId, AyamiAttireInputDto attireDto);

        // DELETE
        Task<bool> DeleteAttireAsync(int attireId);
    }
}
