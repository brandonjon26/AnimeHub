using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Ayami
{
    public class AyamiAccessory
    {
        public int AyamiAccessoryId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        public bool IsWeapon { get; set; } = false;

        // Foreign Key
        public int AttireId { get; set; }

        // Navigation Property
        [ForeignKey("AttireId")]
        public AyamiAttire Attire { get; set; } = null!;
    }
}
