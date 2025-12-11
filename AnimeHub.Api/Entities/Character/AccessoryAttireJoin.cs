using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Character
{
    // This class represents the many-to-many join table
    public class AccessoryAttireJoin
    {
        // Foreign Key 1
        public int CharacterAccessoryId { get; set; }

        // Navigation Property 1
        [ForeignKey(nameof(CharacterAccessoryId))]
        public CharacterAccessory Accessory { get; set; } = null!;

        // Foreign Key 2
        public int CharacterAttireId { get; set; }

        // Navigation Property 2
        [ForeignKey(nameof(CharacterAttireId))]
        public CharacterAttire Attire { get; set; } = null!;
    }
}
