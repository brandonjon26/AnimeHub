using System.Collections.Generic;

namespace AnimeHub.Api.DTOs.Character
{
    public record CharacterProfileDto(
        int CharacterProfileId,
        string FirstName,
        string LastName,
        string JapaneseFirstName,
        string JapaneseLastName,
        int Age,
        string? Origin,        
        string GreetingAudioUrl,
        string Vibe,
        string Height,
        string BodyType,
        string Hair,
        string Eyes,
        string Skin,
        string PrimaryEquipment,
        string UniquePower,
        string GreatestFeat, // Still a string here for display via DTO logic later
        string MagicAptitude,
        string RomanticTensionDescription,
        string Bio, // The full narrative biography

        // Nested Best Friend Profile (Optional, for simplified client consumption)
        CharacterProfileSummaryDto? BestFriend,

        // List of all different outfits/attires
        ICollection<CharacterAttireDto> Attires,

        // Collection of all linked lore entries
        ICollection<CharacterLoreLinkDto> LoreLinks
    );

    // A summary DTO for the nested Best Friend field to avoid circular references and over-fetching
    // This DTO will live alongside the CharacterProfileDto.cs file
    public record CharacterProfileSummaryDto(
        int CharacterProfileId,
        string FirstName,
        string LastName,
        string Vibe,
        string UniquePower
    );
}
