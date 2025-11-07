namespace AnimeHub.Api.Entities
{
    public static class Roles
    {
        // Core Administrator Role: Full system access
        public const string Administrator = "Admin";

        // Custom Admin-Level Role: Full system access, personalized name
        public const string Mage = "Mage";

        // Standard User Role: Restricted access
        public const string Villager = "Villager";
    }
}
