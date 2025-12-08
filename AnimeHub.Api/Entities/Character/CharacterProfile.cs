using AnimeHub.Api.Entities.Character.Lore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Character
{
    public class CharacterProfile
    {
        public int CharacterProfileId { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; } = "Ayami";

        [Required, MaxLength(50)]
        public string LastName { get; set; } = "Kageyama";

        [Required, MaxLength(50)]
        public string JapaneseFirstName { get; set; } = "妖美";

        [Required, MaxLength(50)]
        public string JapaneseLastName { get; set; } = "影山";

        [Required]
        public int Age { get; set; } = 18;

        [Required, MaxLength(50)]
        public string? Origin { get; set; } = "";

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

        [Required, MaxLength(255)]
        public string UniquePower { get; set; } = string.Empty;

        public int GreatestFeatLoreId { get; set; } = 0;

        // Navigation property to the defining quest
        [ForeignKey(nameof(GreatestFeatLoreId))]
        public LoreEntry? GreatestFeatLore { get; set; } // We will define LoreEntry next

        [Required, MaxLength(100)]
        public string MagicAptitude { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string PrimaryEquipment { get; set; } = string.Empty;

        // Using NVARCHAR(MAX) for the long bio text
        [Required]
        public string Bio { get; set; } = string.Empty;

        public int? BestFriendCharacterId { get; set; }

        [ForeignKey(nameof(BestFriendCharacterId))]
        public CharacterProfile? BestFriend { get; set; }

        [Required, MaxLength(500)]
        public string RomanticTensionDescription { get; set; } = string.Empty;

        // Navigation Property for Attires
        public ICollection<CharacterAttire> Attires { get; set; } = new List<CharacterAttire>();

        // Navigation property for shared lore/quests
        public ICollection<CharacterLoreLink> LoreLinks { get; set; } = new List<CharacterLoreLink>();
    }
}
