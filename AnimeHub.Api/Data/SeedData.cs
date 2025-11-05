using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Entities.Enums;
using System.Collections.Generic;
using System.Linq;

namespace AnimeHub.Api.Data
{
    public static class SeedData
    {
        // --- Gallery Category Data ---
        private static readonly GalleryImageCategory[] GalleryCategories =
        {
            new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.StandardAnimeIsekai, Name = "Standard Anime/Isekai" },
            new GalleryImageCategory { GalleryImageCategoryId = (int)GalleryImageCategoryEnum.ChibiStyle, Name = "Chibi Style" }
        };

        // --- Ayami Profile Data ---
        private static AyamiProfile GetAyamiProfileData()
        {
            var profile = new AyamiProfile
            {
                FirstName = "Ayami",
                LastName = "Kageyama",
                JapaneseFirstName = "妖美",
                JapaneseLastName = "影山",
                Vibe = "Mysterious, Playful, Confident, Enchanting, Alluring, and an Anti-Hero",
                Height = "5'2\"",
                BodyType = "Curvier, yet balanced",
                Hair = "Long, wavy black hair",
                Eyes = "Enchanting purple eyes",
                Skin = "Fair skin",
                PrimaryEquipment = "Decorative staff/spear with a glowing purple crystal.",
                Bio = "Ayami Kageyama (妖美 影山) is the enigmatic spirit of discovery and charm at the heart of AnimeHub. Hailing from a dark, ruined world somewhere on the outskirts of the Isekai multiverse, she carries herself with an effortless confidence that belies her petite stature. Her playful nature is only matched by her profound sense of mystery. Dressed in her signature midnight-black mini-dress, witch's hat, and gloves—all highlighted by subtle purple accents matching her mesmerizing eyes—she embodies both elegance and edge. Ayami wields a distinctive staff, not just as a weapon, but as a key to unlock the most compelling worlds and narratives in the AnimeHub universe. She is here to be your confident, charming, and alluring guide through all the deepest lore and most captivating stories the fandom has to offer."
            };

            // Define Attires and Accessories
            var witchAttire = new AyamiAttire
            {
                Name = "Primary Attire (Witch)",
                Description = "Sleek, strapless, sleeveless very short black mini-dress with subtle purple trim, featuring a form-fitting bodice that transitions into a loose, flowing skirt, long black gloves, and knee-high black boots.",
                Hairstyle = profile.Hair, // Uses default profile hair
                Accessories = new List<AyamiAccessory>
                {
                    new AyamiAccessory { Description = "Stylish black witch's hat with subtle purple trim", IsWeapon = false },
                    new AyamiAccessory { Description = "Decorative purple thigh ring", IsWeapon = false }
                }
            };

            var armoredAttire = new AyamiAttire
            {
                Name = "Secondary Attire (Armored)",
                Description = "Black, tight-fitting, sleeveless, strapless one-piece (open back) with armor details/purple accents; shorter purple skirt; knee-high black armor-type boots.",
                Hairstyle = profile.Hair,
                Accessories = new List<AyamiAccessory>
                {
                    new AyamiAccessory { Description = "Black gloved gauntlets", IsWeapon = false },
                    new AyamiAccessory { Description = "Flowing purple Waist Cape/Fantasy Tasset", IsWeapon = false },
                    new AyamiAccessory { Description = "Smaller glowing amethyst necklace and black choker", IsWeapon = false },
                    new AyamiAccessory { Description = "Small dark purple hair clip with a subtle gem", IsWeapon = false },
                    new AyamiAccessory { Description = "Purple thigh ring with a purple gem (No Hat)", IsWeapon = false },
                    new AyamiAccessory { Description = "Dagger attached to the waist", IsWeapon = true }
                }
            };

            var alluringAttire = new AyamiAttire
            {
                Name = "Alluring Attire",
                Description = "Purple, tight-fitting, high-neck, sleeveless one-piece (open stomach/back); thigh-high black boots; signature black gloves.",
                Hairstyle = "Long, wavy black hair pulled back in a half-up/half-down style with a purple bow.",
                Accessories = new List<AyamiAccessory>
                {
                    new AyamiAccessory { Description = "Purple bow (tied to the half-up/half-down style)", IsWeapon = false },
                    new AyamiAccessory { Description = "Smaller glowing amethyst necklace and black choker", IsWeapon = false },
                    new AyamiAccessory { Description = "Purple thigh ring with a purple gem (No Hat)", IsWeapon = false },
                    new AyamiAccessory { Description = "Dagger attached to the waist", IsWeapon = true }
                }
            };

            profile.Attires.Add(witchAttire);
            profile.Attires.Add(armoredAttire);
            profile.Attires.Add(alluringAttire);

            return profile;
        }

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

            // 2. Seed Ayami Profile
            if (!context.AyamiProfiles.Any())
            {
                var profile = GetAyamiProfileData();
                context.AyamiProfiles.Add(profile);
                context.SaveChanges();
            }

            // 3. (Anime seeding will go here later in Phase 5B)
        }
    }
}