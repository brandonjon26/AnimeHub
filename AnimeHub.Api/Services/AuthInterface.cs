using AnimeHub.Api.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace AnimeHub.Api.Services
{
    public interface AuthInterface
    {
        // Register will auto login; Result is a string (JWT) or null if login fails
        Task<UserResponseDto?> RegisterAsync(RegisterDto dto);

        // Result is a string (JWT) or null if login fails
        Task<UserResponseDto?> LoginAsync(LoginDto dto);

        // Helper to manage roles
        Task<bool> EnsureRolesExistAsync();
    }
}
