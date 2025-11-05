using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Ayami
{
    // Used when updating the main fields of the Ayami Profile
    public record AyamiProfileUpdateDto(
        [Required][MaxLength(50)] string FirstName,
        [Required][MaxLength(50)] string LastName,
        [Required][MaxLength(50)] string JapaneseFirstName,
        [Required][MaxLength(50)] string JapaneseLastName,
        [Required][MaxLength(200)] string Vibe,
        [Required][MaxLength(10)] string Height,
        [Required][MaxLength(50)] string BodyType,
        [Required][MaxLength(100)] string Hair,
        [Required][MaxLength(100)] string Eyes,
        [Required][MaxLength(100)] string Skin,
        [Required][MaxLength(500)] string PrimaryEquipment,
        [Required][MaxLength(2000)] string Bio
    );
}
