using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when adding a new Attire and its associated accessories
    public record CharacterAccessoryInputDto(
        [Required][MaxLength(500)] string Description,
        bool IsWeapon,
        [MaxLength(500)] string? UniqueEffect
    );
}
