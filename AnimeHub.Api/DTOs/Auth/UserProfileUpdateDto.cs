using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Auth
{
    // Record for immutability and cleaner syntax
    public record UserProfileUpdateDto
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; init; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; init; } = string.Empty;

        // Note: Birthday is typically not allowed to be updated after initial registration, 
        // but we'll include it here for maximum flexibility if needed.
        [Required]
        public DateOnly Birthday { get; init; }

        [StringLength(50)]
        public string Location { get; init; } = string.Empty;
    }
}
