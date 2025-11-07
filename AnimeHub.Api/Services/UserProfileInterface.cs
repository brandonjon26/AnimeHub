using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Services
{
    public interface UserProfileInterface
    {
        // Creates the profile record after the IdentityUser is successfully created.
        Task<UserProfile> CreateProfileAsync(string userId, RegisterDto dto);

        // Retrieves the full profile, potentially including the IsAdult flag.
        Task<UserProfile?> GetProfileByUserIdAsync(string userId);

        // Update user profile data.
        Task<UserProfile?> UpdateProfileAsync(string userId, UserProfileUpdateDto dto);

        // Custom profile data deletion for specialized needs
        Task<bool> DeleteProfileAsync(string userId);

        // Method for full Identity account deletion (cascades)
        Task<bool> DeleteUserAccountAsync(string userId);
    }
}
