using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when adding a new Attire and its associated accessories
    public record CharacterAccessoryInputDto(
        string Description,
        bool IsWeapon,
        string? UniqueEffect
    );
}
