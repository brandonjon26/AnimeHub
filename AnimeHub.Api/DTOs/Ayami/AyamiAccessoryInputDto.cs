using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Ayami
{
    // Used when adding a new Attire and its associated accessories
    public record AyamiAccessoryInputDto(
        [Required][MaxLength(500)] string Description,
        bool IsWeapon
    );
}
