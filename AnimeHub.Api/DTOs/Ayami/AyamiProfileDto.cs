using System.Collections.Generic;

namespace AnimeHub.Api.DTOs.Ayami
{
    public record AyamiProfileDto(
        int AyamiProfileId,
        string FirstName,
        string LastName,
        string JapaneseFirstName,
        string JapaneseLastName,
        string GreetingAudioUrl,
        string Vibe,
        string Height,
        string BodyType,
        string Hair,
        string Eyes,
        string Skin,
        string PrimaryEquipment,
        string Bio, // The full narrative biography
        ICollection<AyamiAttireDto> Attires // List of all different outfits/attires
    );
}
