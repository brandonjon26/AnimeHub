using AnimeHub.Api.Data;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AnimeHub.Api.Data
{
    public static class SeedData
    {
        // --- Gallery Category Data ---
        private static readonly GalleryImageCategory[] GalleryCategories =
        {
            new GalleryImageCategory { Name = "Standard Anime/Isekai" },
            new GalleryImageCategory { Name = "Chibi Style" }
        };

        #region Ayami Profile Data Components

        // Define all unique, reusable accessories ONCE.
        private static readonly AyamiAccessory[] AllUniqueAccessories = new AyamiAccessory[]
        {
            new AyamiAccessory { AyamiAccessoryId = 1, Description = "Stylish black witch's hat with subtle purple trim", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 2, Description = "Decorative purple thigh ring", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 3, Description = "Long black gloves", IsWeapon = false }, // Added for completeness
            new AyamiAccessory { AyamiAccessoryId = 4, Description = "Knee-high black boots", IsWeapon = false }, // Added for completeness
            new AyamiAccessory { AyamiAccessoryId = 5, Description = "Black gloved gauntlets", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 6, Description = "Flowing purple Waist Cape/Fantasy Tasset", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 7, Description = "Smaller glowing amethyst necklace and black choker", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 8, Description = "Small dark purple hair clip with a subtle gem", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 9, Description = "Black thigh ring with a purple gem", IsWeapon = false },
            new AyamiAccessory { AyamiAccessoryId = 10, Description = "Dagger attached to the waist", IsWeapon = true }, // Shared Accessory!
            new AyamiAccessory { AyamiAccessoryId = 11, Description = "Purple bow (tied to the half-up/half-down style)", IsWeapon = false }
        };

        // Define the Attires separately, linking them to the Profile.
        private static AyamiProfile GetAyamiProfileData(ICollection<AyamiAccessory> accessories)
        {
            var profile = new AyamiProfile
            {
                // No explicit ID assignment here (SQL will assign 1)
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
                Bio = "Ayami Kageyama ($\text{妖美 影山}$) is the enigmatic spirit of discovery and charm at the heart of AnimeHub. Hailing from a dark, ruined world somewhere on the outskirts of the Isekai multiverse, she carries herself with an effortless confidence that belies her petite stature.Her playful nature is only matched by her profound sense of mystery. Dressed in her signature midnight-black mini-dress, witch's hat, and gloves—all highlighted by subtle purple accents matching her mesmerizing eyes—she embodies both elegance and edge.Ayami wields a distinctive staff, not just as a weapon, but as a key to unlock the most compelling worlds and narratives in the AnimeHub universe. She is here to be your confident, charming, and alluring guide through all the deepest lore and most captivating stories the fandom has to offer."
            };

            // 1. Primary Attire (Witch)
            var witchAttire = new AyamiAttire
            {
                Name = "Primary Attire (Witch)",
                Description = "Sleek, strapless, sleeveless very short black mini-dress with subtle purple trim, featuring a form-fitting bodice that transitions into a loose, flowing skirt, long black gloves, and knee-high black boots.",
                Hairstyle = profile.Hair
            };
            // Link Accessories to Attire 1 (Witch)
            AddLinks(witchAttire, accessories, 1, 2, 3, 4); // Example: Hat, Thigh Ring, Gloves, Boots

            // 2. Secondary Attire (Armored)
            var armoredAttire = new AyamiAttire
            {
                Name = "Secondary Attire (Armored)",
                Description = "Black, tight-fitting, sleeveless, strapless one-piece (open back) with armor details/purple accents; shorter purple skirt; knee-high black armor-type boots.",
                Hairstyle = profile.Hair
            };
            // Link Accessories to Attire 2 (Armored)
            AddLinks(armoredAttire, accessories, 5, 6, 7, 8, 9, 10); // Gauntlets, Cape, Necklace, Hair Clip, Thigh Ring, Dagger (Shared!)

            // 3. Alluring Attire (New)
            var alluringAttire = new AyamiAttire
            {
                Name = "Alluring Attire (New)",
                Description = "Purple, tight-fitting, high-neck, sleeveless one-piece (open stomach/back); thigh-high black boots; signature black gloves.",
                Hairstyle = "Long, wavy black hair pulled back in a half-up/half-down style with a purple bow."
            };
            // Link Accessories to Attire 3 (Alluring)
            AddLinks(alluringAttire, accessories, 3, 7, 9, 10, 11); // Gloves, Necklace, Thigh Ring, Dagger (Shared!), Purple Bow

            profile.Attires.Add(witchAttire);
            profile.Attires.Add(armoredAttire);
            profile.Attires.Add(alluringAttire);

            return profile;
        }

        // Helper function to create the join entity links
        private static void AddLinks(AyamiAttire attire, ICollection<AyamiAccessory> accessories, params int[] accessoryIds)
        {
            foreach (var id in accessoryIds)
            {
                var accessory = accessories.First(a => a.AyamiAccessoryId == id);
                attire.AccessoryLinks.Add(new AccessoryAttireJoin { Accessory = accessory });
            }
        }

        #endregion        

        public static async Task SeedDatabaseAsync(AnimeHubDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IServiceProvider serviceProvider)
        {
            // Ensure the context exists and connections are possible
            context.Database.EnsureCreated();            

            // --- 1. Identity Seeding ---
            await SeedRolesAsync(roleManager);
            await SeedUsersAsync(userManager, serviceProvider);

            // --- 2. Application Data Seeding ---
            await SeedApplicationDataAsync(context);
        }

        #region Seed Helper Methods

        // Separated identity seeding logic for clarity
        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roleNames = new[] { Roles.Administrator, Roles.Mage, Roles.Villager };

            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }        

        // Helper to create the initial admin (Mage) user
        private static async Task SeedUsersAsync(UserManager<IdentityUser> userManager, IServiceProvider serviceProvider)
        {
            const string adminEmail = "admin@animehub.com";
            const string adminUserName = "AnimeHubAdmin";

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminUserName,
                    Email = adminEmail,
                    EmailConfirmed = true,
                };

                // NOTE: Use a secure default password that should be changed immediately in development!
                var result = await userManager.CreateAsync(adminUser, "P@$$w0rd123");

                if (result.Succeeded)
                {
                    // Assign the custom Admin-level role
                    await userManager.AddToRoleAsync(adminUser, Roles.Mage);

                    // CRITICAL: Use the ServiceProvider to get the profile service
                    var profileService = serviceProvider.GetRequiredService<UserProfileInterface>();

                    // Manually create a RegisterDto-like object for the Admin
                    var adminDto = new RegisterDto
                    {
                        UserName = adminUserName,
                        Email = adminEmail,
                        FirstName = "Anime",
                        LastName = "Admin",
                        Birthday = new DateOnly(1990, 1, 1), // Default adult birthday
                        Location = "AnimeHub HQ"
                    };

                    await profileService.CreateProfileAsync(adminUser.Id, adminDto);
                }
            }
        }

        // Consolidated the existing application data seeding into a new async helper method
        private static async Task SeedApplicationDataAsync(AnimeHubDbContext context)
        {
            // 1. Seed Gallery Categories (Lookup Table)
            if (!context.GalleryImageCategories.Any())
            {
                context.GalleryImageCategories.AddRange(GalleryCategories);
                await context.SaveChangesAsync();
            }

            // 2. Seed Ayami Accessories first (Must be separate now)
            if (!context.AyamiAccessories.Any())
            {
                // Must turn IDENTITY_INSERT ON to insert explicit IDs
                context.Database.OpenConnection();
                try
                {
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.AyamiAccessories ON");
                    context.AyamiAccessories.AddRange(AllUniqueAccessories);
                    await context.SaveChangesAsync(); // Use async version
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.AyamiAccessories OFF");
                }
                finally
                {
                    context.Database.CloseConnection();
                }
            }

            // 3. Seed Ayami Profile and Attires/Links
            if (!context.AyamiProfiles.Any())
            {
                // Retrieve the accessories just seeded to correctly link them
                var seededAccessories = context.AyamiAccessories.ToList();

                var profile = GetAyamiProfileData(seededAccessories);
                context.AyamiProfiles.Add(profile);
                await context.SaveChangesAsync(); // Use async version
            }

            // 3. (Anime seeding will go here later)
        }

        #endregion
    }
}