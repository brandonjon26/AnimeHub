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

        [Required]
        public DateOnly Birthday { get; init; }

        [StringLength(50)]
        public string Location { get; init; } = string.Empty;
    }
}
