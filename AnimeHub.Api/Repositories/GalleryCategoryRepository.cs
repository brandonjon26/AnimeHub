using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class GalleryCategoryRepository : BaseRepository<GalleryImageCategory>, IGalleryCategoryRepository
    {
        public GalleryCategoryRepository(AnimeHubDbContext context)
            : base(context)
        {
        }

        /// <summary>
        /// Retrieves a gallery category entity based on its Name, case-insensitive.
        /// </summary>
        /// <param name="name">The category name to search for.</param>
        /// <returns>The matching GalleryImageCategory entity, or null if not found.</returns>
        public async Task<GalleryImageCategory?> GetByNameAsync(string name)
        {
            // Use EF Core to find the category by name, ignoring case
            return await _context.Set<GalleryImageCategory>()
                                 .FirstOrDefaultAsync(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Creates a new category record in the database and returns its new ID.
        /// </summary>
        /// <param name="category">The new GalleryImageCategory entity to add.</param>
        /// <returns>The ID of the newly created category, or 0 if saving fails.</returns>
        public async Task<int> CreateNewCategoryAsync(GalleryImageCategory category)
        {
            await _context.Set<GalleryImageCategory>().AddAsync(category);

            // Save changes to commit the new record to the database
            int rowsAdded = await _context.SaveChangesAsync();

            // Check if the save was successful and return the generated ID
            return rowsAdded > 0 ? category.GalleryImageCategoryId : 0;
        }
    }
}
