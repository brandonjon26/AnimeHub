using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when adding a new Attire to the Character Profile
    public record CharacterAttireInputDto(
        string Name,
        string AttireType,
        string Description,
        string HairstyleDescription,

        // List of accessories to create and link to this new attire
        ICollection<CharacterAccessoryInputDto> Accessories
    );
}
