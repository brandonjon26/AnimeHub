using System.Collections.Generic;

namespace AnimeHub.Api.DTOs.Ayami
{
    public record AyamiAttireDto(
        int AyamiAttireId,
        string Name,
        string Description,
        string Hairstyle,
        ICollection<AyamiAccessoryDto> Accessories // List of accessories for this attire
    );
}
