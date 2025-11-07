using AnimeHub.Api.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace AnimeHub.Api.Services
{
    public interface AuthInterface
    {
        // Result is the IdentityResult, containing errors if unsuccessful
        Task<IdentityResult> RegisterAsync(RegisterDto dto);

        // Result is a string (JWT) or null if login fails
        Task<UserResponseDto?> LoginAsync(LoginDto dto);

        // FUTURE: Helper to manage roles
        Task<bool> EnsureRolesExistAsync();
    }
}
