using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Used when adding a new Attire to the Character Profile
    public record CharacterAttireInputDto(
        [Required][MaxLength(50)] string Name,
        [Required][MaxLength(50)] string AttireType,
        [Required][MaxLength(500)] string Description,
        [Required][MaxLength(100)] string HairstyleDescription,

        // List of accessories to create and link to this new attire
        ICollection<CharacterAccessoryInputDto> Accessories
    );
}
