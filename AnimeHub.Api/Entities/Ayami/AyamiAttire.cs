using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.Entities.Ayami
{
    public class AyamiAttire
    {
        public int AyamiAttireId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Hairstyle { get; set; } = string.Empty;

        // Navigation property for the new many-to-many relationship
        public ICollection<AccessoryAttireJoin> AccessoryLinks { get; set; } = new List<AccessoryAttireJoin>();

        // Foreign Key to Profile
        public int ProfileId { get; set; }

        // Navigation Property
        public AyamiProfile Profile { get; set; } = null!;
    }
}
