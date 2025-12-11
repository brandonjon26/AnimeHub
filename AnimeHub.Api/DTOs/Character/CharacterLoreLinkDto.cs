using AnimeHub.Api.DTOs.Character.Lore;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Character
{
    // Represents the join table data between a Character and a Lore Entry
    public record CharacterLoreLinkDto(
        string? CharacterRole, // e.g., "Protagonist" - Comes from CharacterLoreLink entity
        LoreEntryDto LoreEntry  // The actual Lore Entry details
    );
}
