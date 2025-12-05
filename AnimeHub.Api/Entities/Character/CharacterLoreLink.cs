using AnimeHub.Api.Entities.Character.Lore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Character
{
    public class CharacterLoreLink
    {
        // Composite Primary Key defined in DbContext

        public int CharacterProfileId { get; set; }
        public CharacterProfile CharacterProfile { get; set; } = null!;

        public int LoreEntryId { get; set; }
        public LoreEntry LoreEntry { get; set; } = null!;

        // 🔑 NEW: We can optionally add a field to describe the character's role in the quest.
        [MaxLength(255)]
        public string? CharacterRole { get; set; } // e.g., "Protagonist", "Supporting Character"
    }
}
