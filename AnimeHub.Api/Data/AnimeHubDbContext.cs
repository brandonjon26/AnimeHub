using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Character;
using AnimeHub.Api.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using AnimeHub.Api.Entities.Character.Lore;

namespace AnimeHub.Api.Data
{
    public class AnimeHubDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        // Constructor that passes configuration options to the base DbContext class
        public AnimeHubDbContext(DbContextOptions<AnimeHubDbContext> options) : base(options) 
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Anime> Anime {  get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<GalleryImageCategory> GalleryImageCategories { get; set; }
        public DbSet<CharacterProfile> CharacterProfiles { get; set; }
        public DbSet<CharacterAttire> CharacterAttires { get; set; }
        public DbSet<CharacterAccessory> CharacterAccessories { get; set; }
        public DbSet<AccessoryAttireJoin> AccessoryAttireJoins { get; set; }
        public DbSet<LoreType> LoreTypes { get; set; }
        public DbSet<LoreEntry> LoreEntries { get; set; }
        public DbSet<CharacterLoreLink> CharacterLoreLinks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // CRITICAL: Must call the base implementation for Identity tables
            base.OnModelCreating(modelBuilder);

            // Configure the one-to-one relationship between IdentityUser and UserProfile
            modelBuilder.Entity<UserProfile>(userProfile =>
            {
                // Define the Primary Key (First block, separate is required)
                userProfile.HasKey(up => up.UserId);

                // Define the One-to-One relationship (Second block)
                // CRITICAL: Use the generic HasOne(up => up.User!)
                userProfile.HasOne(up => up.User!)
                           .WithOne()
                           .HasForeignKey<UserProfile>(up => up.UserId) // Explicitly use the PK as the FK
                           .IsRequired()
                           .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure the GalleryImage entity
            modelBuilder.Entity<GalleryImage>(entity =>
            {
                // Configure the relationship, ensuring EF Core uses the backing type (int)
                entity.HasOne(gi => gi.Category)
                      .WithMany(gic => gic.GalleryImages)
                      // The HasForeignKey argument must use the C# enum property
                      .HasForeignKey(gi => gi.GalleryImageCategoryId)
                      // This is the crucial part that links the type correctly:
                      .HasPrincipalKey(gic => gic.GalleryImageCategoryId)
                      .IsRequired();
            });

            // Configure the Character Profile relationships (One-to-Many Attires)
            modelBuilder.Entity<CharacterProfile>(characterProfile =>
            {
                characterProfile.HasMany(p => p.Attires)
                .WithOne(a => a.Profile)
                .HasForeignKey(a => a.CharacterProfileId)
                .IsRequired();

                // Self-referencing Best Friend link (One-to-Optional-One/Many)
                characterProfile.HasOne(p => p.BestFriend)
                    .WithOne() // Or .WithMany() if a character can have many best friends who also consider them a best friend
                    .HasForeignKey<CharacterProfile>(p => p.BestFriendCharacterId)
                    .IsRequired(false) // Allows BestFriendCharacterId to be null
                    .OnDelete(DeleteBehavior.Restrict); // Important to prevent circular delete issues
            });

            // Configure the Greatest Feat link (One-to-Many, starting from CharacterProfile)
            modelBuilder.Entity<CharacterProfile>()
                .HasOne(p => p.GreatestFeatLore) // CharacterProfile has ONE GreatestFeatLore
                .WithMany() // LoreEntry has MANY CharacterProfiles (using the FK on CharacterProfile)
                .HasForeignKey(p => p.GreatestFeatLoreId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the new Many-to-Many relationship (MUST BE KEPT)
            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasKey(aat => new { aat.CharacterAttireId, aat.CharacterAccessoryId }); // Composite Primary Key

            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasOne(aat => aat.Attire)
                .WithMany(a => a.AccessoryLinks)
                .HasForeignKey(aat => aat.CharacterAttireId);

            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasOne(aat => aat.Accessory)
                .WithMany(acc => acc.AttireLinks)
                .HasForeignKey(aat => aat.CharacterAccessoryId);

            // Configure the Many-to-Many relationship for Characters and Lore
            modelBuilder.Entity<CharacterLoreLink>()
                // Define the Composite Primary Key
                .HasKey(cll => new { cll.CharacterProfileId, cll.LoreEntryId });

            modelBuilder.Entity<CharacterLoreLink>()
                .HasOne(cll => cll.CharacterProfile)
                .WithMany(p => p.LoreLinks)
                .HasForeignKey(cll => cll.CharacterProfileId);

            modelBuilder.Entity<CharacterLoreLink>()
                .HasOne(cll => cll.LoreEntry)
                .WithMany(l => l.CharacterLinks)
                .HasForeignKey(cll => cll.LoreEntryId);
        }
    }
}
