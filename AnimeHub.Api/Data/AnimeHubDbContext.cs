using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AnimeHub.Api.Data
{
    public class AnimeHubDbContext : DbContext
    {
        // Constructor that passes configuration options to the base DbContext class
        public AnimeHubDbContext(DbContextOptions<AnimeHubDbContext> options) : base(options) 
        {
        }

        public DbSet<Anime> Anime {  get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<GalleryImageCategory> GalleryImageCategories { get; set; }
        public DbSet<AyamiProfile> AyamiProfiles { get; set; }
        public DbSet<AyamiAttire> AyamiAttires { get; set; }
        public DbSet<AyamiAccessory> AyamiAccessories { get; set; }
        public DbSet<AccessoryAttireJoin> AccessoryAttireJoins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
