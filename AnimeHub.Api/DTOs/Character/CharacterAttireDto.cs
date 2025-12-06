using System.Collections.Generic;

namespace AnimeHub.Api.DTOs.Character
{
    public record CharacterAttireDto(
        int CharacterAttireId,
        string Name,
        string AttireType,
        string Description,
        string HairstyleDescription,
        ICollection<CharacterAccessoryDto> Accessories // List of accessories for this attire
    );
}
