using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when updating the main fields of the Ayami Profile
    public record CharacterProfileUpdateDto(
        string FirstName,
        string LastName,
        string JapaneseFirstName,
        string JapaneseLastName,
        int Age,
        string? Origin,
        string Vibe,
        string Height,
        string BodyType,
        string Hair,
        string Eyes,
        string Skin,
        string PrimaryEquipment,
        string UniquePower,
        int GreatestFeatLoreId,
        string MagicAptitude,
        string RomanticTensionDescription,
        string Bio
    );
}
