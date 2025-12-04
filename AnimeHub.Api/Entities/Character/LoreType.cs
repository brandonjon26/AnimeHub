using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace AnimeHub.Api.Entities.Character
{
    public class LoreType
    {
        public int LoreTypeId { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty; // e.g., "Quest", "Origin"

        // Navigation property
        public ICollection<LoreEntry> LoreEntries { get; set; } = new List<LoreEntry>();
    }
}
