using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Enums;
using System.Collections.Generic;
using System.Linq;

namespace AnimeHub.Api.Data
{
    public static class SeedData
    {
        // Data definitions for the Gallery Categories lookup table
        private static readonly GalleryImageCategory[] GalleryCategories =
        {
            new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.StandardAnimeIsekai, Name = "Standard Anime/Isekai" },
            new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.ChibiStyle, Name = "Chibi Style" }
        };

        public static void SeedDatabase(AnimeHubDbContext context)
        {
            // Ensure the context exists and connections are possible
            context.Database.EnsureCreated();

            // 1. Seed Gallery Categories (Lookup Table)
            if (!context.GalleryImageCategories.Any())
            {
                context.GalleryImageCategories.AddRange(GalleryCategories);
                context.SaveChanges();
            }

            // 2. (Anime seeding will go here later in Phase 5B)
        }
    }
}