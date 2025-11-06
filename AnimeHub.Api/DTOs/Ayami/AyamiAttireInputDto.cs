using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Ayami
{
    // Used when adding a new Attire to the Ayami Profile
    public record AyamiAttireInputDto(
        [Required][MaxLength(50)] string Name,
        [Required][MaxLength(500)] string Description,
        [Required][MaxLength(100)] string Hairstyle,

        // List of accessories to create and link to this new attire
        ICollection<AyamiAccessoryInputDto> Accessories
    );
}
