using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when updating the main fields of the Ayami Profile
    public record CharacterProfileUpdateDto(
        [Required][MaxLength(50)] string FirstName,
        [Required][MaxLength(50)] string LastName,
        [Required][MaxLength(50)] string JapaneseFirstName,
        [Required][MaxLength(50)] string JapaneseLastName,
        [Required] int Age,
        [MaxLength(50)] string? Origin,
        [Required][MaxLength(200)] string Vibe,
        [Required][MaxLength(10)] string Height,
        [Required][MaxLength(50)] string BodyType,
        [Required][MaxLength(100)] string Hair,
        [Required][MaxLength(100)] string Eyes,
        [Required][MaxLength(100)] string Skin,
        [Required][MaxLength(500)] string PrimaryEquipment,
        [Required][MaxLength(255)] string UniquePower,
        [Required] int? GreatestFeatLoreId,
        [Required][MaxLength(100)] string MagicAptitude,
        [Required][MaxLength(500)] string RomanticTensionDescription,
        [Required][MaxLength(2000)] string Bio
    );
}
