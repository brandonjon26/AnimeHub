using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

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
        public DbSet<AyamiProfile> AyamiProfiles { get; set; }
        public DbSet<AyamiAttire> AyamiAttires { get; set; }
        public DbSet<AyamiAccessory> AyamiAccessories { get; set; }
        public DbSet<AccessoryAttireJoin> AccessoryAttireJoins { get; set; }

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

            // Configure the Ayami Profile relationships
            modelBuilder.Entity<AyamiProfile>()
                .HasMany(p => p.Attires)
                .WithOne(a => a.Profile)
                .HasForeignKey(a => a.ProfileId)
                .IsRequired();

            // Configure the new Many-to-Many relationship (MUST BE KEPT)
            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasKey(aat => new { aat.AttireId, aat.AccessoryId }); // Composite Primary Key

            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasOne(aat => aat.Attire)
                .WithMany(a => a.AccessoryLinks)
                .HasForeignKey(aat => aat.AttireId);

            modelBuilder.Entity<AccessoryAttireJoin>()
                .HasOne(aat => aat.Accessory)
                .WithMany(acc => acc.AttireLinks)
                .HasForeignKey(aat => aat.AccessoryId);
        }
    }
}
