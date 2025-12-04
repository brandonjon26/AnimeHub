using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Character
{
    public class LoreEntry
    {
        public int LoreEntryId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public int LoreTypeId { get; set; } = 0;

        [ForeignKey(nameof(LoreTypeId))]
        public LoreType LoreType { get; set; } = null!; // Navigation property

        [Required]
        public string Narrative { get; set; } = string.Empty; // The full story text

        public ICollection<CharacterLoreLink> CharacterLinks { get; set; } = new List<CharacterLoreLink>();
    }
}
