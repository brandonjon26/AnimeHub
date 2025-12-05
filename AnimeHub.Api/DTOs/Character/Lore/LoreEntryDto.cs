using System.Collections.Generic;

namespace AnimeHub.Api.DTOs.Character.Lore
{
    public record LoreEntryDto(
        int LoreEntryId,
        string Title,
        string LoreType, // Name (e.g., "Quest") instead of the ID
        string Narrative,
        // Optionally, include a list of characters involved (optional, but good for completeness)
        ICollection<CharacterProfileSummaryDto> CharactersInvolved
    );
}
