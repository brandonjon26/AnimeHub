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

        // FUTURE: Update user profile data.
        // Task<UserProfile> UpdateProfileAsync(string userId, UpdateProfileDto dto);
    }
}
