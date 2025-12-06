using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using AnimeHub.Api.Entities.Enums;

namespace AnimeHub.Api.DTOs.Character.Lore
{
    public record LoreEntryInputDto(
        [Required][MaxLength(100)] string Title,
        [Required] int LoreTypeId,
        [Required] string Narrative,

        // A list of Character IDs involved in this Lore Entry
        ICollection<int> CharacterIds
    );
}
