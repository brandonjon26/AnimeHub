using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.Entities.Ayami
{
    public class AyamiProfile
    {
        // We will make this the PK, even though there will only be one entry (ID = 1)
        public int AyamiProfileId { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; } = "Ayami";

        [Required, MaxLength(50)]
        public string LastName { get; set; } = "Kageyama";
        [Required, MaxLength(50)]
        public string JapaneseFirstName { get; set; } = "妖美";
        [Required, MaxLength(50)]
        public string JapaneseLastName { get; set; } = "影山";

        [Required, MaxLength(255)]
        public string Vibe { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Height { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string BodyType { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Hair { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Eyes { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Skin { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string PrimaryEquipment { get; set; } = string.Empty;

        // Using NVARCHAR(MAX) for the long bio text
        [Required]
        public string Bio { get; set; } = string.Empty;

        // Navigation Property for Attires
        public ICollection<AyamiAttire> Attires { get; set; } = new List<AyamiAttire>();
    }
}
