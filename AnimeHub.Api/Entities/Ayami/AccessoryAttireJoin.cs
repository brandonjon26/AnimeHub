namespace AnimeHub.Api.Entities.Ayami
{
    // This class represents the many-to-many join table
    public class AccessoryAttireJoin
    {
        // Foreign Key 1
        public int AccessoryId { get; set; }

        // Navigation Property 1
        public AyamiAccessory Accessory { get; set; } = null!;

        // Foreign Key 2
        public int AttireId { get; set; }

        // Navigation Property 2
        public AyamiAttire Attire { get; set; } = null!;
    }
}
