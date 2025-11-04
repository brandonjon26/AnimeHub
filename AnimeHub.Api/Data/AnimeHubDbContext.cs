using AnimeHub.Api.Entities;
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

            // Data Seed for the lookup table
            modelBuilder.Entity<GalleryImageCategory>().HasData(
                new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.StandardAnimeIsekai, Name = "Standard Anime/Isekai" },
                new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.ChibiStyle, Name = "Chibi Style" }
            );

            // Configure the relationship between GalleryImage and GalleryImageCategory
            modelBuilder.Entity<GalleryImage>()
                .HasOne(gi => gi.Category) // GalleryImage has one Category
                .WithMany(gic => gic.GalleryImages) // Category has many GalleryImages
                .HasForeignKey(gi => gi.GalleryImageCategoryId) // Uses the GalleryImageCategoryId foreign key
                .IsRequired();
        }
    }
}
