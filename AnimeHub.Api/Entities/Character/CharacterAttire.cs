using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Character
{
    public class CharacterAttire
    {
        public int CharacterAttireId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string AttireType { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(255)]
        public string HairstyleDescription { get; set; } = string.Empty;

        // Navigation property for the new many-to-many relationship
        public ICollection<AccessoryAttireJoin> AccessoryLinks { get; set; } = new List<AccessoryAttireJoin>();

        // Foreign Key to Profile
        public int CharacterProfileId { get; set; }

        // Navigation Property
        [ForeignKey(nameof(CharacterProfileId))]
        public CharacterProfile Profile { get; set; } = null!;
    }
}
