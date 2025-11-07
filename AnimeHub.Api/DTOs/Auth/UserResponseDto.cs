namespace AnimeHub.Api.DTOs.Auth
{
    public record UserResponseDto
    {
        // Data from IdentityUser
        public string UserId { get; init; } = string.Empty;
        public string UserName { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;

        // Data from UserProfile
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;

        // CRUCIAL: Content and UI flags
        public bool IsAdmin { get; init; } // Combines Admin and Mage roles
        public bool IsAdult { get; init; } // For 18+ content filtering

        // The JWT token itself
        public string Token { get; init; } = string.Empty;
    }
}
